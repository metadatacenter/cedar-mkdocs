# Embedding in a Framework

The CEE is a custom element, so it works with any framework that supports Web
Components. Three integration rules apply everywhere:

1. **Load the bundle as a script.** It registers the custom element and exports
   no runtime value.
2. **Assign objects as properties.** Attribute bindings convert objects to
   strings and cannot supply a template, instance, or configuration.
3. **Replace the element to load a different artifact.** Configuration and
   artifact inputs are accepted once. When the template or instance changes,
   give the element a new framework identity.

`eventHandler` is the exception to the third rule: a later assignment replaces
the previous handler.

## Angular

Allow the custom element in the module or standalone component that renders it:

```typescript
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  declarations: [MetadataPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MetadataPageModule {}
```

Use Angular property bindings, shown by square brackets:

```html
@for (artifact of artifacts; track artifact.key) {
  <cedar-embeddable-editor
    #cee
    [config]="ceeConfig"
    [templateObject]="artifact.template"
    [instanceObject]="artifact.instance"
    (change)="onChange($event)"
  ></cedar-embeddable-editor>
}
```

The tracked key must identify both the template and the instance. This ensures
that selecting another instance of the same template creates a new element:

```typescript
artifacts: { key: string; template: object; instance?: object }[] = [];

show(templateId: string, template: object, instanceId: string | null, instance?: object): void {
  this.artifacts = [{ key: `${templateId}:${instanceId ?? 'new'}`, template, instance }];
}
```

Read the metadata through the view reference:

```typescript
@ViewChild('cee') ceeRef?: ElementRef<CedarEmbeddableEditorElement>;

save(): void {
  const instance = this.ceeRef?.nativeElement.currentMetadata;
  // Save the instance.
}
```

Copy the bundle as an Angular asset:

```json
"assets": [
  {
    "glob": "cedar-embeddable-editor.js",
    "input": "node_modules/cedar-embeddable-editor",
    "output": "/assets"
  }
]
```

Then load it from `index.html`:

```html
<script src="assets/cedar-embeddable-editor.js"></script>
```

## React

Use a ref to assign the element's properties:

```jsx
import { useEffect, useRef } from 'react';

const config = {
  terminologyBaseUrl: 'https://terminology.metadatacenter.org/',
  bridgeBaseUrl: 'https://bridge.metadatacenter.org/',
};

export function MetadataEditor({ template, instance, onReady }) {
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;

    customElements.whenDefined('cedar-embeddable-editor').then(() => {
      const cee = ref.current;
      if (cancelled || !cee) return;

      cee.config = config;
      cee.templateAndInstanceObject = { templateObject: template, instanceObject: instance };
      onReady?.(cee);
    });

    return () => {
      cancelled = true;
    };
  }, [template, instance, onReady]);

  return <cedar-embeddable-editor ref={ref} />;
}
```

The parent supplies a key that changes with either half of the artifact:

```jsx
<MetadataEditor
  key={`${templateId}:${instanceId ?? 'new'}`}
  template={template}
  instance={instance}
  onReady={setEditor}
/>
```

Keying only on `templateId` is insufficient because users commonly open several
instances of one template. Load the bundle from `public/index.html`, or copy it
to `public/` during the build.

## Ember

Assign the properties from a modifier or component insertion hook:

```javascript
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MetadataEditorComponent extends Component {
  @action
  async setUpEditor(element) {
    await customElements.whenDefined('cedar-embeddable-editor');
    element.config = this.args.config;
    element.templateObject = this.args.template;
  }
}
```

{% raw %}
```handlebars
<cedar-embeddable-editor {{did-insert this.setUpEditor}} />
```
{% endraw %}

{% raw %}`{{did-insert}}`{% endraw %} runs once for each element. If the
artifact changes, use a keyed or conditional block that creates a new element.

## Other Frameworks

Use the same sequence in Vue, Svelte, or another framework:

1. obtain a reference to the element;
2. wait for `customElements.whenDefined('cedar-embeddable-editor')`;
3. assign `config` and the artifact properties once; and
4. read `currentMetadata` when the application needs the instance.

Vue can use a template `ref` and `:key`; Svelte can use `bind:this` and a keyed
block. Frameworks that reject unknown tags must be configured to allow the CEE
element.

## Keep the Published Bundle Intact

The npm bundle is already optimized. Copy it as a static asset rather than
including it in the host application's minification pipeline. A second
minification pass can corrupt class self-references and cause a `ReferenceError`
before the element is registered.

Use these checks in the browser console when diagnosing an empty editor:

```javascript
customElements.get('cedar-embeddable-editor'); // A constructor, not undefined.
window.cedarEmbeddableEditorVersion;           // The registered bundle version.
```

## Multiple Editors and Bundles

Multiple CEE elements on one page are independent. Each has its own
configuration, template, instance, and language.

Loading the bundle more than once is also safe: the first copy registers the
component and later copies stand down. `window.cedarEmbeddableEditorVersion`
identifies the registered version.

Runnable Angular, React, and Ember examples are available in
[metadatacenter/cedar-component-demo](https://github.com/metadatacenter/cedar-component-demo).

# Embedding in a Framework

The CEE is a custom element, so it works with any framework that supports Web
Components. Three integration rules apply everywhere:

1. **Load the bundle as a script.** It registers the custom element and exports
   no runtime value.
2. **Assign objects as properties.** Attribute bindings convert objects to
   strings and cannot supply a template, instance, or configuration.
3. **Replace the element to load a different stored instance.** Configuration
   and instance inputs are accepted once. Once an instance is supplied, its
   template is fixed too. Give a different editing session a new framework identity.

`eventHandler` may be replaced. A template-only preview may also replace its
template before an instance is supplied; see [Supply a Template](templates-and-metadata.md#supply-a-template).
The examples below create a fresh element for each document session.

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
  const cee = this.ceeRef?.nativeElement;
  if (cee?.dataQualityReport.canSave !== true) return;
  const snapshot = cee.captureSave();
  if (!snapshot) return;
  // Submit snapshot.metadata and reconcile the response with this snapshot.
}
```

Follow [Save an Instance](templates-and-metadata.md#save-an-instance) for exact
numeric serialization and server-assigned identifiers. Listen for both `change`
and `validationChange` when updating the host's save controls.

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

const config = {}; // Add the host's lookup service bases when needed.

export function MetadataEditor({ template, instance, onReady }) {
  const container = useRef(null);
  const readyCallback = useRef(onReady);
  readyCallback.current = onReady;

  useEffect(() => {
    let cancelled = false;
    const cee = document.createElement('cedar-embeddable-editor');
    container.current.replaceChildren(cee);

    customElements.whenDefined('cedar-embeddable-editor').then(() => {
      if (cancelled) return;

      cee.eventHandler = { ready: () => readyCallback.current?.(cee) };
      cee.config = config;
      if (instance) {
        cee.templateAndInstanceObject = { templateObject: template, instanceObject: instance };
      } else {
        cee.templateObject = template;
      }
    });

    return () => {
      cancelled = true;
      cee.remove();
    };
  }, [template, instance]);

  return <div ref={container} />;
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

Keep the template and instance object references stable during an editing session.
This effect creates and removes its own element, including during React's development
setup/cleanup cycle, so it never configures an existing element a second time.

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
4. observe changes and validation, then use the [save workflow](templates-and-metadata.md#save-an-instance)
   when the application submits the instance.

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

Use one bundle variant per page: the self-contained script or the
[host-font script](appearance.md#fonts). A coordinated host build may instead
consume `integration.mjs` with matching runtime dependencies. That module is a
build input, not the standalone script to copy into a plain HTML page. See the
[coordinated host build guide](https://github.com/metadatacenter/cedar-embeddable-editor/blob/main/README.md#coordinated-host-build).

Runnable Angular, React, and Ember examples are available in
[metadatacenter/cedar-component-demo](https://github.com/metadatacenter/cedar-component-demo).

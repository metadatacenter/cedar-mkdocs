# Embedding in a Framework

The CEE is a custom element, so every framework that can render a custom element can host it. What
differs between frameworks is only how they are persuaded to assign JavaScript properties rather
than HTML attributes, and how they are told that an unrecognized tag is intentional.

Two rules cover all of them.

**Load the bundle as a script, not as a module you import into a build.** The published file is a
self-contained classic script that registers the custom element and exports nothing. There is no
value to import, so bundling it as a dependency gains nothing and risks a second round of
minification, which can break it.

**Assign objects as properties.** Templates, instances, configuration and event handlers are
objects. Attribute bindings stringify, and a stringified object is not a template.

## Angular

Angular needs two things: permission to compile an unknown tag, and property bindings.

Add `CUSTOM_ELEMENTS_SCHEMA` to the module or component that renders the CEE:

```typescript
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  declarations: [MetadataPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MetadataPageModule {}
```

Then bind in the template. Square brackets are property bindings, which is exactly what the CEE wants:

```html
<cedar-embeddable-editor
  [config]="ceeConfig"
  [templateObject]="template"
  [instanceObject]="instance"
  (change)="onChange($event)"
></cedar-embeddable-editor>
```

Read the metadata back through a view reference:

```typescript
@ViewChild('cee') ceeRef!: ElementRef<CedarEmbeddableEditorElement>;

save(): void {
  const instance = this.ceeRef.nativeElement.currentMetadata;
  // ...
}
```

`CedarEmbeddableEditorElement` comes from the package's declarations, described in
[Configuration](configuration.md#typescript-declarations).

Serve the script itself as a copied asset:

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

Set properties through a ref rather than through JSX props. This works the same way in every React
version, because it bypasses the question of whether React treats an unknown prop on a custom
element as an attribute or as a property:

```jsx
import { useEffect, useRef } from 'react';

const config = {
  showSampleTemplateLinks: false,
  showTemplateSourceData: false,
  showInstanceDataFull: false,
  terminologyIntegratedSearchUrl:
    'https://terminology.metadatacenter.org/bioportal/integrated-search',
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

The `onReady` callback hands the element back to the parent, which is the simplest way to keep
`currentMetadata` reachable from a save button that lives elsewhere in the tree.

Load the script from `public/index.html`, or copy it into `public/` during the build.

## Ember

Ember renders unknown tags without complaint, so only the property assignment needs arranging. A
modifier or a component's `didInsertElement` hook does the job:

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

## Any Other Framework

The pattern is the same everywhere. Obtain a reference to the element, await the custom-element
definition, assign the properties, and read `currentMetadata` when the application needs the
metadata. In Vue that reference comes from a template `ref` and the assignment goes in `onMounted`;
in Svelte, from `bind:this`. Frameworks that check tag names against a known list need the CEE's tag
added to it, as Angular does through `CUSTOM_ELEMENTS_SCHEMA`.

## Do Not Minify the Bundle Again

The published file has already been optimized. Passing it through a second minifier — by listing it
among a build's own scripts rather than copying it as an asset — can break it, and the failure is
quiet.

The mechanism is worth knowing, because the symptom does not point at its cause. The bundle contains
minified class expressions of the form `var A = class B extends Error { static X = new B('X'); }`.
A second minifier can decide the outer binding is unused, drop it, keep the static initializers, and
rename the inner self-reference to the name it just deleted. The file still loads, then throws a
`ReferenceError` before the custom element registers, and the page renders an empty
`<cedar-embeddable-editor>` with nothing in the console to connect the two.

Copy the file and load it with a `<script>` tag. To confirm a deployment is healthy, ask the browser
console whether the element registered:

```javascript
customElements.get('cedar-embeddable-editor');   // a constructor, not undefined
window.cedarEmbeddableEditorVersion;             // the version that won the bootstrap
```

## More Than One Editor on a Page

Two `<cedar-embeddable-editor>` elements on the same page are independent. Each keeps its own
configuration, template, instance and language, so a page can show two forms with different
templates, or the same template in an editing and a read-only view.

Loading the bundle twice is also safe. The script claims a page-wide bootstrap slot before its
framework starts, so a second copy stands down rather than replacing a registration already in
place. The version that won is readable at `window.cedarEmbeddableEditorVersion`, which is the
quickest way to settle which copy a page is actually running.

## Worked Examples

The [metadatacenter/cedar-component-demo](https://github.com/metadatacenter/cedar-component-demo)
repository holds small runnable applications that embed the CEE in Angular, React and Ember, each with
its own README.

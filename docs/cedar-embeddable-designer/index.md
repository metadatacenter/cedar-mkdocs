# CEDAR Embeddable Designer

The CEDAR Embeddable Designer (CED) adds visual metadata template authoring to an
existing web application. Authors assemble fields and reusable groups, define
which values those fields accept, and preview the form that will collect the
metadata. The host receives a [CEDAR template](../yaml-spec/templates-core.md)
that it can store and use in its own workflow.

CED is a framework-independent
[Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).
Its JavaScript bundle can be loaded into a plain HTML page or an application
built with Angular, React, or another web framework. Basic template authoring
does not require a CEDAR account or a running CEDAR installation.

## Why Use CED?

A metadata standard describes what to collect: field names, value types,
requirements, repeatable groups, and vocabulary bindings. CED lets the people
responsible for that standard maintain a machine-readable template through a
visual interface, without hand-writing a schema or developing an authoring tool.

## How the Components Fit Together

CEDAR provides three embeddable components for template authoring, vocabulary
selection, and metadata entry:

| Component | Role | Result |
|---|---|---|
| CEDAR Embeddable Designer (CED) | Authors templates and reusable elements, including their fields, structure, constraints, and defaults. | A template or element definition; the included Field Designer authors standalone fields. |
| [CEDAR Embeddable Term Picker (CETP)](../cedar-embeddable-term-picker/index.md) | Searches vocabularies and selects constraints and default terms during authoring. | Vocabulary selections for the host to apply; ontology-property selection is also available. |
| [CEDAR Embeddable Editor (CEE)](../cedar-embeddable-editor/index.md) | Renders the template for metadata entry or read-only display. | A metadata instance containing the values entered against that template. |

An author designs a template in CED and uses its embedded Term Picker to define
the vocabularies a field draws from. CED applies those selections to the field
definition. The host stores the template and supplies a selected version to
CEE. A researcher completes the resulting form, and the host stores the
metadata instance.

CEE also supplies the form preview inside CED, and the CEF widget included in
CEE's bundle supplies individual field controls. Each component is a separate
package. The host loads the sibling bundles and configures the services, then
CED manages its embedded preview and pickers. Authentication, template version
choices, reusable content, and saving or publishing remain the host's
responsibility.

CETP can also be embedded independently for vocabulary selection. A host
collecting metadata from an existing template needs only CEE, whose
controlled-term fields perform their own lookup through the configured
terminology service.

See [Your First Embedded Term Picker](../cedar-embeddable-term-picker/first-picker.md)
for standalone vocabulary selection, and
[Your First Embedded Editor](../cedar-embeddable-editor/first-editor.md)
to collect metadata from a finished template.

## Templates, Elements, and Fields

CED authors both whole templates and standalone
[elements](../yaml-spec/elements-core.md), which group related fields for reuse.
Elements can contain other elements. Existing fields and elements can be selected
from a repository supplied by the host.

The same bundle includes the **CEDAR Embeddable Field Designer (CEFD)** for
authoring an individual field definition. It shares CED's controls and validation.
See [Designing a Single Field](field-designer.md).

These are schema artifacts, which describe a form. The metadata records entered
into that form are instances, produced by CEE.

## What Goes In and What Comes Out

The designer accepts templates and elements in CEDAR's JSON Schema representation
with JSON-LD annotations, or in [CEDAR YAML](../yaml-spec/index.md). Its public
output is the complete root artifact as a JavaScript object, including edits to
nested content. The shared model library handles serialization.

The host checks the validation report before reading an artifact for saving.
Unfinished settings may be invalid even when the last accepted artifact is valid.
[Artifacts and Validation](artifacts-and-validation.md) explains the input,
output, validation, and recovery APIs.

## Optional Services and Components

| Feature | What the Host Supplies |
|---|---|
| Form preview and field default controls | The CEE bundle, which also registers CEF. |
| Controlled-term constraints and defaults | The [Term Picker](../cedar-embeddable-term-picker/index.md) bundle and a compatible CEDAR terminology service. |
| External-authority defaults | CEF and a CEDAR bridge service. |
| Reusable fields, elements, and versions | A host repository adapter with permission-filtered search and retrieval. |
| Saving and publishing | The host application's own workflow and persistence. |

Service endpoints have no defaults. Features that need an absent component or
service report that they are unavailable. Configure them explicitly as described
in [Configuration and Appearance](configuration.md).

## Start Here

- [Your First Embedded Designer](first-designer.md) installs the packages and builds a working page.
- [Artifacts and Validation](artifacts-and-validation.md) covers loading, saving, host findings, and recovery.
- [Reusable Fields and Elements](reusable-content.md) connects a repository and explains version handling.
- [Designing a Single Field](field-designer.md) introduces CEFD.
- [Configuration and Appearance](configuration.md) covers service endpoints, language, styling, and framework integration.

CED requires a browser with native Custom Elements and Shadow DOM support. The
package is distributed under the [BSD 2-Clause
license](https://github.com/metadatacenter/cedar-embeddable-designer/blob/develop/license.txt).
Source and release notes are available in the
[GitHub repository](https://github.com/metadatacenter/cedar-embeddable-designer).

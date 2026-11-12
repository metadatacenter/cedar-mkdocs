# CEDAR Embeddable Term Picker

The CEDAR Embeddable Term Picker (CETP) adds vocabulary search and selection to an
existing web application. Authors search once across ontologies, branches,
individual terms, value sets, and ontology properties, then choose the entries
their application needs.

The CETP is a framework-independent
[Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components),
distributed as a JavaScript bundle. It can be used from plain HTML, Angular,
React, or another web framework. Search requires a compatible CEDAR terminology
service supplied by the host.

<a id="why-use-the-term-picker"></a>

## Why Use the CETP?

A controlled-term field needs more than a list of labels. Its definition must
identify which vocabulary, branch, terms, or value set provides the allowed
values. Those identifiers let different applications interpret the resulting
metadata consistently.

The picker lets an author discover and assemble those definitions visually.
One query updates match counts across the enabled categories, so authors can see
which kinds of results are available before opening a category. They can narrow
the search to particular vocabularies and inspect available ontology releases.

## How the Components Fit Together

CEDAR provides three embeddable components for template authoring, vocabulary
selection, and metadata entry:

| Component | Role | Result |
|---|---|---|
| [CEDAR Embeddable Designer (CED)](../cedar-embeddable-designer/index.md) | Authors templates and reusable elements, including their fields, structure, constraints, and defaults. | A template or element definition; the included Field Designer authors standalone fields. |
| CEDAR Embeddable Term Picker (CETP) | Searches vocabularies and selects constraints and default terms during authoring. | Vocabulary selections for the host to apply; ontology-property selection is also available. |
| [CEDAR Embeddable Editor (CEE)](../cedar-embeddable-editor/index.md) | Renders the template for metadata entry or read-only display. | A metadata instance containing the values entered against that template. |

In a typical workflow, an author designs a template in the CED and uses the CETP to
choose its controlled vocabularies and default terms. The CED applies those
selections to the field definition. The host stores the template and supplies
a selected version to the CEE, which collects the metadata instance the host saves.

Each component is a separate package. A host using the CED loads the CETP and configures
the designer's terminology endpoint; the CED manages its embedded pickers. The CEE also
provides the CED's form preview, and its included CEF widget supplies individual
field controls. The host owns authentication, template version choices, and
saving templates and instances.

The CETP can also be embedded independently: the host receives selections and
decides how to apply them. A host filling an existing template needs only the CEE,
whose controlled-term fields perform their own lookup through the configured
terminology service.

See [Your First Embedded Designer](../cedar-embeddable-designer/first-designer.md)
to use the picker within template authoring, and
[Your First Embedded Editor](../cedar-embeddable-editor/first-editor.md)
to collect metadata from the resulting template.

<a id="three-selection-workflows"></a>

## What Goes In and What Comes Out

The host supplies a terminology endpoint, a selection mode, and any existing
constraints or vocabulary scopes. The CETP returns structured selections through
events; it does not produce or save a complete template.

| Workflow | Result |
|---|---|
| Field constraints | A set of ontologies, branches, individual terms, or value sets defining a field's allowed values. |
| Default term | One term selected within a field's existing constraints. |
| Ontology property | An object, datatype, or annotation property for the host's own semantic mapping workflow. |

Property selections are distinct from the class/value constraints of a
controlled-term field. The host decides where a selected property belongs.
[Constraints and Selections](selections.md) explains the input properties,
selection events, cancellation, and version information.

## Services and Host Responsibilities

| Part | Responsibility |
|---|---|
| The CETP | Displays search results, supports exploration, and returns selections. |
| CEDAR terminology service | Searches and resolves vocabularies and their versions, using its local store or supported upstream sources such as BioPortal. |
| Host application | Configures the service and selection mode, supplies existing constraints, and decides how to apply and store the result. |

Search requires a compatible version-aware CEDAR terminology service. Configure
its base URL explicitly; the CETP does not select a public service for the host.
See [Configuration and Appearance](configuration.md) for endpoint requirements,
CORS, and host network policy.

## Browser and Accessibility Support

The CETP requires native Custom Elements and Shadow DOM support. Its interface
is available in English and Hungarian. Keyboard navigation, focus handling,
contrast, and responsive layouts are covered by automated checks; WCAG 2.2 AA
is the accessibility target. The host remains responsible for its surrounding
page and for testing the complete workflow with assistive technology.

<a id="start-here"></a>

## Get Started

- [Your First Embedded Term Picker](first-picker.md) installs the package and builds a page connected to a terminology service.
- [Constraints and Selections](selections.md) explains the table workflow, individual defaults, properties, and vocabulary versions.
- [Configuration and Appearance](configuration.md) covers endpoints, language, theming, framework integration, and troubleshooting.

## Source and Releases

The package is distributed under the
[BSD 2-Clause license](https://github.com/metadatacenter/cedar-embeddable-term-picker/blob/develop/license.txt).
Source and release notes are available in the
[GitHub repository](https://github.com/metadatacenter/cedar-embeddable-term-picker).

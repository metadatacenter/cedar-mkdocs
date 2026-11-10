# CEDAR Embeddable Term Picker

The CEDAR Embeddable Term Picker (CETP) adds vocabulary search and selection to an
existing web application. Authors search once across ontologies, branches,
individual terms, value sets, and ontology properties, then choose the entries
their application needs.

CETP is a framework-independent
[Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components),
distributed as a JavaScript bundle. It can be used from plain HTML, Angular,
React, or another web framework. Search requires a compatible CEDAR terminology
service supplied by the host.

## Why Use the Term Picker?

A controlled-term field needs more than a list of labels. Its definition must
identify which vocabulary, branch, terms, or value set provides the allowed
values. Those identifiers let different applications interpret the resulting
metadata consistently.

The picker lets an author discover and assemble those definitions visually.
One query updates match counts across the enabled categories, so authors can see
which kinds of results are available before opening a category. They can narrow
the search to particular vocabularies and inspect available ontology releases.

| Part | Responsibility |
|---|---|
| CETP | Displays search results, supports exploration, and returns selections. |
| CEDAR terminology service | Searches and resolves vocabularies and their versions, using its local store or supported upstream sources such as BioPortal. |
| Host application | Configures the service and selection mode, supplies existing constraints, and decides how to apply and store the result. |

## Three Selection Workflows

| Workflow | Result |
|---|---|
| Field constraints | A set of ontologies, branches, individual terms, or value sets defining a field's allowed values. |
| Default term | One term selected within a field's existing constraints. |
| Ontology property | An object, datatype, or annotation property for the host's own semantic mapping workflow. |

Property selections are distinct from the class/value constraints of a
controlled-term field. The host decides where a selected property belongs.

[Constraints and Selections](selections.md) explains the input properties,
selection events, cancellation, and version information.

## How It Works With CEDAR's Other Components

The [CEDAR Embeddable Designer](../cedar-embeddable-designer/index.md) uses CETP
to author vocabulary constraints and select controlled-term defaults. A host
using CED loads the picker bundle and configures the designer's terminology
endpoint; the designer manages its embedded pickers.

The [CEDAR Embeddable Editor](../cedar-embeddable-editor/index.md) renders the
finished template for metadata entry and performs its own value lookup. An
application can also embed CETP independently when it needs a vocabulary
selection interface without a full template designer.

## Start Here

- [Your First Embedded Term Picker](first-picker.md) installs the package and builds a page connected to a terminology service.
- [Constraints and Selections](selections.md) explains the table workflow, individual defaults, properties, and vocabulary versions.
- [Configuration and Appearance](configuration.md) covers endpoints, language, theming, framework integration, and troubleshooting.

The interface is available in English and Hungarian. The component requires
native Custom Elements and Shadow DOM support and is distributed under the
[BSD 2-Clause license](https://github.com/metadatacenter/cedar-embeddable-term-picker/blob/develop/license.txt).
Source and release notes are available in the
[GitHub repository](https://github.com/metadatacenter/cedar-embeddable-term-picker).

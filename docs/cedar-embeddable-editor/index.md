# CEDAR Embeddable Editor

The CEDAR Embeddable Editor (CEE) adds structured metadata forms to an existing web
application. The host supplies a [CEDAR template](../yaml-spec/templates-core.md),
and the CEE renders the corresponding form. As the user completes it, the host can
read the resulting [metadata instance](../yaml-spec/instances-core.md) as JSON-LD or
YAML.

The CEE is a framework-independent
[Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components),
distributed as a single JavaScript file. It can be embedded in a plain HTML page or
used from Angular, React, Ember, and other web frameworks. It does not require a CEDAR
account or a running CEDAR installation to render a form.

## Why Use the CEE?

CEDAR templates express metadata requirements in a form that software can interpret.
A template defines the fields to collect, their types and cardinalities, validation
constraints, repeatable groups, and any controlled vocabularies or identifier
authorities associated with them.

The CEE turns that specification into a working interface. A platform can therefore
adopt or revise a metadata standard without writing a new form for every template.
Researchers enter metadata without leaving the platform they already use, while the
platform keeps control of template selection, persistence, and the surrounding
workflow.

The division of responsibilities is:

| Part | Responsibility |
|---|---|
| Template author | Defines the metadata structure, constraints, labels, and vocabulary bindings. |
| CEE | Renders the form, validates input, resolves configured terms and identifiers, and serializes the instance. |
| Host application | Supplies the template, stores the metadata, chooses service endpoints, and decides when a record may be submitted. |

The same component also supports read-only display, so a platform can use one renderer
for both authoring and reviewing metadata.

## What Goes In and What Comes Out

The CEE accepts templates in CEDAR's JSON Schema or YAML representation. It can start
with an empty form or load an existing instance for editing.

The resulting instance contains more than display text. A controlled term records its
IRI as well as its label, and an external-authority field records a persistent
identifier such as an ORCID, ROR, DOI, PubMed ID, RRID, NIH grant identifier, or PFAS
identifier. This preserves the semantics needed for validation, indexing, and reuse.

[Templates and Metadata](templates-and-metadata.md) describes the input properties,
output properties, and change event in detail.

## Optional Network Services

Rendering, editing, local validation, and serialization all happen in the browser.
Network access is needed only for features that depend on remote data or content:

| Feature | Source |
|---|---|
| Controlled-term suggestions | The CEDAR terminology service configured by the host. |
| External-authority lookup | The CEDAR bridge service configured by the host. |
| Additional interface languages | A language-map location configured by the host. |
| Images and videos in a template | The origins named by the template author. |

Neither CEDAR service has a default endpoint. If the host does not configure one, the
corresponding lookup feature is unavailable but the rest of the form continues to
work. The CEE never stores or submits the completed metadata; the host application
decides where it goes.

See [Security](security.md) for the trust model, network requests, and content security
policy guidance.

## Current Limits

The CEE is intended for template-driven forms. It does not currently provide:

- conditional branching based on earlier answers;
- validation rules that compare multiple fields; or
- spreadsheet-style bulk entry.

For tabular workflows, see
[CEDAR's spreadsheet tooling](https://www.nature.com/articles/s41597-025-04589-6).

## Deployments

The CEE is used for metadata entry in the Open Science Framework and Dryad, and for
read-only presentation in the RADx Data Hub and HuBMAP. The HuBMAP templates used by
Dryad and OSF are the same exported templates: each platform supplies its own
configuration and integrates the resulting metadata into its own workflow.

These deployments illustrate the main design goal of the CEE: a community can define
a machine-actionable metadata standard once and use it in several independent
applications without rebuilding the authoring interface for each one.

## Browser and Accessibility Support

The CEE requires native Custom Elements and Shadow DOM support. Its automated browser
suite covers current Chromium, Firefox, and WebKit engines; partner deployments have
also tested releases in Chrome, Firefox, Safari, Edge, and selected mobile browsers.
Internet Explorer, EdgeHTML, and web views without these Web Component APIs are not
supported.

The editor is designed for keyboard and screen-reader use, with WCAG AA as its
accessibility target.

## Get Started

- [Build Your First Embedded Editor](first-editor.md).
- [Integrate the CEE with a Framework](frameworks.md).
- [Configure Services and Behavior](configuration.md).
- [Work with Controlled Terms and External Authorities](controlled-terms.md).
- [Read Validation Results](validation.md).

## Citation and Source

The design, architecture, and deployments are described in:

> O'Connor, M.J., Martinez-Romero, M., Egyedi, A.L., Akdogan, M.U., Dorf, M.V. and
> Musen, M.A. 2026. [Author Once, Publish Everywhere: Portable Metadata Authoring
> with the CEDAR Embeddable Editor](https://doi.org/10.5334/dsj-2026-002).
> *Data Science Journal*, 25: 2, pp. 1-18.

Source code is available from
[metadatacenter/cedar-embeddable-editor](https://github.com/metadatacenter/cedar-embeddable-editor)
under the BSD 2-Clause License.

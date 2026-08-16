# Introduction

The CEDAR Embeddable Editor (CEE) is a
[Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) that turns a
[CEDAR template](../../yaml-spec/cedar-model.md#templates) into a metadata entry form, and the
completed form into CEDAR metadata. It ships as one JavaScript file. A web page loads that file. The
application gives the component a template, and takes the metadata back.

A data repository can collect submission metadata on its own pages. A laboratory information system
can capture experiment descriptions in its own workflow. Neither writes a line of metadata
user-interface code, and neither sends its users to another site. Both get the form behavior, the
controlled vocabularies and the output of the CEDAR Workbench, inside their own application.

## Why It Exists

The FAIR principles have become a cornerstone of research data policy, but their implementation
often remains aspirational, especially in domains lacking dedicated tooling. They ask for metadata
that is rich and relevant to a research community without saying how either quality should be
represented. CEDAR's answer is the machine-actionable template: a community standard written down
in a form software can act on, rather than a document people are asked to follow.

That answer was originally delivered through a single application. Researchers authored metadata in
the CEDAR Workbench, and any platform that wanted CEDAR metadata had to send its users there and
then get the result back. Integrations built that way were expensive on both sides. Users left the
environment they were working in. Platform operators wrote transformations, brokered a second login,
kept their own copy of each template synchronized by hand, and did it again whenever a standard
changed.

The CEE removes the round trip. The template renders inside the host application, which receives
the metadata directly. Two consequences follow, and between them they are the case for embedding the
CEE rather than building a form:

- **There is no metadata interface to build or maintain.** Presentation and data-creation logic
  live in the component. A platform adds a tag, not a form.
- **Standards can evolve without a redeployment.** A revised field definition, a new required value
  or a different ontology binding reaches the rendered form the next time the template loads, with
  no change to the application embedding it.

Through real-time validation, persistent identifier resolution and ontology-based field
constraints, the CEE helps ensure that the metadata researchers submit are not only structured and
complete, but semantically meaningful and machine-interpretable. Because those features are encoded
in reusable templates and enforced by the editor, a platform can raise its metadata quality floor
without burdening researchers with extra training or manual standards compliance. The CEE shifts
FAIR from a set of external recommendations into an embedded capability, making adherence to best
practices a natural outcome of the submission process.

That separation also settles who owns what. Community curators and standards leads govern templates
in the CEDAR Workbench. Platforms decide when to adopt a template version, and keep control of
their own storage, indexing and workflow. Neither has to wait on the other.

More on the motivation for developing the CEE is in [*Author Once, Publish Everywhere: Portable
Metadata Authoring with the CEDAR Embeddable Editor*](https://doi.org/10.5334/dsj-2026-002).

## What the Template Decides

A [CEDAR template](../../yaml-spec/templates-core.md) specifies the
[fields](../../yaml-spec/fields-core.md) to collect, the
[type](../../yaml-spec/field-types/index.md) of each one, the constraints each value must satisfy,
the [elements](../../yaml-spec/elements-core.md) that group fields and let a group repeat, and the
[controlled vocabularies](../../yaml-spec/field-types/controlled-term-field.md) that certain fields
draw their values from. The CEE reads that specification at run time and builds the form to match.

Changing the metadata a form collects therefore means changing the template, not the
application. A template author can add a field, tighten a constraint, or bind a
field to a different ontology, and every application embedding the CEE picks the change up the next
time it loads that template.

## What the CEE Produces

The CEE produces a [CEDAR instance](../../yaml-spec/instances-core.md): the values a person entered,
carrying the identifiers and types that make the metadata machine-actionable rather than a bag of
strings. An instance records which template it was built from, so the metadata can later be
validated, indexed, and compared against others of its kind.

A [field bound to an ontology](../../yaml-spec/field-types/controlled-term-field.md) stores the
term's IRI alongside its label, so "Alzheimer's disease" in a form becomes a reference to
`DOID:10652` in the metadata. A field bound to an
[external authority](../../yaml-spec/field-types/external-authority-fields.md) stores a persistent
identifier: an ORCID for a person, a ROR for an institution, a DOI for a publication.

Instances travel in as well as out. Handing the CEE a template together with an existing instance
of it opens the form with those values in place, which turns the component from a capture form into
an editor.

## Two Serializations

The CEDAR model is defined on its own terms, independently of how an artifact is written down. It
can be written down in two ways, and the CEE handles both. A template can come in as either, an
instance can go out as either, and the two choices are unrelated.

A template is supplied as **JSON Schema** or as **YAML**. Both are read through the same model
library, so a template written either way builds the same editor. The CEDAR Workbench exports the
JSON Schema form, which is also the default. [The CEDAR Model YAML
Specification](../../yaml-spec/index.md) defines the YAML form. The CEDAR REST APIs serve
both, so an application fetching a template from CEDAR can ask for whichever it prefers.

An instance is returned as **JSON-LD** or as **YAML**. CEDAR stores, validates and indexes the
JSON-LD form. The YAML form carries the same instance in the serialization that specification
defines.

A template may be supplied in either form and the CEE recognizes which it is given. An instance is
returned as JSON-LD through `currentMetadata` and as YAML through `currentMetadataYaml`, so an
application reads whichever it wants without configuring anything.
[Templates and Metadata](../templates-and-metadata.md) covers both directions in full.

## What the CEE Needs

A browser and a template are all the CEE needs. It runs entirely in the page and does not require a
CEDAR installation, a CEDAR account, or any CEDAR service to render a form and produce metadata.

Two capabilities do reach the network, and both are optional:

- **Term lookup.** A field constrained to an ontology, a branch, a class, or a value set offers
  suggestions as the user types. Those come from a CEDAR terminology service, configured with a
  single URL. Without it, the rest of the form works and controlled fields simply offer nothing.
- **External authority lookup.** ORCID, ROR, DOI, PubMed, RRID, NIH Grant and PFAS fields resolve
  identifiers through the CEDAR bridge service, which is configured with a base URL and defaults to
  CEDAR's production deployment.

Everything else — rendering, editing, repeating groups, constraint checking, serialization — happens
locally.

## What the CEE Does Not Do

A few requirements fall outside CEDAR's current metadata model. Meeting one of them means building
it outside the editor, so check for them before committing to the CEE.

- **Conditional logic.** Dynamic field branching, and skipping questions on the strength of earlier
  answers, are not supported. Clinical studies, environmental assessments and longitudinal
  collection instruments frequently need them.
- **Cross-field validation.** Rules whose outcome depends on more than one field are not supported.
  Every value is checked against its own constraints alone.
- **Tabular entry.** The editor is form-based, so bulk entry, and records that align naturally with
  a spreadsheet, are served better by
  [CEDAR's spreadsheet tooling](https://www.nature.com/articles/s41597-025-04589-6).

The first two are planned, together with a more expressive constraint language.

## Where It Is Used

Many open data environments face a tension between broad accessibility and domain specificity.
Generalist platforms must support heterogeneous users and content types, while domain repositories
demand high-quality, semantically rich metadata. Embedding the CEE with discipline-specific
templates lets a generalist platform support structured metadata capture without fragmenting its
infrastructure or duplicating interface logic, which is what drew most of its adopters.

As an authoring interface, the **Open Science Framework** invokes the CEE during dataset submission and
project registration: a researcher picks a discipline-specific template, and the CEE renders it inside
OSF. **Dryad** does the same during dataset submission, with a neuroscience template and a set of
templates from the HuBMAP Consortium.

As a viewer, the **RADx Data Hub** presents metadata records for COVID-19 diagnostic projects
through the CEE in read-only mode, and **HuBMAP** uses it as the public interface for inspecting every
metadata template the consortium uses. One component both collects the metadata and displays it,
so a reviewer sees the record laid out the way its author entered it.

That portability is not incidental. The HuBMAP templates leave the CEDAR Workbench once and embed
in both Dryad and OSF **without modification**, each platform applying its own configuration and
styling. Host platforms have deployed the CEE in React, Django and custom
JavaScript environments.

Datasets are the common case rather than the limit. The same template-driven approach applies to
any digital research object needing structured, standards-aligned metadata, including instruments,
protocols, software and project-level records.

## Browser Support

The CEE requires native
[Custom Elements v1](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
and native
[Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM).
It supports the browser targets of the Angular version it is built with, and its automated
compatibility suite runs against current desktop Chromium, Firefox and WebKit engines. Partner
platforms have additionally validated releases in Chrome, Firefox, Safari and Edge, and on a
selection of mobile devices.

Internet Explorer, legacy EdgeHTML, and any embedded web view without `window.customElements` and
Shadow DOM are not supported. The CEE deliberately does not polyfill the page that hosts it: an
application that must support browsers outside this contract loads and maintains its own
[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) polyfills before
loading the CEE.

## Accessibility

The CEE is built for complete keyboard operation and for screen-reader use, through standardized
WAI-ARIA role annotations on the controls it renders. Assessments run by embedding platforms have
driven successive refinements to those annotations, to keyboard navigation, and to screen-reader
cues, with WCAG AA as the target.

## Citation and Source

> O'Connor, M.J., Martinez-Romero, M., Egyedi, A.L., Akdogan, M.U., Dorf, M.V. and Musen, M.A. 2026.
> [Author Once, Publish Everywhere: Portable Metadata Authoring with the CEDAR Embeddable
> Editor](https://doi.org/10.5334/dsj-2026-002). *Data Science Journal*, 25: 2, pp. 1–18.
> DOI: [10.5334/dsj-2026-002](https://doi.org/10.5334/dsj-2026-002)

The source is at
[metadatacenter/cedar-embeddable-editor](https://github.com/metadatacenter/cedar-embeddable-editor),
under the BSD 2-Clause License, and is maintained by the Division of Computational Medicine at
Stanford University alongside the rest of the CEDAR Workbench. Its
[README](https://github.com/metadatacenter/cedar-embeddable-editor#readme) covers building the
component from source, running its tests, and publishing a release.

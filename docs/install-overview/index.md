# Overview
The CEDAR project can be installed in several ways, depending on the planned usage of the system.

The intended install types are in the following table. The highlighted links are installation types that are available today.

| Install Type                 | Description |
| -----------                  | ----------- |
| [Native for Developer](../install-developer/overview/)         | Installed onto a developer machine. The configuration options can be changed. All components of the system can be changed and recompiled. |
| Native for Production / Test | Installed onto a test or production server. The configuration options can be changed. |
| [Docker](../install-docker/overview/)        | Installs the complete application on one machine with fixed local domain names and configurable application settings. |
| Docker for production        | Installed onto a test or production server. The domain name can be changed, the crucial configuration options can/should be changed. |

## Embed CEDAR in an Existing Application

The embeddable components are available as npm packages. Each provides a Web
Component that a host can load into an existing page, independently of a full
CEDAR installation. The host controls its own authentication, storage, and
workflow; lookup features use configured CEDAR services.

Choose the component for the workflow your application needs:

| Component | When to Use It | First Integration |
|---|---|---|
| [CEDAR Embeddable Editor (CEE)](../cedar-embeddable-editor/index.md) | You have a template and want users to fill in metadata or review existing records in a form. | [Your First Embedded Editor](../cedar-embeddable-editor/first-editor.md) |
| [CEDAR Embeddable Designer (CED)](../cedar-embeddable-designer/index.md) | Your users need to create or maintain the templates, reusable elements, and field definitions that describe what metadata to collect. | [Your First Embedded Designer](../cedar-embeddable-designer/first-designer.md) |
| [CEDAR Embeddable Term Picker (CETP)](../cedar-embeddable-term-picker/index.md) | Your users need to choose a field's allowed vocabularies or default terms, or select ontology properties. Search requires a compatible CEDAR terminology service. | [Your First Embedded Term Picker](../cedar-embeddable-term-picker/first-picker.md) |

The components can work together: an author designs a template in CED and uses
its embedded CETP to choose controlled vocabularies and default terms. The host
stores the template and passes a selected version to CEE. Users complete the
form, and the host stores the resulting metadata instances separately from
the template definition.

Use CEE on its own when you already have templates: its controlled-term fields
perform their own lookup through the configured terminology service. Add CED
when users need to author templates, or embed CETP independently when they need
vocabulary selection. CED also uses CEE for form previews and individual field
controls. Each component is a separate package; the host loads the bundles and
configures the services needed for its chosen workflow.

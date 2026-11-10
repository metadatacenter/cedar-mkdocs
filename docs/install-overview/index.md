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

| Component | Purpose | First Integration |
|---|---|---|
| [CEDAR Embeddable Editor (CEE)](../cedar-embeddable-editor/index.md) | Render a template as a form for entering or viewing metadata. | [Your First Embedded Editor](../cedar-embeddable-editor/first-editor.md) |
| [CEDAR Embeddable Designer (CED)](../cedar-embeddable-designer/index.md) | Create and edit templates, reusable elements, and standalone field definitions. | [Your First Embedded Designer](../cedar-embeddable-designer/first-designer.md) |
| [CEDAR Embeddable Term Picker (CETP)](../cedar-embeddable-term-picker/index.md) | Search vocabularies and select field constraints, default terms, or ontology properties. Requires a compatible terminology service. | [Your First Embedded Term Picker](../cedar-embeddable-term-picker/first-picker.md) |

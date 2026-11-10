# CEDAR Documentation

Welcome to the documentation for CEDAR, the Center for Expanded Data Annotation and Retrieval.

These manuals bring together everything you need to use, install, develop, and operate CEDAR:

* [**CEDAR User Guide**](user-overview/index.md) - describing the purpose of CEDAR, the usage of the UI and also how to interact with our REST API
* [**Install Guides**](install-overview/index.md) - describing how to install CEDAR or add its components to an existing application.
* [**Developer Guide**](developer-overview/index.md) - presenting the CEDAR model and a quick intro into our REST API
* [**YAML Specification**](yaml-spec/index.md) - a reference for the YAML serialization of the CEDAR model
* [**Operations and Management**](operations-and-management.md) - presenting an overview of our processes

## Embed CEDAR in Your Application

Add template authoring, vocabulary selection, and metadata entry to your own
web application with CEDAR's embeddable Web Components. They are available as
separate npm packages, and your application controls authentication and storage.

| Component and Guide | What It Does |
|---|---|
| [CEDAR Embeddable Editor (CEE)](cedar-embeddable-editor/index.md) | Turns templates into forms for entering metadata or reviewing existing records. |
| [CEDAR Embeddable Designer (CED)](cedar-embeddable-designer/index.md) | Lets authors visually create and edit templates, reusable elements, and field definitions. |
| [CEDAR Embeddable Term Picker (CETP)](cedar-embeddable-term-picker/index.md) | Searches controlled vocabularies and lets authors choose field constraints, default terms, or ontology properties. |

Use CED and CETP to define a template, then supply it to CEE to collect metadata.
If you already have templates, CEE can render them on its own. CETP can also be
used independently for vocabulary selection. Lookup features use configured
CEDAR services.

The [install overview](install-overview/index.md#embed-cedar-in-an-existing-application)
explains when to use each component and links to the getting-started guides.

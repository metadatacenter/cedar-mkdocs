# Developer Guide

CEDAR development has two sides. Some developers work on CEDAR itself: they change one or more
repositories, rebuild the affected software, and run a native, hybrid, or Docker deployment. Other
developers build applications that use CEDAR through its model, libraries, and REST APIs. This
guide covers both.

The [cedarcli Manual](../developer-guide/cedarcli/) explains the first workflow. It starts with the
Git repository estate, follows Java and frontend code through local builds and immutable build
trains, and then shows how the same software is run in each supported deployment mode.

The remaining chapters cover programmatic use. They build on the
[CEDAR model](../yaml-spec/cedar-model.md), which defines templates, elements, fields, and metadata
instances. The Java and TypeScript libraries create those artifacts in code, while the REST API
stores, validates, searches, and retrieves them from a running CEDAR system.

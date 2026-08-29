# CEDAR MCPs Tutorial

Good metadata is still made by hand. Someone reads a dataset, its data
dictionary, a protocol, and a paper, then transcribes what they learned into a
structured form, choosing a standardized term for each value. It is slow work,
and it is exactly the kind of reading and restructuring that a large language
model does well.

A language model on its own, though, is probably not the best tool for the final step. Ask
one to write a metadata template and it will cheerfully invent field names,
guess ontology identifiers that do not resolve, and emit something that looks
like CEDAR but does not validate. The reasoning is useful. The unaided output is
not trustworthy.

The Model Context Protocol (MCP) closes that gap. An MCP server hands the model a
set of real tools backed by real services. The model still decides what the
template should contain and which vocabularies fit; the servers do the parts that
have to be exact: resolving a name to a genuine ontology IRI, assembling a schema
the CEDAR validator accepts, and rendering that schema as an actual CEDAR form.
This tutorial walks the smallest end-to-end example of that division of labor.

## The Four MCP Servers

Building a template this way touches four different tasks, and no single service
does all of them well. Finding the right ontology term is a search problem
against BioPortal. Turning a design into a valid CEDAR schema is a modeling and
validation problem. Seeing what that schema looks like is a rendering problem.
Keeping and sharing the result is a storage problem. So we built four small MCP
servers, one for each task, and an LLM orchestrates them. Together they
carry a template from a plain-language description all the way to a stored,
standards-based artifact, without the model ever having to invent a schema or an
identifier on its own.

The MCPs are:

- **BioPortal term server**: searches [BioPortal](https://bioportal.bioontology.org)
  and resolves names to real ontology classes and ontologies, each with a
  resolvable IRI.
- **CEDAR artifact server**: builds, validates, and renders CEDAR templates and
  instances as YAML.
- **CEDAR embeddable-editor server**: renders a template or an instance as a form
  in your browser, so you can see what the YAML actually produces.
- **CEDAR REST server**: uploads and manages artifacts on a CEDAR server, so you
  can keep and share what you built. It sends the same YAML you have been reading:
  CEDAR reads and writes YAML as well as JSON, so nothing is converted on the way.

Setup instructions are in the [Appendix](#appendix-configuring-the-mcp-servers).

## What We Will Build

In this tutorial you build real CEDAR artifacts by conversation alone: a template,
the specification that defines how a kind of data should be described, and an
instance, the metadata that fills that specification in.
You describe what you want in plain language, and an LLM backed by the four
MCP servers does the rest: it finds the right ontology terms, assembles a valid
template, renders it as a form you can inspect, and fills an instance of it, right
up to an artifact you could store and share. There is no CEDAR Workbench to click
through and no schema to hand-write. That path, from a sentence to a
standards-based artifact, is what we are demonstrating.

Concretely, we build one template, **Tissue Sample**, with two plain identifier
fields and three fields constrained to ontology terms, and then populate one instance
of it. Two companion tutorials do this by hand: the [CEDAR Tutorial](cedar_tutorial.md)
walks through creating folders, templates, and fields in the Workbench, and the
[CEDAR Controlled Term Tutorial](cedar_term_tutorial.md) clicks through the term
picker to constrain fields to ontology terms, using this very Tissue Sample
template. Everything those two
accomplish by pointing and clicking, you accomplish here by describing it in
plain language. You need an LLM with the four servers configured and about
ten minutes.

## Step 1: Describe What You Want

Everything starts with a plain-language request. You do not write YAML; you say
what the template should hold:

> Build a CEDAR template called "Tissue Sample". Give it two plain text fields,
> Sample ID (required) and Lab ID. Then add three fields constrained to ontology
> terms: Cell Type, allowing any term from the Cell Ontology; Organ, allowing any
> organ from Uberon; and Assay Type, allowing three specific assays:
> histopathology, imaging, and microscopy.

Everything after this is the LLM working. It resolves the terms, assembles and
saves the template, then previews it.

## Step 2: Resolve the Terms

The LLM does not take ontology identifiers from memory. For each controlled
field it asks the BioPortal server, turning the names in your request into real
classes and ontologies. To bind Cell Type to a whole ontology it calls
`find_ontology`; to find the *organ* class in Uberon and the assay classes in OBI
it calls `find_class`, scoped to the right ontology.

Each result carries the identifier the template actually needs. The search for
*organ* in Uberon, for instance, comes back with a resolvable IRI:

```json
{ "class_iri": "http://purl.obolibrary.org/obo/UBERON_0000062",
  "pref_label": "organ",
  "ontology_acronym": "UBERON" }
```

The Cell Ontology resolves to the acronym `CL`, and *histopathology assay* in OBI
resolves to `OBI_0002564`. These are real, dereferenceable IRIs. The model has
looked each one up instead of guessing it, which is the whole reason the finished
template will point at terms that other people and other programs can resolve.

## Step 3: Assemble the Template

With real IRIs in hand, the LLM builds the template on the CEDAR artifact
server. It creates the template, adds each field, and attaches each field's value
constraint. The three controlled fields take three different shapes of
constraint. Cell Type is bound to an entire ontology, Organ to a branch (the
*organ* class and everything beneath it), and Assay Type to a hand-picked list of
classes. The server validates the artifact as it is built, so what comes back is
a well-formed CEDAR template, rendered as YAML:

```yaml
type: template
name: "Tissue Sample"
description: "A tissue-sample record whose fields are constrained to ontology terms."
children:
  - key: "sample-id"
    type: text-field
    name: "Sample ID"
    description: "Local identifier for this tissue sample"
    configuration:
      required: true
  - key: "lab-id"
    type: text-field
    name: "Lab ID"
    description: "Identifier of the lab that produced the sample"
  - key: "cell-type"
    type: controlled-term-field
    name: "Cell Type"
    description: "The cell type, from the Cell Ontology"
    datatype: iri
    values:
      - type: ontology
        sourceAcronym: "CL"
        sourceName: "Cell Ontology"
        sourceIri: "http://purl.obolibrary.org/obo/cl"
  - key: "organ"
    type: controlled-term-field
    name: "Organ"
    description: "The organ the sample came from, from Uberon"
    datatype: iri
    values:
      - type: branch
        sourceAcronym: "UBERON"
        sourceName: "Uber Anatomy Ontology"
        termBaseIri: "http://purl.obolibrary.org/obo/UBERON_0000062"
        termBaseLabel: "organ"
        termMaxDepth: 0
  - key: "assay-type"
    type: controlled-term-field
    name: "Assay Type"
    description: "How the sample was analyzed, from OBI"
    datatype: iri
    values:
      - type: class
        sourceAcronym: "OBI"
        termIri: "http://purl.obolibrary.org/obo/OBI_0002564"
        termType: class
        termLabel: "histopathology assay"
      - type: class
        sourceAcronym: "OBI"
        termIri: "http://purl.obolibrary.org/obo/OBI_0000185"
        termType: class
        termLabel: "imaging assay"
      - type: class
        sourceAcronym: "OBI"
        termIri: "http://purl.obolibrary.org/obo/OBI_0002119"
        termType: class
        termLabel: "microscopy assay"
```

Read down the `children` and you can see the request answered field by field: two
plain `text-field`s, then three `controlled-term-field`s whose `values` hold the
three constraint shapes, each pointing at an IRI the BioPortal server returned in
Step 2. The quoting is the canonical CEDAR style: plain scalars for the structural
keys whose vocabulary CEDAR controls — `type`, `datatype`, `status`, `version`,
`modelVersion` — and double quotes on every other string. A reader accepts either,
but this is what a CEDAR writer emits. This is compact CEDAR YAML — the form you author in. It carries no
identifier, because the template does not have one yet: CEDAR assigns that when
the template is saved.

## Step 4: Save the Template

An instance says which template it was filled from, and it says so by IRI. Only
CEDAR can supply that: the template you have authored exists on your machine and
nowhere else. So save it before filling anything.

> Save that template to CEDAR.

The REST server uploads it and returns the IRI CEDAR assigned:
`https://repo.metadatacenter.org/templates/940fa702-460a-4880-846d-d22cc168ea11`.
That IRI is also what makes the template findable and reusable by other people.

CEDAR assigns more than that one identifier. The stored template comes back with an IRI for every
field as well, and a property IRI for each one in the `@context` its JSON form carries. None of
them are invented anywhere else: an artifact reaches CEDAR naming nothing, and CEDAR is what names
it. That is also why the YAML you send is the YAML you wrote — the upload is the compact form
itself, not a JSON translation of it, and what comes back is the same form with the identifiers
filled in.

## Step 5: Preview the Stored Template

YAML is exact but hard to picture. The embeddable-editor server renders the stored template as the
CEDAR form it describes, opened read-only in your browser. The LLM hands the saved template returned
by CEDAR to `show_template` and returns a link:

![The Tissue Sample template, rendered by CEE 2.0.3](../img/tutorials/mcps-tutorial-template.png)

Saving comes before previewing for a concrete reason: CEE requires the template's `@id`, because
every instance must identify the template it came from. The red asterisk marks Sample ID as
required. Cell Type, Organ, and Assay Type render as ontology-backed pickers, each inviting you to
"Start typing to filter" its allowed terms. Behind the form is the same template as JSON-LD and JSON
Schema, the standards-based forms CEDAR speaks natively; the download control offers either one.

## Step 6: Fill an Instance

A template is a blueprint. The metadata you keep are *instances* of it, one per
sample. Ask the LLM to fill one:

> Create an instance of that template: Sample ID TS-0001, Lab ID LAB-0042, Cell
> Type hepatocyte, Organ liver, Assay Type histopathology assay.

The LLM resolves the three controlled values through BioPortal again
(*hepatocyte* to a Cell Ontology class, *liver* to a Uberon class,
*histopathology assay* to its OBI class), builds the instance against the saved
template, validates it, and renders it:

```yaml
type: instance
name: "Tissue Sample TS-0001"
isBasedOn: "https://repo.metadatacenter.org/templates/940fa702-460a-4880-846d-d22cc168ea11"
children:
  sample-id:
    value: "TS-0001"
  lab-id:
    value: "LAB-0042"
  cell-type:
    id: "http://purl.obolibrary.org/obo/CL_0000182"
    label: "hepatocyte"
  organ:
    id: "http://purl.obolibrary.org/obo/UBERON_0002107"
    label: "liver"
  assay-type:
    id: "http://purl.obolibrary.org/obo/OBI_0002564"
    label: "histopathology assay"
```

Notice the difference between the two kinds of value. Sample ID and Lab ID are
plain strings. The three controlled fields are `id` and `label` pairs, where the
`id` is a real ontology IRI and the `label` is the human-readable term it stands
for. `isBasedOn` links the instance back to the template it was filled from.

Preview it the same way, with `show_instance`:

![The filled Tissue Sample instance, rendered by CEE 2.0.3](../img/tutorials/mcps-tutorial-instance.png)

Each controlled value shows its label beside the IRI it stands for, and links out to the term.
That is the whole point. The instance stores *hepatocyte* as `CL_0000182`, not as the loose word
"hepatocyte", so the value means the same thing to every reader and every program that encounters
it.

## Save the Instance

The template is already in CEDAR; the filled instance is not. The same REST
server uploads it, and CEDAR assigns it an identifier of its own. From there it
is findable, and the values in it point at the ontology terms they came from.

The instance you send stays as lean as the one above — it names only the five fields that hold a
value. A stored CEDAR instance has to carry every field its template declares, empty ones included,
so the upload completes it against the template first. Read it back and it is lean again.

## What Just Happened

The work split cleanly in two. The model supplied the judgment: which fields the
template needs, which vocabularies fit them, and which shape of constraint each
field should take. The servers supplied the ground truth: real IRIs from
BioPortal, a valid schema and a valid instance from the CEDAR artifact server,
and a faithful rendering from the embeddable editor. Neither half is enough
alone. The model without the servers invents identifiers; the servers without the
model have nothing to assemble. That division is why the template is saved before
an instance is filled: an instance belongs to a template CEDAR knows about, and
only CEDAR can say which one that is.

Because the workflow is a conversation over reusable tools rather than a one-off
script, the same method retargets to any study. Change the description of what you
want, keep the approach, and the servers keep the output honest.

## Appendix: Configuring the MCP Servers

Each server is a standalone MCP server that your LLM launches over stdio.
The three Java servers require Java 17 and Maven 3.9 or newer; the BioPortal server requires Python
3.14 and `uv`. Clone the four repositories, then build and test them from their repository roots:

```bash
uv sync && uv run pytest                         # bioportal-term-mcp
mvn verify                                       # cedar-artifact-mcp
mvn verify                                       # cedar-cee-mcp
mvn verify                                       # cedar-artifact-rest-mcp
```

The Maven builds produce fixed client-facing paths under `target/`:
`cedar-artifact-mcp.jar`, `cedar-cee-mcp.jar`, and `cedar-artifact-rest-mcp.jar`. The artifact and
CEE servers resolve released `cedar-artifact-library` 2.9.3 from the anonymous-read BMIR Nexus, so
they need no sibling library checkout. The CEE server also embeds stable CEE 2.0.3 in its JAR; a
form session does not need npmjs or a CDN at runtime.

You register the four in your client's MCP configuration once. The shape is the
same across MCP-capable clients (Claude Desktop, Claude Code, and others); the
launch command and paths depend on how you installed each server. A
representative configuration:

```json
{
  "mcpServers": {
    "bioportal-term": {
      "command": "/absolute/path/to/uv",
      "args": ["--directory", "/path/to/bioportal-term-mcp", "run", "bioportal-term-mcp"],
      "env": { "BIOPORTAL_API_KEY": "your-bioportal-api-key" }
    },
    "cedar-artifact": {
      "command": "/absolute/path/to/java",
      "args": ["-jar", "/path/to/cedar-artifact-mcp.jar"]
    },
    "cedar-cee": {
      "command": "/absolute/path/to/java",
      "args": ["-jar", "/path/to/cedar-cee-mcp.jar"]
    },
    "cedar-artifact-rest": {
      "command": "/absolute/path/to/java",
      "args": ["-jar", "/path/to/cedar-artifact-rest-mcp.jar"],
      "env": {
        "CEDAR_API_KEY": "your-cedar-api-key",
        "CEDAR_BASE_URL": "https://resource.metadatacenter.org"
      }
    }
  }
}
```

A few notes on configuration:

- `BIOPORTAL_API_KEY` comes from your BioPortal account and lets the term server
  query BioPortal.
- The artifact and embeddable-editor servers need no credentials. One builds,
  validates, and renders locally; the other renders locally in your browser.
- `CEDAR_API_KEY` authenticates the REST server with CEDAR. It is required only
  if you save artifacts, as in [Save the Template](#step-4-save-the-template).
- `CEDAR_BASE_URL` is the CEDAR resource-server URL. For the public CEDAR system,
  use `https://resource.metadatacenter.org`; the REST MCP server uses that value
  by default when the variable is omitted. Set it only when targeting another
  CEDAR deployment.

Use absolute executable and JAR paths: GUI clients commonly do not inherit your shell's `PATH`.
After adding the block, restart your client. Rebuilding a JAR or changing an environment variable
also requires a restart because the client holds each MCP server process open. The LLM then has the
tools this tutorial used, from `find_class` and `set_branch_constraint` to `show_template`, ready to
call.

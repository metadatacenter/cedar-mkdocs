# The CEDAR Model

The CEDAR model is a single, general model for representing scientific metadata. It gives a
community one standards-based way to state what must be recorded about a kind of experiment
or dataset, to constrain how each item is expressed, and to record the metadata that
results. The model has a small set of building blocks — fields, elements, and templates —
that compose to describe requirements of any size, with the permitted values grounded in
shared controlled vocabularies.

The model calls each of these things an **artifact**, and it draws one distinction among
them. Fields, elements, and templates are **schema artifacts**: they describe the shape of
metadata. An instance is an **instance artifact**: it holds metadata. The schema artifacts
are the specification; an instance artifact is what conforms to it.

## Fields

A field is the model's atomic unit. It asks for one item of information and holds a single
value, or a list of values when it is allowed to repeat.

Every field fixes the kind of value it accepts. A field may collect free text, a number, a
date or time, a web link, or a term drawn from a controlled vocabulary. Specialized fields
collect an email address, a telephone number, or an identifier such as an ORCID or a DOI. A
further kind presents fixed content — a heading, an image, an explanatory note — and
collects nothing.

A field's definition can constrain its value beyond its kind: a permitted range or length,
a required format, a fixed list of options, a default. It can also mark the field as
required, or as recommended but not mandatory.

## Elements

An element is a named group of fields and other elements. It packages a recurring cluster
of information so that the cluster can be defined once and reused.

An element called Contact, for example, might group a name, an email address, and a
telephone number. Any template that needs contact details reuses that element rather than
redefining its parts. Because an element can contain other elements, a group can be built to
any depth.

## Templates

A template is a complete metadata specification. It is an ordered arrangement of fields and
elements that together describe one kind of thing — a study, a biological sample, an assay —
carried with the template's own name, description, versioning, and provenance.

The order is meaningful: it is the order in which the template presents its items. A
template is the unit a community publishes and the unit an author fills out.

## Nesting and Repetition

Fields and elements are arranged within a template or an element, and that arrangement
nests. An element sits within a template; a field or a further element sits within that
element; and so on, with no fixed limit on depth.

An item may also repeat. A field or element marked as multiple stands for a list rather than
a single occurrence, and its number of occurrences can be bounded by a minimum and a
maximum. A template might carry exactly one study description and any number of contributor
records, where each contributor is a repeat of the same element.

## Instances

Filling out a template produces an instance: the metadata itself. An instance conforms to
the template it is based on and follows the same structure.

For each field, an instance supplies a value. For each element, it supplies a group of
values. For each repeating item, it supplies as many entries as the data requires. Because
the template fixes what an instance may contain, an instance can be checked against its
template for completeness and validity.

## Controlled Terms and Value Constraints

The model's semantic grounding comes from controlled terms. A field may require its value to
be a term from a named ontology, from a branch of an ontology, from a chosen set of classes,
or from a curated value set.

Recording a value as a controlled term — an identifier with a fixed, shared meaning, rather
than free text — is what lets metadata from different authors and different templates be
compared and combined. A field may also carry a default term, and may adjust the set of
terms it offers, for instance by removing or reordering particular entries.

## Identity and History

Every artifact is identified and records its own history — when it was created and last
changed, and how its versions succeed one another. This lets metadata refer to the exact
version of a template it was built against, and lets a specification evolve without breaking
that reference.

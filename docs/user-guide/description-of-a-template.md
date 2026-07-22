# Description of a Template

In CEDAR, a form is called a metadata template, or just a template. A template is built from
two kinds of part: **fields**, the individual questions, and **elements**, reusable groups of
fields and other elements. Filling out a template produces a metadata instance, the metadata
itself.

## What a Template Defines

A template does three things:

- It defines the questions: the fields, the answers each allows, and any constraints on them.
- It fixes the order in which the fields and elements appear.
- It describes itself: its name, its description, and its provenance, such as who created it
  and when.

CEDAR templates are designed to be discipline-neutral and interoperable, so a template built
by one community can be understood and reused by any system that adopts the CEDAR model.

## Fields, Elements, and Reuse

You compose a template from fields and elements using the Template Designer, described in
[Building Basic Templates](building-basic-templates.md). An element groups related fields. A
Contact element, for example, might hold a name, an email address, and a phone number. Because
an element can also contain other elements, a template nests to any depth.

Elements are reusable. When you add an element that you or someone else already created, CEDAR
copies it into the template, and the same element can be reused across as many templates as you
like. You can reorder the elements and top-level fields in a template. Fields inside an element
are reordered within that element, not from the template.

## Template Metadata and Hidden Fields

Some metadata about the template is filled in for you, such as when it was created and last
changed. Other parts you provide, such as its title and description.

You can also add fields that are hidden from the person filling out the form and give them
fixed default values. A hidden field is stored like any other field but never appears in the
form. This is useful for recording a constant value on every instance without asking for it.

## Validation

CEDAR checks that every template is well-formed, and that every instance conforms to the
template it is based on, so problems surface early rather than in downstream systems.
Validation errors appear in the Template Designer as you work; see
[Filling Out Metadata](filling-out-metadata.md#saving-and-validating).

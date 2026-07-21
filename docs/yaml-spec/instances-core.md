# Instances: Core Structure

A template instance is an instance artifact. It holds metadata that conforms to a template.
In YAML it identifies its template with `isBasedOn`. As with template and element artifacts,
instances hold a value for each field or nested element under `children`, keyed by the
child's name.

```yaml
type: instance
name: SDY232
description: Metadata for the SDY232 cardiology study
id: https://repo.metadatacenter.org/template-instances/1f9a2b3
isBasedOn: https://repo.metadatacenter.org/templates/ec3f500
children:
  Study Name:
    value: Cardiology cohort
```

## Field Values

Which keys a field's value carries depends on the kind of value. A plain literal carries
just `value`. A typed literal adds `datatype`. A controlled term carries `id` with a
`label`.

```yaml
type: instance
name: SDY232
isBasedOn: https://repo.metadatacenter.org/templates/ec3f500
children:
  Study Name:
    value: Cardiology cohort
  Participants:
    value: 2323
    datatype: xsd:int
  Disease:
    id: http://purl.obolibrary.org/obo/DOID_530
    label: eyelid disease
```

A field with no value is omitted from `children` entirely.

A controlled term value can carry two further labels drawn from its vocabulary. `prefLabel`
holds the term's preferred label, the canonical name the vocabulary assigns it, which may
differ from the `label` shown to the author. `notation` holds the term's short code or
accession within the vocabulary.

```yaml
  Disease:
    id: http://purl.obolibrary.org/obo/DOID_530
    label: eyelid disease
    prefLabel: eyelid disease
    notation: DOID:530
```

## Multiple Values

A field that accepts more than one value holds a list under its name. Each entry has the
same shape it would have as a single value. For a plain literal field, each entry carries a
`value`.

```yaml
  Keywords:
  - value: genomics
  - value: oncology
```

A controlled-term field behaves the same way. Each entry is a full controlled term, carrying
its `id` and `label`.

```yaml
  Conditions:
  - id: http://purl.obolibrary.org/obo/DOID_2841
    label: asthma
  - id: http://purl.obolibrary.org/obo/DOID_10763
    label: hypertension
```

## Nested Elements

An element does not hold a value of its own. Its entry under `children` holds its own
`children`, one for each field or element it contains, nested the same way as at the top
level. A repeating element holds a list of such entries.

```yaml
  Address:
    children:
      Street:
        value: 450 Serra Mall
      City:
        value: Stanford
  Contributors:
  - children:
      Name:
        value: Ada Lovelace
  - children:
      Name:
        value: Alan Turing
```

## Standalone Element Instances

An element instance can also stand on its own, outside any template instance, using
`type: element-instance`. It carries the same `name`, `id`, and `children` as a nested
element value, plus the `type` discriminator that lets it stand alone.

```yaml
type: element-instance
name: Address
children:
  Street:
    value: 450 Serra Mall
  City:
    value: Stanford
```

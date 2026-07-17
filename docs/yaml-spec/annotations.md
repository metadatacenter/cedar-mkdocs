# Annotations

An artifact may carry annotations: named values attached to it for a purpose beyond its core
description. An annotation names a property — usually by IRI — and gives it a value. It is
how an artifact records extra facts about itself, such as a DOI or an external version tag.

```yaml
annotations:
  https://schema.org/version:
    value: "2"
  https://datacite.com/doi:
    id: https://doi.org/10.60745/kys3-pa43
```

`annotations` is a mapping from each annotation name to its value. A value is either a
literal, written with `value`, or an IRI, written with `id`.

| Key within an annotation | Value | Meaning |
|--------------------------|-------|---------|
| `value` | string | A literal annotation value. |
| `id` | IRI | An IRI annotation value. |

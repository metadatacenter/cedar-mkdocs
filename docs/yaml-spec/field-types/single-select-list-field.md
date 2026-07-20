# Single-Select List Field

A single-select list field collects one option from a fixed list, presented as a dropdown.
In YAML its `type` is `single-select-list-field`.

Each option has a `label`; one may be marked `selected` as the default.

```yaml
- key: vaccine
  type: single-select-list-field
  name: Vaccine
  values:
  - label: Moderna
  - label: Pfizer
  - label: None
    selected: true
```

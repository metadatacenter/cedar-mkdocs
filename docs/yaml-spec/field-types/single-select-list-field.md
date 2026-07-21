# Single-Select List Field

A single-select list field collects one option from a fixed list, presented as a dropdown.
It suits a longer list, where showing every option at once would crowd the form. In YAML its
`type` is `single-select-list-field`.

The options are listed under `values`. Each has a `label`, and one may be marked `selected`
as the default.

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

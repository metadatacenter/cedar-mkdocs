# Multi-Select List Field

A multi-select list field collects any number of options from a fixed list, presented as a
dropdown. In YAML its `type` is `multi-select-list-field`.

Each option has a `label`; any number may be marked `selected` as defaults. A multi-select
list field is multi-valued by nature and does not take `multiple` in its `configuration`.

```yaml
- key: methods
  type: multi-select-list-field
  name: Methods
  values:
  - label: PCR
  - label: Sequencing
  - label: Microscopy
```

# Checkbox Field

A checkbox field collects any number of options from a fixed list, presented as checkboxes.
In YAML its `type` is `checkbox-field`.

Each option has a `label`; any number may be marked `selected` as defaults. A checkbox field
is multi-valued by nature and does not take `multiple` in its `configuration`.

```yaml
- key: symptoms
  type: checkbox-field
  name: Symptoms
  values:
  - label: Fever
  - label: Cough
    selected: true
  - label: Fatigue
```

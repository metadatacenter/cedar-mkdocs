# Radio Field

A radio field collects one option from a fixed list, presented as radio buttons. In YAML
its `type` is `radio-field`.

Each option has a `label`; one may be marked `selected` as the default.

```yaml
- key: handedness
  type: radio-field
  name: Handedness
  values:
  - label: Left
  - label: Right
    selected: true
```

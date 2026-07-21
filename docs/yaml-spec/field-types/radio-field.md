# Radio Field

A radio field collects one option from a fixed list, presented as radio buttons. It suits a
short list where every option should stay visible at once. In YAML its `type` is
`radio-field`.

The options are listed under `values`. Each has a `label`, and one may be marked `selected`
as the default.

```yaml
- key: handedness
  type: radio-field
  name: Handedness
  values:
  - label: Left
  - label: Right
    selected: true
```

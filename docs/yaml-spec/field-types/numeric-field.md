# Numeric Field

A numeric field collects a number of a given XSD datatype. In YAML its `type` is
`numeric-field`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `datatype` | numeric datatype token | required | The value's type: `xsd:decimal`, `xsd:int`, `xsd:long`, `xsd:short`, `xsd:byte`, `xsd:float`, or `xsd:double`. |
| `minValue` | number | optional | Minimum value. |
| `maxValue` | number | optional | Maximum value. |
| `decimalPlaces` | integer | optional | Number of decimal places. |
| `unit` | string | optional | Unit of measure. |
| `default` | number | optional | Default value. |

```yaml
- key: completed
  type: numeric-field
  name: Treatment Completed %
  datatype: xsd:int
  minValue: 0
  maxValue: 100
  default: 0
```

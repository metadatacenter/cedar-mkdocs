# Temporal Field

A temporal field collects a point in time — a date, a time of day, or both together. Its
`datatype` chooses which, and `granularity` sets the finest unit recorded, from a whole year
down to fractions of a second. When the value includes a time, `inputTimeFormat` selects a
12- or 24-hour clock and `inputTimeZone` controls whether a time zone is captured. In YAML
its `type` is `temporal-field`.

| Key | Value | Presence | Meaning |
|-----|-------|----------|---------|
| `datatype` | `xsd:date`, `xsd:time`, or `xsd:dateTime` | required | The temporal kind. |
| `granularity` | `year`, `month`, `day`, `hour`, `minute`, `second`, or `decimalSecond` | required | The finest unit recorded. |
| `inputTimeFormat` | `12h` or `24h` | conditional | Clock format; applies when granularity is finer than day. |
| `inputTimeZone` | boolean | optional | Whether a time zone is recorded. |
| `default` | string | optional | Default value. |

```yaml
- key: visit-time
  type: temporal-field
  name: Visit Time
  datatype: xsd:dateTime
  granularity: minute
  inputTimeFormat: 24h
  inputTimeZone: true
```

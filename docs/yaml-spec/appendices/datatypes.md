# Datatypes

CEDAR uses XSD datatypes, written with the `xsd:` prefix, to type numeric and temporal
values.

| Token | Datatype |
|-------|----------|
| `xsd:decimal` | Arbitrary-precision decimal number. |
| `xsd:int` | 32-bit integer. |
| `xsd:long` | 64-bit integer. |
| `xsd:short` | 16-bit integer. |
| `xsd:byte` | 8-bit integer. |
| `xsd:float` | Single-precision floating point. |
| `xsd:double` | Double-precision floating point. |
| `xsd:date` | Calendar date. |
| `xsd:time` | Time of day. |
| `xsd:dateTime` | Date and time. |

The token `iri` is used where a value is an IRI rather than a typed literal.

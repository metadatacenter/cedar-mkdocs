# Attribute-Value Field

An attribute-value field collects a set of user-supplied attribute/value pairs. The instance
author names each attribute and gives its value, so the field suits metadata whose
properties are not known when the template is designed. In YAML its `type` is
`attribute-value-field`.

The field takes no type-specific keys; the attribute names are supplied in the instance (see
[Instances: Core Structure](../instances-core.md)).

```yaml
- key: extra-attributes
  type: attribute-value-field
  name: Additional Characteristics
```

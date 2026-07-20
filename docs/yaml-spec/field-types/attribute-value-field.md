# Attribute-Value Field

An attribute-value field collects a set of user-supplied attribute/value pairs. The instance
author names each attribute and gives its value. In YAML its `type` is
`attribute-value-field`.

The field takes no type-specific keys; the attribute names are supplied in the instance (see
[Template Instances](../instances.md)).

```yaml
- key: extra-attributes
  type: attribute-value-field
  name: Additional Characteristics
```

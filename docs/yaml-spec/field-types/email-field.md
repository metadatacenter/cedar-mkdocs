# Email Field

An email field collects a single email address. It takes no type-specific keys; the field
type alone marks the value as an email address, distinguishing it from ordinary text. In
YAML its `type` is `email-field`.

```yaml
- key: contact-email
  type: email-field
  name: Contact Email
```

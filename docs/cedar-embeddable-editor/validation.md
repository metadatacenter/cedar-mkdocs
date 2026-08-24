# Validation and the Data Quality Report

The CEE provides two kinds of validation:

- **Field validation** gives users feedback while they edit the form.
- **The data quality report** gives the host application a snapshot of the entire metadata
  instance.

The CEE reports validity but does not perform saves. The host application decides how to present
validation errors and whether to submit the metadata.

## Field Validation

The CEE validates a field whenever its value changes. Typed fields wait until the user leaves the
field before displaying an error, so partially entered values are not marked invalid. Common
messages cover missing required values, text length, malformed email addresses and links, and
numeric ranges.

Controlled-term and external-authority fields accept only values selected from or resolved by their
lookup service. If the user enters text that does not identify a result, the CEE clears it or restores
the previously selected value.

## Reading the Data Quality Report

Read the current report from the editor element:

```javascript
const report = cee.dataQualityReport;
```

The property returns a snapshot with four top-level members:

```typescript
interface CeeDataQualityReport {
  requiredFieldValueCount: number;
  nonNullRequiredFieldValueCount: number;
  problems: CeeValidationProblem[];
  isValid: boolean;
}
```

`requiredFieldValueCount` is the number of required field declarations in the template.
`nonNullRequiredFieldValueCount` is the number of those requirements satisfied by the current
instance. A required field is counted once even when the field, or an element containing it, is
repeatable. Any populated occurrence satisfies that requirement.

`problems` contains one `required` entry for each unsatisfied required field declaration, plus
constraint violations for present values and structural or cardinality problems. The two counts
remain available as an aggregate view of required-field progress.

`isValid` is `true` only when every required field is populated and `problems` is empty. For example,
a host can use it to control a save button:

```javascript
saveButton.disabled = !cee.dataQualityReport.isValid;
```

The CEE recomputes the report after every instance change. The `change` event includes the updated
report and the same validity result:

```javascript
cee.addEventListener('change', ({ detail }) => {
  saveButton.disabled = !detail.validity;
  renderProblems(detail.dataQualityReport.problems);
});
```

Validation is local and synchronous; reading the report does not make a network request. When
`showDownloadMenu` is enabled, the download menu also offers the report as JSON.

## Validation Problems

Each entry in `problems` describes one violation:

```javascript
{
  path: ['_author', '_email'],
  field: '_email',
  inputType: 'email',
  code: 'email',
  message: 'Not a valid email address.',
  value: 'not-an-email'
}
```

- `path` is the component path from the template root. It identifies the field declaration, but it
  does not include occurrence indexes for repeatable fields or elements.
- `field` is the final segment of `path`.
- `inputType` is the field's declared input type, or `null` if none is declared.
- `code` is a stable, machine-readable problem type.
- `message` is an English diagnostic for developers. It is not translated and should not be used as
  application UI copy.
- `value` is the offending value in its CEDAR JSON representation. For example, a controlled term
  with an `@id` but no label is reported as `{ '@id': 'https://example.org/term/1' }`.

Use `code` and `path`, rather than parsing `message`, when handling a problem.

| Area | Codes |
|---|---|
| Required fields | `required` |
| Instance structure | `missingProperty` |
| Text | `minLength`, `maxLength`, `regex` |
| Formats | `email`, `link`, `phoneNumber` |
| Numbers | `numberType`, `minValue`, `maxValue`, `decimalPlace` |
| Dates and times | `temporalType`, `temporalGranularity`, `temporalCalendar`, `timezone` |
| Choices | `choiceMembership` |
| Controlled and authority values | `controlledStructure`, `iriMalformed` |
| Repeatable fields and elements | `minItems`, `maxItems` |

## Checks Performed

The report checks:

- [Required](../yaml-spec/fields-core.md#requirement) fields.
- Minimum and maximum text length, and regular-expression constraints.
- Email, link, phone-number, and external-authority identifier formats.
- Numeric type and range, including the range of the declared XSD numeric type, and the template's
  `minValue`, `maxValue`, and `decimalPlace` constraints.
- Temporal type, granularity, time-zone use, and calendar validity.
- Membership in a field's declared literal choices.
- `minItems`, `maxItems`, and required array structure for repeatable fields and
  [elements](../yaml-spec/elements-core.md#repetition).
- The structure of a [controlled value](../yaml-spec/field-types/controlled-term-field.md): `@id`
  and `rdfs:label` must appear together, and `@id` must be a well-formed IRI.

An empty optional field does not produce a constraint problem. An empty required field affects the
required-field counts and produces a `required` problem containing that field's path.

## Checks Not Performed

The report does not verify that a controlled term belongs to the ontology, class, branch, or value
set declared by the template. That check requires the terminology service. The local report checks
only the controlled value's structure and IRI format.

The report also does not perform full CEDAR artifact validation. When an application saves metadata
through CEDAR, the server validates the complete instance against its template and rejects an
invalid artifact.

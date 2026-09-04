# Validation and the Data Quality Report

The CEE validates individual fields during editing and exposes a data quality
report for the complete instance. It does not save or submit metadata; the host
application decides how validation affects its workflow.

## Field Validation

The CEE revalidates a field when its value changes. Text and numeric controls
usually wait until the user leaves the field before showing an error, avoiding
warnings for partially entered values.

Field messages cover required values, text constraints, formats, numeric ranges,
dates and times, choice membership, and repetition limits. Controlled-term and
external-authority fields accept only selected or resolved values; unresolved
text is cleared or replaced with the previous valid value.

## Read the Report

```javascript
const report = cee.dataQualityReport;
```

The returned snapshot has this shape:

```typescript
interface CeeDataQualityReport {
  requiredFieldValueCount: number;
  nonNullRequiredFieldValueCount: number;
  problems: CeeValidationProblem[];
  isValid: boolean;
}
```

- `requiredFieldValueCount` is the number of required field declarations in the
  template.
- `nonNullRequiredFieldValueCount` is the number currently satisfied.
- `problems` contains required, constraint, structure, and cardinality errors.
- `isValid` is `true` only when all required fields are populated and
  `problems` is empty.

A required field is counted once even when it, or an enclosing element, can
repeat. Any populated occurrence satisfies that requirement.

The host can use the summary directly:

```javascript
saveButton.disabled = !cee.dataQualityReport.isValid;
```

The report is recomputed after every instance change and is included in the
`change` event:

```javascript
cee.addEventListener('change', ({ detail }) => {
  saveButton.disabled = !detail.validity;
  renderProblems(detail.dataQualityReport.problems);
});
```

Validation is local and synchronous. Reading the report makes no network
request. If `showDownloadMenu` is enabled, the menu also offers the report as
JSON.

## Problem Records

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

| Member | Meaning |
|---|---|
| `path` | Component path from the template root. Repetition indexes are not included. |
| `field` | Final segment of `path`. |
| `inputType` | Declared input type, or `null`. |
| `code` | Stable machine-readable problem type. |
| `message` | English developer diagnostic; not translated for application UI. |
| `value` | Offending value in its CEDAR JSON representation. |

Use `code` and `path` in application logic rather than parsing `message`.

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

## Checks Included

The report checks:

- [required fields](../yaml-spec/fields-core.md#requirement);
- minimum and maximum text length, and regular expressions;
- email, link, phone-number, and external-authority formats;
- numeric type, XSD range, `minValue`, `maxValue`, and `decimalPlace`;
- temporal type, granularity, time-zone use, and calendar validity;
- literal choice membership;
- `minItems`, `maxItems`, and array structure for repeatable fields and
  [elements](../yaml-spec/elements-core.md#repetition); and
- the structure and IRI format of
  [controlled values](../yaml-spec/field-types/controlled-term-field.md).

An empty optional field produces no problem. An empty required field contributes
to the required-field counts and adds a `required` problem.

## Checks Excluded

The local report does not contact the terminology service to confirm that a term
belongs to the ontology, class, branch, or value set declared by the template.
It checks only the stored value's structure and IRI format.

It is also not a substitute for full server-side artifact validation. When an
application stores an instance through CEDAR, the server validates the complete
artifact against its template.

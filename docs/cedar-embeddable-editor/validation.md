# Validation and the Data Quality Report

The CEE validates individual fields during editing and exposes a data quality
report for the complete instance. It does not save or submit metadata; the host
application decides how validation affects its workflow.

## Field Validation

The CEE revalidates a field when its value changes, and shows an error under the
field while the user types. A value loaded from a stored instance is checked the
same way, so a field that holds an invalid value shows its error as soon as the
form opens. An empty required field stays quiet until the user reaches it, either
by editing it or by being taken to it with
[`reveal`](configuration.md#scroll-to-a-field), so that a new form does not open
with every required field in error.

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
  occurrences: [1],
  field: '_email',
  inputType: 'email',
  code: 'email',
  message: 'Not a valid email address.',
  value: 'not-an-email'
}
```

| Member | Meaning |
|---|---|
| `path` | Component path from the template root. |
| `occurrences` | Entry of each repeating field or element along `path`, outermost first, counting from zero. |
| `field` | Final segment of `path`. |
| `inputType` | Declared input type, or `null`. |
| `code` | Stable machine-readable problem type. |
| `message` | English developer diagnostic; not translated for application UI. |
| `value` | Offending value in its CEDAR JSON representation. |

Use `code` and `path` in application logic rather than parsing `message`.

A path names one place for each entry of every repeating field or element above
it, and `occurrences` says which entry holds the problem. In the example, the
invalid email address belongs to the second author. The same invalid value in two
entries is reported as two problems. A problem about the length of a list, such as
`minItems`, names the entries above the list but none of its own. A `required`
problem names no entries, because a value in any entry satisfies the requirement.
Pass a problem to [`reveal`](configuration.md#scroll-to-a-field) to take the user
to it.

| Area | Codes |
|---|---|
| Required fields | `required` |
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
- `minItems` and `maxItems` for repeatable fields and
  [elements](../yaml-spec/elements-core.md#repetition); and
- the structure and IRI format of
  [controlled values](../yaml-spec/field-types/controlled-term-field.md).

An empty optional field produces no problem. An empty required field contributes
to the required-field counts and adds a `required` problem.

The report describes the instance the CEE writes, which can differ from the
instance it read. A repeatable field or element that a stored instance omits is
written as an empty list, so the report treats it as one: it is a problem only
when the template's `minItems` requires entries.

## Checks Excluded

The local report does not contact the terminology service to confirm that a term
belongs to the ontology, class, branch, or value set declared by the template.
It checks only the stored value's structure and IRI format.

It is also not a substitute for full server-side artifact validation. When an
application stores an instance through CEDAR, the server validates the complete
artifact against its template.

## Take the User to a Problem

The report lists every problem in the instance, including problems in fields the
form is not showing: on another page of a paged template, in an entry of a
repeating element other than the one on screen, or inside a collapsed element.
An application that displays the list can make each item lead to its field, by
passing the problem to the element's
[`reveal`](configuration.md#scroll-to-a-field) method. The CEE turns to the
field's page and entry, scrolls the field into view, and focuses it.

The list changes as the user edits, so an application rebuilds it from each
`change` event:

```javascript
function renderProblems(problems) {
  problemList.replaceChildren(
    ...problems.map((problem) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.textContent = describeProblem(problem); // the application's own wording
      item.addEventListener('click', () => cee.reveal(problem));
      return item;
    }),
  );
}

renderProblems(cee.dataQualityReport.problems);
cee.addEventListener('change', ({ detail }) => renderProblems(detail.dataQualityReport.problems));
```

`describeProblem` stands for the application's own text. Build it from `code`,
not from `message`, which is an English diagnostic. Where the same field repeats,
`occurrences` tells the items apart: an application can number the entry, as in
"Author 2 · Email".

Two kinds of problem appear on the form only once the user has been taken to them,
because on a form nobody has started they would appear everywhere at once. A
`required` problem shows the field's requirement message, in whichever entry is on
screen, since a value in any entry satisfies it. A `minItems` problem shows the
minimum under the list. Every other problem is shown at its field as soon as the
form opens.

`reveal` resolves to `false` for a problem in a hidden field, which the form never
shows. An application can leave such an item as plain text.

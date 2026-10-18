# Validation and the Data Quality Report

The CEE validates individual fields during editing and exposes a data quality
report for the complete instance. It does not save or submit metadata. The report
separates structural validity, permission to save, and answer quality so that the
host can apply CEDAR's instance save policy: structural defects block saving;
value-constraint and completeness findings remain quality warnings.

The [validation architecture](../developer-guide/cedar-artifact-validation-architecture.md)
explains the shared Java and TypeScript rules, template-default validation,
semantic verification, and character handling.

## Field Validation

The CEE revalidates a field when its value changes, and shows a message under the
field while the user types. A value loaded from a stored instance is checked the
same way, so a field that holds an invalid value shows its finding as soon as the
form opens. An empty required field stays quiet until the user reaches it, either
by editing it or by being taken to it with
[`reveal`](configuration.md#scroll-to-a-field), so that a new form does not open
with every required field in error.

Field messages cover required values, text constraints, formats, numeric ranges,
dates and times, choice membership, and repetition limits. Controlled-term and
external-authority widgets accept selected or resolved values; unresolved typed
text is cleared or replaced with the previous value. Selected, loaded, and
imported identifiers also receive semantic verification; selection alone is not
proof of membership or existence.

## Read the Report

```javascript
const report = cee.dataQualityReport;
```

The returned snapshot has this shape:

```typescript
interface CeeDataQualityReport {
  structurallyValid?: boolean;
  canSave?: boolean;
  pendingValidation?: boolean;
  requiredFieldValueCount: number;
  nonNullRequiredFieldValueCount: number;
  problems: CeeValidationProblem[];
  semanticChecks?: Array<{
    path: string[];
    occurrences: number[];
    iri: string;
    status: 'passed' | 'failed' | 'notChecked' | 'unavailable';
    code: string;
    message: string;
  }>;
  isValid: boolean;
}
```

- `structurallyValid` reports whether structural requirements are satisfied.
- `canSave` applies the instance save policy, including pending validation.
- `pendingValidation` indicates that validation of the current draft has not
  settled.
- `requiredFieldValueCount` is the number of required field declarations in the
  template.
- `nonNullRequiredFieldValueCount` is the number currently satisfied.
- `problems` contains located structural, constraint, completeness, and
  verification findings, with their severity and save effect.
- `semanticChecks` records membership and existence check outcomes.
- `isValid` is `true` only when all required fields are populated and
  applicable checks pass, with no problems or pending validation.

The newer members remain optional in the TypeScript interface for compatibility
with older report producers. Current CEE reports supply the save facts and
semantic results; `pendingValidation` is present when checks are unresolved.
Before the form is ready, the getter can return an empty object; hosts should not
enable saving until `canSave` is explicitly `true`.

A required field is counted once even when it, or an enclosing element, can
repeat. To satisfy the declaration, it needs at least one populated occurrence
in every existing containing element. The selected or visible occurrence does
not change this count.

Use `canSave` for the save control. A structurally valid answer outside the
field's range can have `canSave: true` and `isValid: false`. The `validity` member
of a `change` event reflects `isValid`, so it is not the save decision.

The report is included in the `change` event. Asynchronous validation also emits
`validationChange`, whose `detail` is the report itself:

```javascript
function updateValidation(report) {
  saveButton.disabled = report.canSave !== true;
  renderProblems(report.problems ?? []);
}

updateValidation(cee.dataQualityReport);
cee.addEventListener('change', ({ detail }) => {
  updateValidation(detail.dataQualityReport);
});
cee.addEventListener('validationChange', ({ detail }) => {
  updateValidation(detail);
});
```

Reading the report returns a snapshot and can trigger a refresh of semantic
verification. Listen for `validationChange` to receive the settled result; do not
assume all validation is synchronous or local. If `showDownloadMenu` is enabled,
the menu also offers the report as JSON.

## Problem Records

Each entry in `problems` describes one finding:

```javascript
{
  path: ['_author', '_email'],
  occurrences: [1],
  field: '_email',
  inputType: 'email',
  code: 'email',
  category: 'constraint',
  severity: 'warning',
  blocksSave: false,
  location: '/_author/1/_email/@value',
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
| `category` | Shared classification: `structural`, `constraint`, `completeness`, or `verification`. |
| `severity` | `error` or `warning`, derived from the instance save policy. |
| `blocksSave` | Whether the finding prevents saving this instance. |
| `location` | Exact RFC 6901 JSON Pointer, including array indices and atom properties, when available. |
| `message` | English developer diagnostic; not translated for application UI. |
| `displayMessage` | Localized user-facing explanation, when available. |
| `value` | Offending value in its CEDAR JSON representation. |

Use `code` and `path` in application logic rather than parsing `message`.

A path names one place for each entry of every repeating field or element above
it, and `occurrences` says which entry holds the problem. In the example, the
invalid email address belongs to the second author. The same invalid value in two
entries is reported as two problems. A problem about the length of a list, such as
`minItems`, names the entries above the list but none of its own. A `required`
problem identifies the containing element whose requirement is unfilled.
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
| Controlled and authority structure | `controlledStructure`, `iriMalformed` |
| Semantic membership and identifiers | `controlledTermMembership`, `authorityIdentifier`, `authorityMembership` |
| Incomplete semantic verification | `semanticNotChecked`, `semanticUnavailable` |
| Regular-expression execution | `regexEvaluation`, `regexUnavailable` |
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
  [elements](../yaml-spec/elements-core.md#repetition);
- the structure and IRI format of
  [controlled values](../yaml-spec/field-types/controlled-term-field.md); and
- controlled-term membership and external-authority verification through the
  configured services.

An empty optional answer in a valid representation produces no problem. An empty
required answer contributes to the required-field counts and adds a `required`
warning. A missing structural property or malformed typed value remains a
structural defect regardless of whether an answer is required.

Loaded and imported input is checked before completion and export. For example,
if an instance omits a repeatable property required by its schema, rendering an
empty list must not erase the original structural defect from the report.

## Semantic Verification

Controlled-term verification uses exact identifiers and the full version-aware
field constraints. A label-search result does not establish membership.
External-authority verification uses the authority's identifier and existence
checks.

Each applicable check records one of four outcomes:

| Status | Meaning |
|---|---|
| `passed` | The check completed successfully. |
| `failed` | The check established that the identifier fails the requirement. |
| `notChecked` | The check was not performed, such as when no verifier is configured. |
| `unavailable` | The check could not establish an answer. |

A service outage does not make a term invalid, and an omitted check does not
make it valid. For structurally valid instances, failed or incomplete semantic
verification produces quality warnings. Pending checks keep `canSave` false
until the current draft's validation settles; stale results from an earlier
edit are ignored.

## Checks Excluded

The report does not establish authorization to write an artifact, resolve
concurrent-update conflicts, or replace the server's checks against the current
template. When an application stores an instance through CEDAR, the server
validates the complete artifact and performs the applicable semantic checks.
The server does not trust a previously returned browser report as proof.

## Take the User to a Problem

The report lists every problem in the instance, including problems in fields the
form is not showing: on another page of a paged template, in an entry of a
repeating element other than the one on screen, or inside a collapsed element.
An application that displays the list can make each item lead to its field, by
passing the problem to the element's
[`reveal`](configuration.md#scroll-to-a-field) method. The CEE turns to the
field's page and entry, scrolls the field into view, and focuses it.

The list changes as the user edits and asynchronous checks finish. The
`updateValidation` example above calls this renderer for both event types:

```javascript
function renderProblems(problems) {
  problemList.replaceChildren(
    ...problems.map((problem) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.textContent = problem.displayMessage ?? describeProblem(problem);
      item.addEventListener('click', () => cee.reveal(problem));
      return item;
    }),
  );
}
```

Use `displayMessage` for CEE's localized wording. `describeProblem` stands for an
application-provided fallback, built from `code`, not from `message`, which is an
English diagnostic. Where the same field repeats,
`occurrences` tells the items apart: an application can number the entry, as in
"Author 2 · Email".

Two kinds of problem appear on the form only once the user has been taken to them,
because on a form nobody has started they would appear everywhere at once. A
`required` problem shows the field's requirement message in the containing
element with the missing answer. A `minItems` problem shows the
minimum under the list. Every other problem is shown at its field as soon as the
form opens.

`reveal` resolves to `false` for a problem in a hidden field, which the form never
shows. An application can leave such an item as plain text.

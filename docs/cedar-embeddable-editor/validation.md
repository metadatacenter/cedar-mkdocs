# Validation and the Data Quality Report

The CEE checks what the user enters as they enter it, and it can report on the whole instance on
demand. The two are different in scope and in purpose. Field-level feedback keeps a person on track
while they work. The data quality report answers the question an application asks before it saves:
is this metadata good enough to keep.

## Feedback in the Form

A field validates its own value as it is edited, and shows the problem in place. A required field
left empty is marked. Text shorter than the template's minimum, a number outside its range, a
malformed email address or URL all produce a message beneath the field.

Some field types go further and refuse the value outright. A controlled-term field, and each of the
external-authority fields, discards an entry that resolves to nothing and restores the previous
value where there was one, because storing unresolvable text in a field whose whole purpose is to
store an identifier would defeat the field.

None of this blocks anything. The CEE never prevents a save, because whether incomplete metadata may be
saved is the application's decision, not the CEE's.

## The Data Quality Report

The report is a snapshot of the whole instance, read from a property:

```javascript
const report = cee.dataQualityReport;
```

It answers two questions: is anything required missing, and is anything present invalid.

```
requiredFieldValueCount: number        // required fields the template declares
nonNullRequiredFieldValueCount: number // how many of those are filled
problems: ValidationProblem[]          // everything wrong with a value that is present
isValid: boolean                       // nothing missing and no problems
```

`isValid` is true when both questions come back clean, which makes it the single value a save button
should consult:

```javascript
saveButton.disabled = !cee.dataQualityReport.isValid;
```

Recomputing it on every `change` event keeps the button honest as the user works. The report is
computed locally and synchronously, so reading it costs nothing and requires no network.

The CEE can also render the report itself, as a collapsible panel beneath the form, with
`showDataQualityReport`. That gives a user one place to see everything still outstanding, rather
than hunting for the marked fields, and it is a quick way to see what the report contains while
building an integration.

???+ note "A naming mismatch to know about"

    The shipped TypeScript declarations currently name this array `validationProblems`. The object
    the CEE returns carries it as `problems`.

## Reading a Problem

Each problem names the field, says what is wrong, and carries the value that caused it:

```javascript
{
  path: ['_author', '_email'],   // component path from the template root
  field: '_email',               // the last path segment
  inputType: 'email',            // the field's declared input type
  code: 'email',                 // stable, matchable without parsing the message
  message: 'Not a valid email address.',
  value: 'not-an-email'
}
```

`code` is the member to branch on. It is stable, and it stays stable while the wording of `message`
changes. `path` is what lets an application point the user at the offending field rather than
telling them something somewhere is wrong.

The codes divide into the kinds of thing that can go wrong:

| Area | Codes |
|---|---|
| Presence | `required`, `missingProperty` |
| Text | `minLength`, `maxLength`, `regex` |
| Formats | `email`, `link`, `phoneNumber` |
| Numbers | `numberType`, `minValue`, `maxValue`, `decimalPlace` |
| Dates and times | `temporalType`, `temporalGranularity`, `temporalCalendar`, `timezone` |
| Choices | `choiceMembership` |
| Controlled values | `controlledStructure`, `iriMalformed` |
| Repeating groups | `minItems`, `maxItems` |

`message` is a diagnostic rather than user-facing copy, and it is not translated. An application
showing a problem to a person should build its own wording from `code` and `path`.

## What Is Checked

The report examines every constraint a template can declare about a value:

- [Required](../yaml-spec/fields-core.md#requirement) values.
- Text length, both bounds, and a regular expression where the template supplies one.
- Email, link, phone number and external-authority identifier formats.
- Numeric type, including `xsd:decimal`, `xsd:byte` and `xsd:short`, each against its own range,
  plus the template's own `minValue`, `maxValue` and `decimalPlace`.
- Temporal shape against the field's `temporalType`, granularity and time-zone setting, and calendar
  validity on top of that, so 31 February is caught as well as a malformed string.
- Membership of a value in the literal choices its field declares.
- `minItems` and `maxItems` on a [repeating element](../yaml-spec/elements-core.md#repetition), and
  the presence of its array at all.
- The structure of a [controlled value](../yaml-spec/field-types/controlled-term-field.md): an `@id`
  and an `rdfs:label` present as a pair, with a well-formed `@id`.

An absent value produces no constraint problems at all. Emptiness is the required check's business,
so an untouched form reports the fields that are missing rather than also reporting every blank as
malformed.

## What Is Not Checked

**Whether a controlled term is really a member of its declared set.** A term's membership of an
ontology, branch, class or value set can only be settled by the terminology service, and a local,
synchronous report should not depend on the network. The structural checks still apply, so a
malformed controlled value is caught. A well-formed term from the wrong ontology is not.

**Whether the instance is a valid CEDAR artifact.** The report describes the values, not the
document. For the authoritative verdict on an instance, CEDAR's own validation is the arbiter: a
CEDAR template is itself a JSON Schema for its instances, and
[`cedar-model-validation-library`](https://github.com/metadatacenter/cedar-model-validation-library)
validates one against the other. An application that must be certain a stored instance will be
accepted by CEDAR validates it there, on the server, rather than relying on a browser-side report.

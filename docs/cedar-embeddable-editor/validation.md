# Validation and the Data Quality Report

The CEE checks each value as it is entered, and it reports on the whole instance on demand. The
two serve different purposes. Field-level feedback keeps a person on track while they work. The
data quality report answers the question an application asks before it saves: whether the metadata
is good enough to keep.

## Feedback in the Form

A field validates its own value as it is edited, and shows the problem in place. A required field
left empty is marked. Text shorter than the template's minimum, a number outside its range, a
malformed email address or URL all produce a message beneath the field.

Some field types go further and refuse the value outright. A controlled-term field, and each of the
external-authority fields, discards an entry that resolves to nothing and restores the previous
value where there was one, because storing unresolvable text in a field whose whole purpose is to
store an identifier would defeat the field.

Neither the messages nor the refusals block a save. The CEE never prevents one, because the
application decides whether incomplete metadata may be kept.

## The Data Quality Report

The report is a snapshot of the whole instance, read from a property:

```javascript
const report = cee.dataQualityReport;
```

It answers two questions: whether anything required is missing, and whether anything present is
invalid.

```
requiredFieldValueCount: number        // required fields the template declares
nonNullRequiredFieldValueCount: number // how many of those are filled
problems: ValidationProblem[]          // everything wrong with a value that is present
isValid: boolean                       // nothing missing and no problems
```

These four members are the whole object. The pair of counts is a progress figure an application
can show as it stands.

The counts are per declaration, not per occurrence. A required field repeated five times counts
once, as does a required field inside an element repeated five times, and either is satisfied
when any occurrence carries a value — so the numbers do not move as a person pages through a
repeating group.

`isValid` is true only when both answers are no, so a save button need consult nothing else:

```javascript
saveButton.disabled = !cee.dataQualityReport.isValid;
```

The `change` detail carries both `validity` and `dataQualityReport`, computed after the
operation, so a listener does not need to reconstruct either from DOM controls:

```javascript
cee.addEventListener('change', ({ detail }) => {
  saveButton.disabled = !detail.validity;
  renderProblems(detail.dataQualityReport.problems);
});
```

The report is computed locally and synchronously, so reading it costs nothing and requires no
network. The CEE supplies the result but does not choose save policy: an application may block an
invalid save, ask for confirmation, or store a draft while showing the outstanding problems.

`showDownloadMenu` offers the report as a file, alongside the CEE's other views of the artifact. An
application that wants to show a user everything outstanding in one place builds that from
`dataQualityReport` in its own chrome.

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

Branch on `code`. It stays stable while the wording of `message` changes. `path` locates the
offending field, so an application can point the user at it instead of reporting that something
somewhere is wrong.

`value` is the value as CEDAR writes it. A literal appears as itself, and a controlled value
appears as the document it is stored as — a `controlledStructure` problem on a term with no
label carries `{ '@id': 'http://purl.bioontology.org/ontology/MESH/D000086382' }`.

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

An absent value produces no constraint problems. The required check already covers emptiness, so
an untouched form reports the fields that are missing rather than condemning every blank as
malformed.

## What Is Not Checked

**Whether a controlled term is really a member of its declared set.** A term's membership of an
ontology, branch, class or value set can only be settled by the terminology service, and a local,
synchronous report should not depend on the network. The structural checks still apply, so a
malformed controlled value is caught. A well-formed term from the wrong ontology is not.

**Whether the instance is a valid CEDAR artifact.** The report describes the values, not the
document that carries them. An application storing metadata through CEDAR gets that check when it
saves: the server validates the instance against its template and refuses an invalid one.

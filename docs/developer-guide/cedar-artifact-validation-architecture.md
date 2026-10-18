# CEDAR Artifact Validation Architecture

CEDAR lets communities define metadata requirements once and use them across
applications. A template designed in the Workbench can become a form embedded in
another platform; the resulting metadata can be read by a library, exchanged as
JSON or YAML, and stored through an API. For this reuse to work, every part of
the system must preserve the artifact's meaning and agree on the rules it must
satisfy. Validation is therefore a responsibility shared across CEDAR, from
authoring a specification to storing the metadata collected with it.

The [CEDAR model](../yaml-spec/cedar-model.md) defines four kinds of artifact.
[Fields](../yaml-spec/fields-core.md) define individual values and their
constraints, such as a numeric range or a controlled vocabulary.
[Elements](../yaml-spec/elements-core.md) group fields and other elements into
reusable structures. [Templates](../yaml-spec/templates-core.md) assemble those
structures into complete metadata specifications. These three are **schema
artifacts**: they describe what can be recorded. An
[instance](../yaml-spec/instances-core.md) holds the metadata recorded against a
template, including the identifiers that give controlled terms and external
references their meaning.

The model supports JSON Schema-based definitions and JSON-LD instances, as well
as a [YAML representation](../yaml-spec/index.md) of the same artifacts. A
template carries both structural requirements and value constraints. Validation
must check the definition's own consistency, then check each instance against
the template it references. It must also preserve the text, identifiers, and
exact numeric values on which those checks depend.

Several tools create and consume this model:

- **Designers author specifications.** The
  [Workbench's template-authoring interface](../user-guide/building-basic-templates.md)
  and the [CEDAR Embeddable Designer (CED)](https://github.com/metadatacenter/cedar-embeddable-designer)
  let authors assemble fields and elements, set constraints, and supply defaults.
  CED makes this authoring capability available inside a host application.
- **Editors collect metadata.** The
  [Workbench's metadata-entry interface](../user-guide/filling-out-metadata.md)
  and the [CEDAR Embeddable Editor (CEE)](../cedar-embeddable-editor/index.md)
  render templates as forms and produce instances. The
  [CEDAR Embeddable Field (CEF)](../cedar-embeddable-editor/using-the-cef.md)
  provides the corresponding control for a single field; it can also be used to
  enter a field's default while designing a specification.
- **Libraries provide programmatic access and shared rules.** The Java
  [CEDAR Artifact Library](cedar-artifact-library.md) and the
  [CEDAR Model TypeScript Library](cedar-model-typescript-library.md) read, build,
  and write artifacts. The Java
  [CEDAR Model Validation Library](https://github.com/metadatacenter/cedar-model-validation-library)
  supplies validation and common value policies on the server side; the
  TypeScript library implements the corresponding browser-side contract.
- **Services enforce the storage boundary.** Applications use the
  [CEDAR REST APIs](cedar-rest-apis/index.md) to store and retrieve artifacts.
  Server-side validation must enforce the same rules for API clients and imports
  as for artifacts produced by CEDAR's own interfaces.

If these components define validation independently, an artifact accepted by one
may be rejected by another, or its content may change during conversion. They
may also confuse different problems: a malformed numeric value, a well-formed
number outside its field's range, and a term whose membership could not be
verified require different responses. A single valid-or-invalid flag cannot
express all of those distinctions or determine whether saving is appropriate.

CEDAR addresses this by separating **value preservation**, **validation facts**,
and **save policy**. The Java and TypeScript libraries implement the same
contract, while designers, editors, quality reports, and server save gates apply
it in the context of a schema artifact or an instance. A designer must prevent
saving a template whose default violates its own constraints. An editor must
allow a structurally valid instance with an out-of-range answer to be saved,
while reporting the quality finding. Structural defects prevent saving in both
cases. The following sections describe how these responsibilities fit together,
including the character-handling rules that keep their inputs consistent.

## From Source to Save Decision

The validation path has five responsibilities:

| Responsibility | What It Does |
|---|---|
| Read and preserve | Parse JSON, YAML, or editor input without silently changing identifiers, text, or exact numeric values. Reject ambiguous or malformed source. |
| Validate structure and values | Check the artifact's shape and typed values, then apply the field constraints. Instances are checked against their template; definitions are checked for consistency, including defaults. |
| Verify semantic values | Ask the terminology or external-authority service whether an exact identifier satisfies the applicable constraints or identifies a real record. |
| Apply save policy | Interpret the findings in template or instance context. The same constraint violation can block a template and be a quality warning for an instance. |
| Present and enforce | Show findings through the existing editor and quality-report interfaces. Recheck them at the server boundary before storing the artifact. |

Validation also applies to loaded and imported artifacts. It is not limited to
values selected interactively. Checking the input before completing or rendering
it prevents an export operation from hiding a defect in the original document.

## Structural Validity, Quality, and Saving

Consider an integer field whose permitted range is 0–10:

| Situation | Template or Default | Instance Answer |
|---|---|---|
| The value is the well-formed integer `12`. | An inconsistent default; saving is blocked. | A range finding; saving is allowed. |
| The numeric value is `"twelve"`. | A malformed typed value; saving is blocked. | A malformed typed value; saving is blocked. |
| A required answer is empty, in the field's valid empty representation. | A required field need not have a default. | A completeness finding; saving is allowed. |
| A required structural property is absent, or the value has the wrong wrapper. | A structural defect; saving is blocked. | A structural defect; saving is blocked. |

An empty answer and a missing structural property are different conditions. For
example, an unanswered literal field can have a valid `@value: null`
representation; deleting a property required by the artifact schema is a
structural defect. Similarly, a well-formed number outside a field's declared
range is different from a value that cannot represent the declared numeric type.

The shared policy classifies findings as follows:

| Category | Meaning | Save Policy |
|---|---|---|
| `structural` | Malformed artifact shape, identifier, or typed value. | Blocks templates and instances. |
| `constraint` | A well-formed value violates a field constraint. | Blocks template defaults; warns for instance answers. |
| `completeness` | Required answers or minimum occurrences are missing. | Warns for structurally valid instances. Definition consistency is checked separately. |
| `verification` | The outcome or availability of an additional check. | Uses the check's outcome; an omitted or unavailable semantic check is not a successful check. |

Findings carry a stable code, category, message, and location. Common-library
locations are RFC 6901 JSON Pointers, including array indices and the offending
property. Editor adapters also expose component paths and occurrence indices so
that the interface can navigate to a finding. Applications should use the code
and location rather than interpret the diagnostic text. Unknown rule codes are
treated as structural defects rather than silently allowed.

Reports distinguish three questions:

- `structurallyValid`: does the artifact satisfy the structural requirements?
- `canSave`: does the applicable save policy permit saving?
- `isValid`: are the applicable requirements and checks satisfied?

For an instance containing `12` in the example above, `structurallyValid` and
`canSave` can be `true` while `isValid` is `false`. Hosts should use `canSave` for
the save decision. In the browser, unresolved validation of the current draft
also keeps saving disabled until the checks settle.

## Controlled Terms and External Authorities

A label search is a way to find a candidate, not evidence that the candidate is
valid. Controlled-term verification uses the exact identifier and the complete
field constraints, including ontology versions and class, branch, or value-set
restrictions. External-authority verification uses the corresponding authority's
identifier and record lookup rules.

The terminology service supplies controlled-term membership checks. The bridge
service supplies external-authority verification for authorities such as ORCID,
ROR, RRID, PMID, DOI, CompTox, and NIH grants. The validators retain four outcomes:

| Outcome | Meaning | Effect |
|---|---|---|
| `passed` | The applicable check completed successfully. | No semantic quality finding. |
| `failed` | The check established that the identifier fails the requirement. | Blocks a template default; produces a quality warning for an instance answer. |
| `notChecked` | The applicable check was not performed. | An explicit verification warning, with no claim of validity. |
| `unavailable` | The check could not establish an answer, for example because a service was unavailable. | An explicit verification warning, with no claim that the identifier is invalid. |

Unverified defaults may be saved with a warning when the check is `notChecked`
or `unavailable`; they do not receive a successful validation result. A default
known to fail its constraints cannot be saved. Structurally valid instance
answers remain saveable with these semantic quality findings.

Coverage limits also matter. Failure to find a DOI in a service that does not
cover every DOI is not proof that the DOI does not exist. It must retain an
unknown or unavailable outcome unless the check can establish failure.

Browser checks are asynchronous. Results belong to the identifier and
constraints that were checked; a late response for an earlier edit must not
replace the current draft's result. Cached results are refreshed as needed,
including when checking or saving. The server performs its own verification
instead of trusting a browser's previous result.

## Character Handling and Value Preservation

The character-handling rules provide the foundation for validation. Every layer
must agree on what value it received before it can agree on whether that value
is acceptable. CEDAR therefore uses explicit policies instead of each host's
default trimming, number conversion, or string comparison.

| Concern | Shared Rule |
|---|---|
| Blank text | Use the defined whitespace policy in both languages. A non-breaking space is not silently treated as ordinary blank padding. |
| Identifiers and IRIs | Validate according to the identifier's position and preserve its spelling. Do not globally trim, lowercase, or normalize identifiers. |
| Text length | Count Unicode code points for field length constraints. A supplementary-plane emoji counts as one code point, not two UTF-16 code units. |
| Display boundaries | Use grapheme clusters when shortening displayed text, so an accent or an emoji sequence is not cut apart. |
| Search | Derive normalized, case-insensitive search keys without rewriting stored labels or identifiers. |
| Numbers | Preserve exact integers and decimals instead of silently rounding through a JavaScript floating-point number. |
| Timestamps | Validate calendar values and required offsets, preserving supported fractional precision and offset information. Field-specific temporal precision remains a separate constraint. |
| Regular expressions | Use the shared ECMAScript, full-value matching contract. Browser evaluation runs in a bounded worker; an evaluation failure is not a successful match. |

These rules deliberately distinguish preservation from search and presentation.
For example, a precomposed `é` contains one code point, while `e` followed by a
combining acute accent contains two. Their stored forms remain distinct, even
when a search treats them equivalently and the display presents each as one
visible character. Likewise, visually similar property names are not merged by
Unicode normalization.

JSON and YAML parsing are part of this boundary. Duplicate decoded keys and
trailing documents are rejected. The YAML reader uses YAML 1.2 core semantics and
requires one mapping with unique string keys; strings such as `yes`, `on`, and
date-like text do not acquire unintended boolean or timestamp types. Unsupported
tags, non-finite numbers, cycles, and excessive alias expansion are rejected.

The TypeScript library's source-aware cloning and serialization helpers preserve
its exact numeric values. Hosts must use those supported paths rather than
assuming native `JSON.stringify` or `structuredClone` preserves every model
value. Reading and writing are not automatic data-repair operations.

## Library and Application Responsibilities

The contract is shared across languages through matching implementations and
conformance tests. There is no requirement for the browser to run Java or for
the server to run the browser editor.

| Component | Responsibility |
|---|---|
| Java model-validation library | Common text, identifier, numeric, temporal, field-value, and save policies; structured findings for definitions and instances. |
| Java artifact library | Model construction and JSON/YAML reading and writing, using the common policies at its boundaries. |
| TypeScript model library | Equivalent policies, exact-value handling, template consistency checks, and instance validation reports. A lightweight `/policy` entry point is available to hosts that need the shared policies. |
| Terminology and bridge services | Authoritative semantic checks, with explicit outcomes and version-aware constraints. |
| CED, CEE, CEF, and Workbench hosts | Present and navigate findings using the existing interface and apply the appropriate template or instance save policy. |
| Server save gates | Validate writes against the applicable template and repeat the checks required at the storage boundary. |

The quality report is a presentation of these validation facts. It does not
define a competing set of rules. CEE exposes both quality findings and the save
decision, and emits updates when asynchronous checks finish. See
[Validation and the Data Quality Report](../cedar-embeddable-editor/validation.md)
for the host API and examples.

The server remains the enforcement boundary for JSON and YAML writes, including
create, update, and verbatim operations. A client-side result or a request to skip
validation does not bypass structural validation. Authorization, template
version checks, and concurrent-update protection remain server responsibilities.

## Keeping Java and TypeScript in Agreement

Shared conformance corpora exercise the same inputs in both languages and assert
the expected findings, locations, semantic outcomes, and save decisions. The
TypeScript copies record their source revision and checksums so that divergence
from the shared cases is visible.

The tests also check preservation against the original input: Unicode spelling,
property names, exact numbers, and other supported values must survive the
relevant JSON/YAML and model round trips. Agreement between two implementations
would not be sufficient if both silently lost the same information.

For library usage, see the developer guides for the
[Java artifact library](cedar-artifact-library.md) and the
[TypeScript model library](cedar-model-typescript-library.md).
The [IRI guide](../user-guide/cedar-identifiers-and-iris.md) and
[YAML specification](../yaml-spec/index.md) describe the corresponding artifact
representations.

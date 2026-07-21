# Mapping to RDF

The CEDAR model was designed so that a filled-out instance can be read as a set of RDF
statements. An instance is not only a document to be stored and validated. It is also an
assertion about a thing, and that assertion can be expressed as a graph of
subject-predicate-object triples, ready to join other Linked Data.

Two pieces of the model carry the semantics that make this possible. Both are declared in the
schema, not repeated in the instance.

- **`instanceType`**, on a template or element, gives the RDF type asserted on its instances.
  It becomes the `rdf:type` of the resource the instance describes.
- **`propertyIri`**, on each child, gives the property the child binds to. It becomes the
  predicate that links the resource to the child's value.

The instance supplies the rest. Its `id` is the subject. Each field value is an object: a
controlled term or link contributes its IRI, a plain or typed value contributes a literal. A
nested element contributes a linked resource with its own type and its own triples.

## A Template That Carries Semantics

The property and type bindings live in the template. Shown in full, a small Study template
declares an `instanceType` for itself and its element, and a `propertyIri` for each child.

```yaml
type: template
name: Study
instanceType: https://schema.org/MedicalStudy
children:
- key: study-name
  type: text-field
  name: Study Name
  configuration:
    propertyIri: https://schema.org/name
- key: condition
  type: controlled-term-field
  name: Condition
  datatype: iri
  configuration:
    propertyIri: https://schema.org/healthCondition
- key: contributor
  type: element
  name: Contributor
  instanceType: https://schema.org/Person
  configuration:
    propertyIri: https://schema.org/contributor
  children:
  - key: full-name
    type: text-field
    name: Full Name
    configuration:
      propertyIri: https://schema.org/name
```

## An Instance

An instance of that template records the values. It carries no property or type bindings of
its own. Those come from the template it is based on.

```yaml
type: instance
name: SDY232
id: https://repo.metadatacenter.org/template-instances/1f9a2b3
isBasedOn: https://repo.metadatacenter.org/templates/7b8977e
children:
  Study Name:
    value: Immune biomarkers study
  Condition:
    id: http://purl.obolibrary.org/obo/DOID_2841
    label: asthma
  Contributor:
    children:
      Full Name:
        value: Ada Lovelace
```

## The Resulting Graph

Combining the instance with its template yields RDF. The instance's `id` is the subject, each
child's `propertyIri` is the predicate, and each value is the object. A literal value becomes
a literal, a controlled term becomes the term's IRI, and the nested element becomes a linked
resource typed by its own `instanceType`.

```turtle
@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix schema: <https://schema.org/> .
@prefix inst:   <https://repo.metadatacenter.org/template-instances/> .

inst:1f9a2b3
    rdf:type               schema:MedicalStudy ;
    schema:name            "Immune biomarkers study" ;
    schema:healthCondition <http://purl.obolibrary.org/obo/DOID_2841> ;
    schema:contributor [
        rdf:type     schema:Person ;
        schema:name  "Ada Lovelace"
    ] .
```

Because a controlled term is carried as an IRI rather than free text, it appears in the graph
as a resolvable resource, not a string. This is what lets metadata from different instances
and different templates be joined and queried together.

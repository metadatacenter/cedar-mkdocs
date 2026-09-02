# Creating Artifacts with the CEDAR Model TypeScript Library

The [CEDAR Model TypeScript Library](https://github.com/metadatacenter/cedar-model-typescript-library) reads, builds, and writes CEDAR templates, elements, fields, and instances in TypeScript. It supports the same [CEDAR model](../yaml-spec/cedar-model.md) and JSON and YAML representations as the Java [CEDAR Artifact Library](cedar-artifact-library.md).

This page introduces the main API through small examples. The library's [test suite](https://github.com/metadatacenter/cedar-model-typescript-library/tree/main/test) and [companion demo](https://github.com/metadatacenter/cedar-model-typescript-library-demo) contain more examples.

## Adding the Library

Install the package from npm:

```shell
npm install cedar-model-typescript-library
```

Import builders, readers, writers, model types, and value objects from the package entry point:

```typescript
import {
  CedarBuilders,
  CedarReaders,
  CedarWriters,
  ControlledTermOntologyBuilder,
  InstanceDataStringAtom,
  Iri,
  NumberType,
} from 'cedar-model-typescript-library';
```

## Creating Fields

`CedarBuilders` provides a builder for each field type. A text field can define length and pattern constraints:

```typescript
const studyId = CedarBuilders.textFieldBuilder()
  .withTitle('Study ID')
  .withDescription('The identifier of a study')
  .withSchemaName('Study ID')
  .withSchemaDescription('The identifier of a study')
  .withMinLength(2)
  .withMaxLength(10)
  .build();
```

A numeric field can constrain the number type and range and supply a default value:

```typescript
const completed = CedarBuilders.numericFieldBuilder()
  .withTitle('Treatment Completed %')
  .withSchemaName('Treatment Completed %')
  .withNumberType(NumberType.INT)
  .withMinValue(0)
  .withMaxValue(100)
  .withDefaultValue(0)
  .build();
```

A controlled-term field can restrict values to an ontology, branch, class, or value set. This field draws from the Human Disease Ontology:

```typescript
const disease = CedarBuilders.controlledTermFieldBuilder()
  .withTitle('Disease')
  .withSchemaName('Disease')
  .addOntology(
    new ControlledTermOntologyBuilder()
      .withUri(new Iri('https://data.bioontology.org/ontologies/DOID'))
      .withAcronym('DOID')
      .withName('Human Disease Ontology')
      .build(),
  )
  .build();
```

The library also supplies builders for text areas, temporal values, phone numbers, email addresses, links, radio buttons, checkboxes, single- and multiple-choice lists, attribute-value fields, external identifiers, and static content.

## Creating an Element

An element groups related fields for reuse. A child is added together with deployment information that gives it a property key and controls its label, description, property IRI, cardinality, and display behavior:

```typescript
const city = CedarBuilders.textFieldBuilder()
  .withTitle('City')
  .withSchemaName('City')
  .build();

const country = CedarBuilders.textFieldBuilder()
  .withTitle('Country')
  .withSchemaName('Country')
  .build();

const cityDeployment = city.createDeploymentBuilder('city')
  .withLabel('City')
  .withIri('https://schema.metadatacenter.org/properties/city')
  .build();

const countryDeployment = country.createDeploymentBuilder('country')
  .withLabel('Country')
  .withIri('https://schema.metadatacenter.org/properties/country')
  .build();

const address = CedarBuilders.templateElementBuilder()
  .withTitle('Address')
  .withDescription('A postal address')
  .withSchemaName('Address')
  .addChild(city, cityDeployment)
  .addChild(country, countryDeployment)
  .build();
```

Call `.withMultiInstance(true)` and optionally `.withMinItems(...)` and `.withMaxItems(...)` on a deployment builder when a field or element may repeat.

## Creating a Template

A template is the top-level form. Deploy each field or element under the property key that instances will use, then add it to the template:

```typescript
const studyIdDeployment = studyId.createDeploymentBuilder('study_id')
  .withLabel('Study ID')
  .withIri('https://schema.metadatacenter.org/properties/study-id')
  .withRequiredValue(true)
  .build();

const diseaseDeployment = disease.createDeploymentBuilder('disease')
  .withLabel('Disease')
  .withIri('https://schema.metadatacenter.org/properties/disease')
  .build();

const addressDeployment = address.createDeploymentBuilder('address')
  .withLabel('Address')
  .withIri('https://schema.metadatacenter.org/properties/address')
  .build();

const study = CedarBuilders.templateBuilder()
  .withTitle('Study')
  .withDescription('A template describing a study')
  .withSchemaName('Study')
  .withSchemaDescription('A template describing a study')
  .addChild(studyId, studyIdDeployment)
  .addChild(disease, diseaseDeployment)
  .addChild(address, addressDeployment)
  .build();
```

## Creating an Instance

An instance records values under the same property keys used when the template's children were deployed. It also identifies the template on which it is based:

```typescript
const instance = CedarBuilders.templateInstanceBuilder()
  .withSchemaName('SDY232')
  .withSchemaIsBasedOn('https://repo.metadatacenter.org/templates/123')
  .withDataValue('study_id', new InstanceDataStringAtom('SDY232'))
  .withDataIri(
    'study_id',
    'https://schema.metadatacenter.org/properties/study-id',
  )
  .build();
```

The instance model also provides atoms for links, controlled terms, typed values, nested elements, repeated values, and empty values.

## Reading Artifacts

Strict readers parse JSON or YAML into the same TypeScript model. Reader results include the artifact and a parsing report:

```typescript
const result = CedarReaders.json()
  .getStrict()
  .getTemplateReader()
  .readFromString(templateJson);

const parsedTemplate = result.template;
const errorCount = result.parsingResult.getBlueprintComparisonErrorCount();
```

Use the corresponding YAML reader when the source is YAML:

```typescript
const result = CedarReaders.yaml()
  .getStrict()
  .getTemplateReader()
  .readFromString(templateYaml);
```

The reader facades also expose readers for fields, elements, and instances. Compact YAML is intentionally explicit: use `CedarReaders.yaml().getStrictForCompact()` when reading the compact form.

## Serializing Artifacts

Strict writers serialize schema artifacts as JSON Schema or CEDAR YAML. Instances become JSON-LD or CEDAR YAML:

```typescript
const jsonWriters = CedarWriters.json().getStrict();
const yamlWriters = CedarWriters.yaml().getStrict();

const templateJson = jsonWriters
  .getTemplateWriter()
  .getAsJsonString(study);

const templateYaml = yamlWriters
  .getTemplateWriter()
  .getAsYamlString(study);

const instanceJson = jsonWriters
  .getTemplateInstanceWriter()
  .getAsJsonString(instance);

const instanceYaml = yamlWriters
  .getTemplateInstanceWriter()
  .getAsYamlString(instance);
```

Pass `true` as the second argument to `getAsYamlString` to produce compact YAML:

```typescript
const compactTemplateYaml = yamlWriters
  .getTemplateWriter()
  .getAsYamlString(study, true);
```

CEDAR's REST APIs accept either serialization. Send JSON Schema or JSON-LD with `Content-Type: application/json`, or send YAML with `Content-Type: application/yaml`. Use the corresponding `Accept` header when the response should use the same representation; JSON is the default. See the [CEDAR REST APIs](cedar-rest-apis/index.md) for routes and content negotiation.

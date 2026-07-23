# Creating Artifacts with the CEDAR Artifact Library

The [CEDAR Artifact Library](https://github.com/metadatacenter/cedar-artifact-library) is a Java library for building CEDAR artifacts in code and serializing them for upload. It provides a fluent builder for each kind of artifact, so you describe the artifact you want and the library produces the underlying representation. The artifacts it builds follow the [CEDAR model](../yaml-spec/cedar-model.md): a field asks for a single value, an element groups related fields, a template is the top-level form, and an instance holds the values entered against a template.

This page gives a feel for the API through a few small examples. The library's [test suite](https://github.com/metadatacenter/cedar-artifact-library/tree/main/src/test/java) exercises every artifact type and is the most complete reference.

## Adding the Library

The library requires Java 17 and is built with Maven. Follow the repository's build instructions to install it into your local Maven repository, then depend on it:

```xml
<dependency>
  <groupId>org.metadatacenter</groupId>
  <artifactId>cedar-artifact-library</artifactId>
  <version>2.8.4-SNAPSHOT</version>
</dependency>
```

Check the repository for the current version. The builder and renderer classes shown below live in `org.metadatacenter.artifacts.model.core` and `org.metadatacenter.artifacts.model.renderer`.

## Creating Fields

Fields are the atomic building blocks, and each field type has its own builder. A text field sets a name, a description, and optional length limits:

```java
TextField studyId = TextField.builder()
    .withName("Study ID")
    .withDescription("The identifier of a study")
    .withMinLength(2)
    .withMaxLength(10)
    .build();
```

A numeric field constrains its value to a number type and an optional range and default:

```java
NumericField completed = NumericField.builder()
    .withName("Treatment Completed %")
    .withNumericType(XsdNumericDatatype.INTEGER)
    .withMinValue(0)
    .withMaxValue(100)
    .withDefaultValue(0)
    .build();
```

A controlled-term field binds its value to terms drawn from an ontology, a branch, a class, or a value set. This one draws from the Human Disease Ontology:

```java
ControlledTermField disease = ControlledTermField.builder()
    .withName("Disease")
    .withOntologyValueConstraint(
        URI.create("https://data.bioontology.org/ontologies/DOID"), "DOID", "Human Disease Ontology")
    .build();
```

The library provides builders in the same style for temporal, text-area, radio, checkbox, list, link, phone-number, email, image, YouTube, rich-text, section-break, and attribute-value fields.

## Creating an Element

An element groups related fields so they can be reused across templates. Build it the same way, adding the fields it contains:

```java
ElementSchemaArtifact address = ElementSchemaArtifact.builder()
    .withName("Address")
    .withDescription("A postal address")
    .withFieldSchema(TextField.builder().withName("City").build())
    .withFieldSchema(TextField.builder().withName("Country").build())
    .build();
```

## Creating a Template

A template is the top-level form. Add the fields and elements it should contain; each is keyed by its name:

```java
TemplateSchemaArtifact study = TemplateSchemaArtifact.builder()
    .withName("Study")
    .withDescription("A template describing a study")
    .withFieldSchema(studyId)
    .withFieldSchema(disease)
    .withElementSchema(address)
    .build();
```

## Creating an Instance

An instance holds the values entered against a template. Build the field values, then assemble the instance, recording the template it is based on:

```java
FieldInstanceArtifact studyIdValue = TextFieldInstance.builder().withValue("SDY232").build();

TemplateInstanceArtifact instance = TemplateInstanceArtifact.builder()
    .withName("SDY232")
    .withIsBasedOn(URI.create("https://repo.metadatacenter.org/templates/123"))
    .withSingleInstanceFieldInstance("Study ID", studyIdValue)
    .build();
```

## Serializing for Upload

An artifact becomes useful once serialized. The library renders schema artifacts — templates, elements, and fields — as JSON Schema or YAML, and instance artifacts as JSON-LD.

Render a template as JSON Schema with `JsonArtifactRenderer`, which returns a Jackson `ObjectNode`:

```java
JsonArtifactRenderer jsonRenderer = new JsonArtifactRenderer();
ObjectNode templateJsonSchema = jsonRenderer.renderTemplateSchemaArtifact(study);
```

The same renderer serializes an instance as JSON-LD:

```java
ObjectNode instanceJsonLd = jsonRenderer.renderTemplateInstanceArtifact(instance);
```

Render a template as YAML with `YamlArtifactRenderer`, whose constructor takes a flag selecting the full (`false`) or compact (`true`) form. It returns a map you can write out with Jackson's `YAMLFactory`:

```java
YamlArtifactRenderer yamlRenderer = new YamlArtifactRenderer(false);
LinkedHashMap<String, Object> templateYaml = yamlRenderer.renderTemplateSchemaArtifact(study);
```

With a JSON Schema template or a JSON-LD instance in hand, you can upload it to CEDAR through the [CEDAR REST APIs](cedar-rest-apis.md).

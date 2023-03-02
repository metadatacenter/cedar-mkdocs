# CEDAR Template, Element, and Field Instances

This page describes the format of CEDAR's JSON-based metadata instances and describes how they can be created and the validated and uploaded to CEDAR via its REST APIs.

Example projects that programmatically create CEDAR instances can be found [here](https://github.com/metadatacenter/cedar-docs/wiki/CEDAR-Template,-Element,-and-Field-Instances).

The CEDAR Repository Model specifies the structure of the three core CEDAR structural artifacts: _templates_, _elements_, and _fields_. (A paper describing this model can be found [here](https://metadatacenter.org/open-repository-model-acquiring-knowledge-about-scientific-experiments); a full specification of the model is available [here](https://metadatacenter.org/tools-training/outreach/cedar-template-model).) These three artifacts are represented using JSON Schema. The structure of the JSON instance derived from each artifact is constrained by the artifact's JSON Schema specification. The three corresponding instance types are _template instances_, _element instances_, and _field instances_.

While the specification of templates, elements, and fields is relatively complex, instances have a simple structure and are designed to be easy for third party tools to generate and process.

### Basic Template, Element, and Field Instances

Template instances, element instances, and field instances are represented as JSON objects. Element and field nesting is handled using standard JSON object and field nesting, respectively. If a nested element or field instance is designed to hold multiple values then a JSON array is used. Fields are also represented as objects. Following JSON-LD their values are stored in a `@value` or `@id` fields inside that object, with the former being used for literal values and the latter for IRI values.

For example, if we have a template representing a study containing a study ID field and a nested template element describing a principal investigator, a conforming instance could look as follows:

    {
      "studyID": { "@value": "SDY2"  },
      "pi": { 
        "fullName": { "@value": "Dr. P.I." }, 
        "homePage": { "@id": "https://www.stanford.edu/people/DrPI.html" }, 
        "address": { "@value": "Stanford, CA 94305, USA" },
        "dob": { "@value": "1999-01-01" } 
      }
    }

### Enhancing Instances with Type Information

As described in the model document, JSON-LD is used to add semantic content to instances. For example, the above instance marked up with JSON-LD could look as follows:

    {
      "@type": "http://semantic-dicom.org/dcm#Study",
      "@id": "https://repo.metadatacenter.org/template_instances/55417",
      "@context": {
         "studyID": "https://schema.org/identifier",
         "pi": "https://myschema.org/property/hasPI"
      },
      "studyID": { "@value": "SDY2" },
      "pi": {
         "@type": "https://schema.org/Person",
         "@context": { 
            "fullName": "https://schema.org/name",
            "homePage": "http://xmlns.com/foaf/0.1/homepage",
            "address": "https://schema.org/address",
            "dob": "https://schema.org/birthDate"
          },
         "fullName": { "@value": "Dr. P.I" },
         "homePage": { "@id": "https://www.stanford.edu/people/DrPI.html" }, 
         "address": { "@value": "Stanford, CA 94305, USA" },
         "dob": { "@value": "1999-01-01", "@type": "http://www.w3.org/2001/XMLSchema#date" } 
      }
    }

Here we have added JSON-LD `@context`, `@type`, and `@id` fields to provide semantic markup. The `@context` field maps JSON properties to properties in controlled vocabularies; the `@type` field indicates the semantic type of each instance; the `@id` field gives a unique identifier to the template instance; finally, as mentioned above, the `@value` or `@id` fields are used to store literal values. In the case of the `dob` field we specify that the value is a date using the [XML Schema](https://www.w3.org/TR/xmlschema-2/) `date` datatype.

Essentially, we use JSON-LD to add type information to each template, element and field instance and to the JSON fields that they contain. In this example, the template instance is typed using the `Study` class in the [Radiation Oncology Ontology](https://bioportal.bioontology.org/ontologies/ROO) and the principal investigator instance is typed using the `Person` class in the [Schema.org](http://schema.org/) terminology. The `studyID`, `fullName`, `address`, and `dob` fields are also typed using terms from the Schema.org terminology - in this case using the `identifier`, `address` and `birthDate` properties. The `homePage` field is typed using the `homepage` property from [FOAF](http://xmlns.com/foaf/spec/). Finally, the `pi` fields is typed using an IRI from a user-defined terminology.

Note that JSON-LD also allows us to add datatype information to literal values by adding a JSON-LD `@type` field inside the field object. In the above example, we have indicated that the `dob` field must have a `date` value. While we have not explicitly added datatype information to the string-based fields `studyID`, `fullName`, and `address`, the types are implied here by convention. String-based fields default to the [XML Schema](https://www.w3.org/TR/xmlschema-2/) `string` datatype and numeric fields default to the `decimal` datatype.
### Instance Provenance Information

CEDAR instances also contain provenance information. At present, CEDAR defines seven required provenance fields. These fields are:

<table>
<tr>
<td>schema:name</td>
<td>
This is a Schema.org field that specifies the name of the instance.
</td>
</tr>
<tr>

<td>
schema:description
</td>
<td>
This is a Provenance and Versioning Ontology(PAV) field that specifies a datetime-encoded value indicating when the resource was created.
</td>
</tr>

<tr>
<td>
schema:isBasedOn
</td>
<td>
This is a Schema.org field that specifies template from which the instance was created.
</td>
</tr>

<tr><td>pav:createdBy</td>
<td>
This is a Provenance and Versioning Ontology (PAV) field that specifies the IRI of the creator.
</td>
</tr>

<tr><td>pav:createdOn</td>
<td>
This is a Provenance and Versioning Ontology (PAV) field that specifies a datetime-encoded value indicating when the resource was created.
</td>
</tr>

<tr>
<td>
pav:lastUpdatedOn
</td>
<td>
This is a PAV field that specifies a datetime-encoded value indicating when the resource was last updated.
</td>
</tr>
<tr>
<td>
oslc:modifiedBy
</td>
<td>
This is a URI-encoded field using an Open Services for Lifecycle Collaboration ontology (OSLC) term that specifies who updated the resource last.
</td>
</tr>
</table>

The following fields can optionally be included in instances:

<table>
<tr>
<td>pav:derivedFrom</td>
<td>
This field identifies a resource that this resource was originally copied from, if any.
</td>
</tr>
</table>

A JSON-LD `@context` field in an instance defines the `pav`, `oslc` and `schema` prefixes used by these fields. It also specifies that `pav:createdBy`, `oslc:modifiedBy`, `schema:isBasedOn`, and `pav:derivedFrom` field value must be URIs, and that the `pav:createdOn` and `pav:pastUpdatedOn` fields must by of type `xsd:dateTime`. The `xsd` prefix is also defined for the [XML Schema](https://www.w3.org/TR/xmlschema-2/) namespace.

    "@context": {
      "pav": "http://purl.org/pav/",
      "oslc": "http://open-services.net/ns/core#",
      "schema": "https://schema.org/",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "oslc:modifiedBy": { "@type": "@id" },
      "pav:createdOn": {  "@type": "xsd:dateTime" },
      "pav:lastUpdatedOn": {  "@type": "xsd:dateTime" }
      "pav:createdBy": { "@type": "@id" },
      "schema:isBasedOn": { "@type": "@id" },
      "pav:derivedFrom": { "@type": "@id" }
    }

### Example of Complete Template Instance

Here is an example of a complete CEDAR template instance containing a context definition, `@id` and `@type` fields, the `schema:isBasedOn`, `schema:name` and `schema:description` fields, provenance fields, and the nested user-defined `studyID` field and `pi` element:

    {
      "@context": {
        "pav": "http://purl.org/pav/",
        "oslc": "http://open-services.net/ns/core#",
        "schema": "https://schema.org/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "oslc:modifiedBy": { "@type": "@id" },
        "pav:createdOn": {  "@type": "xsd:dateTime" },
        "pav:lastUpdatedOn": {  "@type": "xsd:dateTime" },
        "pav:createdBy": { "@type": "@id" },
        "schema:isBasedOn": { "@type": "@id" },
        "pav:derivedFrom": { "@type": "@id" },
        "studyID": "https://schema.org/identifier",
        "pi": "https://myschema.org/property/hasPI"
      },
      "pi": {
         "@type": "https://schema.org/Person",
         "@context": { 
            "fullName": "https://schema.org/name",
            "homePage": "http://xmlns.com/foaf/0.1/homepage",
            "address": "https://schema.org/address",
            "dob": "https://schema.org/birthDate"
         },
         "fullName": { "@value": "Dr. P.I" },
         "homePage": { "@id": "http://xmlns.com/foaf/0.1/homepage" },
         "address": { "@value": "Stanford, CA 94305, USA" },
         "dob": { "@value": "1999-01-01", "@type": "xsd:date" }
      },
      "@type": "http://semantic-dicom.org/dcm#Study",
      "schema:name": "SDY2",
      "schema:description": "Metadata about an immune biomarkers study",
      "schema:isBasedOn": "https://repo.metadatacenter.org/template/4343",
      "@id": "https://repo.metadatacenter.org/template_instances/55417",
      "pav:createdOn": "2016-06-29T10:58:26-0700",
      "pav:createdBy":  "https://repo.metadatacenter.org/users/6d21a887",
      "pav:lastUpdatedOn": "2016-06-29T10:58:26-0700",
      "oslc:modifiedBy": "https://repo.metadatacenter.org/users/6d21a887",
      "pav:derivedFrom": "https://repo.metadatacenter.org/template_instances/7236"
    }

The inclusion of full `@context` specifications for all user-defined fields in this instance ensures that there is a complete (automatic) mapping of the instance to an equivalent RDF document. (See [Representing Template Instances as RDF](https://github.com/metadatacenter/cedar-docs/wiki/CEDAR-Template,-Element,-and-Field-Instances#representing-template-instances-as-rdf) below.) While CEDAR does not currently enforce such exhaustive field-to-property specifications, they are strongly encouraged. If a field does not have a `@context` entry specifying a property for it then that field and its value (be it a simple value or an element instance) are effectively dropped from any generated RDF document.

### Uploading and Validating Instances via CEDAR REST APIs

Some of the provenance fields in instances are generated by a CEDAR server when an instance is created. These fields include `@id`, `pav:createdOn`, `pav:createdBy`, `pav:lastUpdatedOn`, `oslc:modifiedBy`. When uploading instances to a CEDAR server these fields should be present in the instance and set to `null`.

Here is an example of a complete instance that is ready for upload to CEDAR:

    {
      "@context": {
        "pav": "http://purl.org/pav/",
        "oslc": "http://open-services.net/ns/core#",
        "schema": "https://schema.org/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "oslc:modifiedBy": { "@type": "@id" },
        "pav:createdOn": {  "@type": "xsd:dateTime" },
        "pav:lastUpdatedOn": {  "@type": "xsd:dateTime" },
        "pav:createdBy": { "@type": "@id" },
        "schema:isBasedOn": { "@type": "@id" },
        "pav:derivedFrom": { "@type": "@id" },
        "studyID": "https://schema.org/identifier",
        "pi": "https://myschema.org/property/hasPI"
      },
      "pi": {
         "@type": "https://schema.org/Person",
         "@context": { 
            "fullName": "https://schema.org/name",
            "homePage": "http://xmlns.com/foaf/0.1/homepage",
            "address": "https://schema.org/address",
            "dob": "https://schema.org/birthDate"
         },
         "fullName": { "@value": "Dr. P.I" },
         "homePage": { "@id": "http://xmlns.com/foaf/0.1/homepage" },
         "address": { "@value": "Stanford, CA 94305, USA" },
         "dob": { "@value": "1999-01-01", "@type": "xsd:date" }
      },
      "@type": "http://semantic-dicom.org/dcm#Study",
      "schema:name": "SDY2",
      "schema:description": "Metadata about an immune biomarkers study",
      "schema:isBasedOn": "https://repo.metadatacenter.org/template/4343",
      "@id": null,
      "pav:createdOn": null,
      "pav:createdBy":  null,
      "pav:lastUpdatedOn": null,
      "oslc:modifiedBy": null
    }

Note that the `schema:isBased` on field must contain the identifier of the template on which the instance is based.

The `@type` field is not required and can be omitted if you have not assigned a type to your instance.

The `https://resource.metadatacenter.org/template-instances` route can be used to create instances. (See [CEDAR REST APIs](https://github.com/metadatacenter/cedar-docs/wiki/CEDAR-REST-APIs) for information on using CEDAR REST APIs. Swagger-generated documentation for the CEDAR instance REST APIs can be found [here](https://resource.metadatacenter.org/api/#/Template32Instances).)

For example, assuming we have an instance in a file called `instance.json`, here is an example `curl` invocation of the call to create a new instance:

```
curl -H "Content-Type: application/json" -H "Authorization: apiKey <KEY>" 
     -X POST --data-binary @instance.json "https://resource.metadatacenter.org/template-instances"
```

It is strongly recommended that you validate instances using CEDAR's REST validation endpoint before trying to create them in CEDAR.

Again, assuming that we have an instance in a file called `instance.json`, here is an example `curl` invocation of the validation endpoint to validate that instance:

```
curl -H "Content-Type: application/json" -H "Authorization: apiKey <KEY>"  -H "Accept: application/json" 
     -X POST --data-binary @instance.json "https://resource.metadatacenter.org/command/validate?resource_type=instance"
```

### Processing Instances

Note that the JSON-LD markup and CEDAR-specific fields can optionally be ignored by third party software. If the JSON-LD `@context`, `@type` and `@id` fields, plus the CEDAR `schema:name`, `schema:description`, `schema:isBasedOn`, `pav:createdOn`,  `pav:createdBy`, `pav:lastUpdatedOn`, and `oslc:modifiedBy` fields are (recursively) removed from instances then the raw data payload remains.

In the case of the example above, the relevant raw data are:

    {
      "studyID": { "@value": "SDY2" },
      "pi": { 
        "fullName": { "@value": "Dr. P.I" },
        "homePage": { "@id": "https://www.stanford.edu/people/DrPI.html" }, 
        "address": { "@value": "Stanford, CA 94305, USA" },
        "dob": { "@value": "1999-01-01 }
      }
    }

CEDAR has a REST call that produces JSON with all JSON-LD annotations removed. This call is documented [here](https://resource.metadatacenter.org/api/#!/Template32Instances/get_template_instances_template_instance_id).  The process also flattens all literal values stored in <tt>@id</tt> and <tt>@value</tt> fields by removing the enclosing JSON object value and assigning the literal value directly to the relevant property.

With this final level of flattening the above example would look as follows:


    {
      "studyID": "SDY2",
      "pi": { 
        "fullName": "Dr. P.I",
        "homePage": "https://www.stanford.edu/people/DrPI.html", 
        "address": "Stanford, CA 94305, USA",
        "dob": "1999-01-01" 
      }
    }

### Representing Template Instances as RDF

Note that this JSON-LD representation can be automatically converted to an RDF representation.
Here, for example, is a Turtle representation of the above template instance:

    @prefix oslc: <http://open-services.net/ns/core#> .
    @prefix pav: <http://purl.org/pav/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix schema: <https://schema.org/> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    @prefix myschema: <https://myschema.org/property/> .
    
    <https://repo.metadatacenter.org/template_instances/55417>
      a <http://semantic-dicom.org/dcm#Study> ;
      schema:name "Immune biomarkers" ;
      schema:description "Metadata about an immune biomarkers study" ;
      schema:isBasedOn <https://repo.metadatacenter.org/template/4343> ;
      oslc:modifiedBy <https://repo.metadatacenter.org/users/6d21a887> ;
      pav:createdBy <https://repo.metadatacenter.org/users/6d21a887> ;
      pav:createdOn "2016-06-29T10:58:26-0700"^^xsd:dateTime ;
      pav:lastUpdatedOn "2016-06-29T10:58:26-0700"^^xsd:dateTime ;
      schema:identifier "SDY2" ;
      myschema:hasPI [
        a <https://schema.org/Person> ;
        schema:name "Dr. P.I" ;
        foaf:homepage <https://www.stanford.edu/people/DrPI.html> ;
        schema:address "Stanford, CA 94305, USA" ;
        schema:birthDate "1999-01-01"^^xsd:date
      ] .

Useful online tools for performing this conversion include [JSON-LD Playground](http://json-ld.org/playground/) and the [EasyRDF Converter](http://www.easyrdf.org/converter).

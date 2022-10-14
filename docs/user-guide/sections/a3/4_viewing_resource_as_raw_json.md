# Viewing Resource as Raw JSON

As noted in the [Viewing Resources Overview](https://metadatacenter.github.io/cedar-manual/sections/a3/1_viewing_resources_overview/), 
all CEDAR artifacts are maintained internally in JSON.

The three CEDAR templating artifacts—templates, elements, and fields—are maintained
as JSON Schema documents, an ASCII format following the JSON specification. 
(They are validated using a higher-level JSON Schema specification.)

CEDAR metadata instances are maintained in JSON-LD (for JSON-Linked Data), 
which also follows the JSON specification. 
JSON-LD is expressly designed for interoperability with RDF, 
so the CEDAR metadata instances can be expressed as JSON-LD or RDF.
The JSON-LD instances are validated using the JSON Schema of the CEDAR templates.

Whichever format applies to your artifact, you can access the artifact in that format  using links in horizontal bars at the bottom of the artifact when it is being viewed.
For metadata instances, you can also see the metadata in RDF form using similar links.

Raw formats can also be accessed via the web when OpenView is enabled for the artifact. When visiting an OpenView page, scroll the page to the bottom to find the JSON-LD and RDF viewing links. 
On the OpenView page for metadata instances you can also find a link to the JSON Schema for the template under which the instance was produced.

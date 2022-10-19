---
author: John Graybeal
status: Ready
---
# Understanding the Suggestion System

CEDAR's Value Recommender is a metadata recommendation system that helps users to fill out metadata templates with the most appropriate values. The system finds and applies patterns in the previously entered values to generate recommendations for all the recommendation-enabled fields. CEDAR's Value Recommender is integrated in the CEDAR Workbench [1] and it can also be invoked programmatically through its API [2].

This document describes the steps to enable recommendations for templates and use them to quickly and accurately create new metadata.

## Getting started
Metadata suggestions are disabled by default. When creating your template, you can enable suggestions by following these steps:
* Log in to the CEDAR Workbench [1] and create a new template.
* Add a new field to the template and use the “Suggestions” setting to enable recommendations for it. Note that:
   * The “Suggestions” tab is only available for fields of type “text”.
   * You must enable suggestions for a minimum of two fields in the template.

The Value Recommender will make recommendations only when it can see a pattern worth recommending, which means there must be many repeated values in a field. Thus, fields with controlled vocabularies, or with relatively few likely choices, are the best candidates for recommendations.

Save the template and click on the arrow located on the top left corner of the screen to exit the Template Designer.

Once the template has been saved, you can start filling it out with metadata and getting recommendations. At least one saved metadata instance must exist for a template before recommendations are generated. To fill out the metadata for a template with recommendations the user proceeds as for any other template:
* In the listing for the template, click on the ‘metadata’ tag (shown at right)<img class="right" src="https://github.com/metadatacenter/cedar-manual/raw/master/docs/assets/imgs/IntelligentAuthoringGuideMetadataTag.png" alt="Metadata Tag" height="16px" />. This generates a form to fill out the metadata.  Alternatively, select your template and click on the template options menu (displayed as three vertical dots), choosing “Populate” to start entering metadata for the template.
* Click on any field that is configured to support recommendations. You will receive a list of value recommendations presented as a drop-down. 
* The numeric percentages indicate the strength of the recommendation (not the percentage of entries that are filled out with that value). See the paper cited below for details about how this strength is calculated.

If you do not see a list of value recommendations when you expect them, it is likely that the metadata filled out so far for that template does not contain any patterns strong enough to recommend.  

## Example
Suppose we have an “Experiment” template with three fields: (1) an “experiment ID” field that stores the identifier of the experiment; (2) a “tissue” field that captures the type of tissue tested in the experiment, and (3) a “disease” field to enter the disease of interest. 

Fig. 1 shows the template in the Template Designer and the “Suggestions” setting for the field “tissue”. The user has clicked on the “tissue” field and enabled metadata recommendations for the field using the “Suggestions” tab. 

![](../../../../img/userguide/IntelligentAuthoringGuideFigure1.png){:width="75%" class="centered"}

We will assume the user also enables suggestions for the field “disease”.

Fig. 2 shows a screenshot of the Metadata Editor for a template generated from the Experiment template. The user entered the value “skin” for the field “tissue” and is about to enter a value for the field “disease”. In this case, the editor shows four suggested values: “skin ulcer”, “atopic dermatitis”, “melanoma”, and “psoriasis”. The percentage shown between brackets next to each suggestion represents the strength of the recommendation. The recommendations provided by the system are context-sensitive, meaning that the values predicted for the “disease” field are generated and ranked based on the value entered for the “tissue” field. In this case, the four values suggested by the system are useful, since all of them are diseases that affect the skin.
![](../../../../img/userguide/IntelligentAuthoringGuideFigure2.png){:width="75%" class="centered"}

## Frequently Asked Questions

**Can I enable suggestions for text fields whose values have been restricted to terms from ontologies?**
:   Yes. CEDAR’s Value Recommender works both for plain text values and ontology terms.
<div> </div>

**Can I access the source code?**
:   Yes. The source code of CEDAR’s Value Recommender is open source and available on GitHub [3].
<div> </div>

**How does CEDAR’s Value Recommender work?**
:   The system is based on a well-established data mining method known as association rule mining to generate real-time suggestions based on analyses of previously entered metadata. A paper describing this method in detail will be available soon.
<div> </div>

**Will recommendations still work if I modify the template after metadata is collected?**
:   No, they will not. To modify a template with existing metadata, you must create a new template version. The recommendations for the previous template version will be applied to any metadata created from that previous template, and metadata for the new template version will be based on metadata created for that version.
<div> </div>

**Can I use recommendations based on metadata from other CEDAR templates?**
:   Not yet, although we are investigating this as a possible enhancement.
<div> </div>

**What are the technologies behind CEDAR’s Value Recommender?**
:   CEDAR's Value Recommender has been implemented in Java. The system uses the Dropwizard framework [4] to provide a REST-based API that is used by the Metadata Editor and can also be used directly by third-party applications. The rule extraction process is performed using the Java API of the WEKA (Waikato Environment for Knowledge Analysis) data mining software [5]. All metadata for a particular template are transformed to WEKA's ARFF (Attribute-Relation File Format). The association rules are extracted using the Apriori algorithm, which is commonly used in association rule mining.
<div> </div>

**How should I cite this work?**
:   Please cite the following paper, which describes CEDAR’s Value Recommender in some detail: <br />
   _Martínez-Romero M, O’Connor MJ, Egyedi AL, Willrett D, Hardi J, Graybeal J, Musen MA. Using association rule mining and ontologies to generate metadata recommendations from multiple biomedical databases. Database. Volume 2019, 10 June 2019. https://doi.org/10.1093/database/baz059._

## References

<pre>
[1] https://cedar.metadatacenter.org/
[2] https://valuerecommender.metadatacenter.org/api
[3] https://github.com/metadatacenter/cedar-valuerecommender-server
[4] https://www.dropwizard.io
[5] https://www.cs.waikato.ac.nz/ml/weka/
</pre>


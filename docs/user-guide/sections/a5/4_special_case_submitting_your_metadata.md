---
author: John Graybeal
status: Ready
---
# Special Case—Submitting Your Metadata

In some cases, it may be possible to submit your data to external repositories
using the CEDAR system. 
The first major instances of this capability are the pipelines for submitting to repositories
at the National Center for Biotechnology Information (NCBI), 
in particular the BioProject, BioSample, and SRA repositories.

## **Assessing Instance for Submission** 

To determine if a CEDAR metadata instance can be submitted to an external repository,
click on the 'kebob' menu (the vertical dots) for that metadata instance. 
If the menu list shows the Submit menu is enabled (as in the image below),
the artifact is capable of being submitted externally.

![](https://github.com/metadatacenter/cedar-manual/raw/master/docs/assets/imgs/submit-metadata-externally-menu-20191126.png){:width="80%" class="centered"}

When you click on the Submit menu, CEDAR will displays a dialog box (shown below) with a list of the repositories to which these metadata can be submitted. 

![](https://github.com/metadatacenter/cedar-manual/raw/master/docs/assets/imgs/submit-metadata-externally-dialog-box-20191126.png){:width="50%" class="centered"}

## **CEDAR Submission Workflows**

The submission workflows described above are documented externally in some detail.

### CAIRR Pipeline for the MiAIRR Standard

This pipeline accepts metadata for NCBI's BioProject, BioSample, and SRA repositories
in a single template, and distributes the metadata and associated data to the three repositories.
It is described in an [overview of the CEDAR AIRR (CAIRR) pipeline](http://docs.airr-community.org/en/latest/cairr/overview.html).
Detailed instructions are found in the [MiAIRR Submission Manual](http://docs.airr-community.org/en/latest/miairr/manual_miairr_ncbi.html#miairr-ncbi-submission-manual-option-1).

You can read more about this pipeline in the article [The CAIRR Pipeline for Submitting Standards-Compliant B and T Cell Receptor Repertoire Sequencing Studies to the National Center for Biotechnology Information Repositories](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6105692/).

### CEDAR Pipeline for Human Tissue

The CEDAR-to-NCBI Human data submission pipeline provides an interface to transmit SRA datasets to the NCBI SRA and BioSample repositories from the CEDAR Workbench following the BioSample Human package v1.0.
It is described with detailed instructions in this [overview of the CEDAR-to-NCBI Human data submission pipeline](https://github.com/metadatacenter/pipelines/wiki/CEDAR_to_NCBI_Human-Pipeline).

## Other Submission Techniques

In other CEDAR integrations, submission to remote repositories is accomplished when
the remote repository pulls data from CEDAR. 
If you are filling out metadata that is destined for a remote repository using this method,
you could receive special instructions regarding which template to use and how to 
indicate when your metadata is ready for ingest by the remote repository.

Further information about these and other CEDAR submission pipelines can be found on the [CEDAR GitHub pipelines wiki](https://github.com/metadatacenter/pipelines/wiki).







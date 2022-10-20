---
author: John Graybeal
status: Ready
---
# Building Shareable Metadata Creation IRIs

Building on the other sections in this chapter, we briefly describe how to create an IRI 
that will launch a fresh appropriate metadata creation form for your template. 

Given a template IRI, you can preface it with the metadata creation IRI base, which is `https://cedar.metadatacenter.org/instances/create/`. 
So if your template looks like
`https://repo.metadatacenter.org/templates/f7d62955-ed10-4912-b4db-1b366ad4ff00` (_not a real template!_),
you would get an IRI (URL) like 
`https://cedar.metadatacenter.org/instances/create/https://repo.metadatacenter.org/templates/f7d62955-ed10-4912-b4db-1b366ad4ff00`
(entering this won't do any good because that wasn't a real template).

When such an IRI is clicked or put into the browser, it would launch CEDAR, log in (or create account for) the user if necessary, 
and put the user into a new metadata creation form for that template. 

Because there is no 'return folder' specified in this URL, 
when the user saves the created metadata, it will be put into his or her home folder, and the user will be returned to that folder.
If the user will have write access to a particular folder where this metadata should go, appending the folderID 
(with `?folderID=`and the encoded ID of the target folder) will result in the saved metadata going into that folder.  
(However, in that case the user may not realize how that happened or how to return to it, so this approach should be used with caution.)

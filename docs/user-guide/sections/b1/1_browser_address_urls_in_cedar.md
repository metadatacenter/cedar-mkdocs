---
author: John Graybeal
status: Ready
---
# Browser Address URLs in CEDAR

When you run CEDAR, the first page you see will be your Workspace home page, and the top of your browser may look something like this:

![](../../../../img/userguide/browser-cedar-urls-20190910.png){:width="100%"}

The bar at the top of the browser shows part of the IRI describing CEDAR's location. Here we describe how to read these IRIs (also known as URLs), so that you can use parts of it in the rest of this section. 

## **Workspace Home Directory IRI**

When you log in for the first time or go to your home directory, the URL in the browser will be like the following:
```
https://cedar.metadatacenter.org/dashboard?folderId=https:%2F%2Frepo.metadatacenter.net%2Ffolders%2F4036e319-5bb7-493f-8fe5-31a004f65a94
```

The first part of this is straightforward: `https` is the protocol, `cedar.metadatacenter.org` is the path for the application, and 
`dashboard` is the application type that is presenting the content.

After the dashboard you will usually see the query character `?` followed by `folderID=`. 
This means that the following string will be the (encoded) unique identifier of the location that the CEDAR Workbench is displaying. 
If you've just logged in, this will identify your own home folder.

You'll notice that the identifier has a number of escape characters, usually just `%2f` for a slash in this case. 
You are seeing an _encoded_ version of the identifier. 
You can see the actual identifier by passing this string through an encode-decode site (e.g., https://www.url-encode-decode.com)
and asking to decode the string. Doing so for this string results in the identifier
```
https://repo.metadatacenter.net/folders/4036e319-5bb7-493f-8fe5-31a004f65a94
```
which is the actual unique identifier for the viewed location.

## **Template Creator or Metadata Editor IRI**

If you open an existing template, you'll see an IRI like

```
https://cedar.metadatacenter.org/templates/edit/https://repo.metadatacenter.org/templates/4595e3d3-b0c5-467b-a967-fec870801624?folderId=https:%2F%2Frepo.metadatacenter.org%2Ffolders%2Feaa65a39-1706-43b6-b4ca-2bf9d7d1166d
```

Breaking that down, we've replaced `dashboard?folderID=` in our previous example with `template/edit/`, 
which tells us we are in the template editor.
(For a metadata instance, we would see `instances/edit/`, 
and if we were just creating an instance for the first time, `instances/create/`.)

Everything that follows the `template/edit/` string, until reaching the `?`, is a template identifier:
```
https://repo.metadatacenter.org/templates/4595e3d3-b0c5-467b-a967-fec870801624
``` 
That is the unique identifier that you will see inside the template as its own ID.

Then we see the `?folderID=` string again. 
In this case the following string indicates to what page in your Workspace CEDAR will return to after leaving the template editor;
it is the (encoded) IRI of the folder to which CEDAR will return. 
That will usually point to the previous *non-search* page you saw before entering the template creator. 
But if someone sent you the IRI from _their_ browser, it will try to return you to the previous non-search page in _that_ session.
(If it fails because you don't have permission to see that page, it will return to your workspace homepage.)

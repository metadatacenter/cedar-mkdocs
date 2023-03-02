---
author: John Graybeal
status: Ready
---
# Saving and Closing

## **Saving**

To save a templating resource—Template, Element, or Field—click on the Save button at the bottom right of the templating resource. 
This will be labeled Save Template, Save Element, or Save Field depending on the
type of templating resource you are editing.

![](../../../img/userguide/creating-new-template-20191216.png){:width="80%" class="centered"}

At the top right of the templating resource, 
there are 3 icons that indicate the resource status.
The left-most icon (the circle) is filled when the instance has no unsaved changes, 
but is a hollow yellow circle when there are unsaved changes.

If the lock (the middle icon) is yellow and locked, 
you will not be able to save your changes, 
even to a separate file. 
To create an editable version of the resource,
you will have to exit the resource, make a copy of it from the Desktop,
and edit the copy you made.

## **Validation**

CEDAR performs syntactical validation of a templating resource when it is opened and saved. 
This checks that the resource conforms to the Template Model schema, 
which is expressed as JSON Schema. 
The validation should always succeed and yields a white checkmark in the third icon.
If the syntactical validation fails, the checkmark turns yellow,
indicating there is a problem in the CEDAR system. 
Often you still will be able to work with the resource,
but it is best to contact the CEDAR team to alert them to the problem.

On a successful verification, CEDAR issues a green 
"[Artifact] saved successfully" notification, where '[Artifact]' will be replaced by
'Template', 'Element', or 'Field'. 

## **Closing**

### Saving before closing

While a templating resource is being edited in the Template Designer, 
it can be saved at any time.

![](../../../img/userguide/CEDAR-recent-changes-message-20200103.png){:width="15%" class="right"}
If you have made changes and try to leave the resource without saving it
by using the CEDAR back button,
CEDAR will issue a warning. If you click Continue, any changes you made will be lost
and CEDAR will return to the Desktop view. 
Choosing the Go Back button will return you to the templating resource.

![](../../../img/userguide/chrome-browser-leaving-site-message-202000103.png){:width="15%" class="right"}
If you have made changes and try to leave the resource without saving it by using the browser back button or closing the browser window, the browser will issue an error message.
In Chrome, click on Leave Site (the default) to close the resource, 
and on Cancel to remain on the page.

``` 
Because there might be unusual conditions that cause you to lose your session,
we strongly encourage you to save your work often. 
We are unable to restore work that has been lost when the session is lost.
```

If you have remained on the page, you can save the resource and then 
return to the Desktop view or close the window.

### Returning to Desktop

![](../../../img/userguide/back-buttons-20200103.png){:width="20%" class="right"}
When you close the template to return to the CEDAR Desktop view,
there are two 'return left' buttons—the one in the browser, 
and the one at the upper left of the CEDAR Template Designer.
The CEDAR button remembers the last folder you had open in the Desktop view,
ignoring any searches you may have performed since then.

If you launched the Template Designer from a CEDAR search results page,
and want to return to that page,
use the browser back button,
and the same search should be performed.
(If you mistakenly chose the CEDAR back button, 
you can still use the browser button twice to get back to the previous search results.)

### Recovering previous version

Because there is no undo, should you need to recover a previous version of the document,
you can contact CEDAR staff to restore a version from before the time you started editing.
If you plan to make significant changes to a template, 
especially if you are experimenting with it, 
we recommend saving a copy before you start changing it.



---
author: John Graybeal
status: Ready
---
# Saving and Validating

## **Saving**

To save the instance, click on the Save button at the bottom right of the instance.

![](../../../img/userguide/entering-metadata-folded-elements-20191124.png){:width="75%" class="centered"}

While an instance is being edited in the Metadata Editor, it can be saved at any time.
If you have made changes and try to leave the instance without saving it, 
CEDAR will issue a warning. If you click Continue, any changes you made will be lost. 
Choosing Go Back will return you to the instance, where you can save it.

Because there is no undo, should you need to recover a previous version of the document,
you can contact CEDAR staff to restore a version from before the time you started editing.
If you plan to make significant changes to a template, 
especially if you are experimenting with it, 
we recommend saving a copy before you start changing it.

At the top right of the instance, there are 3 icons that indicate the instance status.
The left-most icon (the circle) is filled when the instance is saved, 
but is a hollow yellow circle when there are unsaved changes.

If the lock is yellow and locked, you will not be able to save your changes, 
even to a separate file. 

## **Validation**

CEDAR is always performing syntactical validation of an edited instance against the template. This checks that the schema conforms to the corresponding schema, 
which should always be true and yields a white checkmark in the third icon.
If the syntactical instance validation fails, there is a problem in the CEDAR 
system, and the checkmark turns yellow. You may be able to work with the instance,
but it is best to contact the CEDAR team to alert them to the problem.

Whenever CEDAR saves an instance with entered content, it attempts to verify the metadata content of the instance satisfies the instructions in the JSON Schema 
specified by the template. 
This detects issues with missing fields and malformed fields (e.g., a link field that 
contains data that is not a link).

On a successful metadata content verification, CEDAR issues a green "Instance saved successfully" notification.
If the verification fails due required fields being missing, 
CEDAR issues a report listing the missing fields.
If the verification fails due to a more fundamental error,
CEDAR issues a red "Instance not saved" message, 
along with basic error messages. 

In some cases—for example, MiAIRR submissions—
CEDAR may even run an external validator on the metadata produced by CEDAR.
If this validation fails, CEDAR presents a more detailed error report 
offering the report from the external validator.

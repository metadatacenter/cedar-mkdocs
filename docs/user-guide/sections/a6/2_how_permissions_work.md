---
author: John Graybeal
status: Ready
---
# How Permissions Work

## **Introduction**
You may have some questions about CEDAR's access privileges, like these:

1. How can I keep my files private (or make them public)?
2. How can someone collaborate with me on a lot of different files?
3. Why can't I save this metadata where the template is?
4. How can I tell whether other people can see my file?
5. I just logged in for the first time, why can't see some of the shared files?

In this tutorial we'll talk about how CEDAR permissions work, and help you answer questions like these.

(You can see answers to the questions at the end of this page.)

## **Permission types**
You want to access individual resources in CEDAR, or keep someone else from accessing them. So what you need to know, for a given node, is whether a particular user:

- can read,
- can write,
- can publish,
- can create a draft version of,
- can change the permissions (sharing) of, or
- can change the owner of the node.

The operations above are evaluated on-the-fly in CEDAR. They are not attached to nodes in the system, but are computed from different graph relationships (like folder hierarchies) and properties when they are needed.

A basic concept that may help you interpret CEDAR permissions is that you only need one permission on a resource to perform that operation. 

## **Permission rules**
For simplicity, we refer to the object in each question as a resource (templates, elements, fields, and metadata instances are all resources), but this section also applies to folders.

We should not that for practical reasons, the administrator of the CEDAR system has permission to do all of the actions represented by the 6 permission types above.

Now let's start with a few easy-to-answer questions.

### **Who can change the owner of a resource?**
Only the owner of a resource can change the owner of a resource. Each resource has only one owner.

### **Who can change a resource's permissions?**
The resource's permissions are changed via the Share menu for the resource. 

To change a resource's permissions, the following must be true:

- The user has write access to the resource. (This means they can update the resource. And who can do that? See below.)

### **Who can read a resource?**
For a user to be able to read a resource, at least one of the following must be true:

- The user owns the resource, or a folder that contains the resource
- The user, or any group of which the user is a member, can read or write the resource or any folder containing it (except the root folder '/' and users folder '/Users').

For example, because any user can read the '/Shared' folder, any user can also read any content at any level under the '/Shared' folder. (Unfortunately, this means we can't give users write permission in this folder, because then they can overwrite any other shared content. We'll create an exception rule to handle this soon.)

### **Who can update a resource?**
These rules are similar to reading. For a user to be able to update a resource, at least one of the following must be true:

- The user owns the resource, or a folder that contains the resource
- The user, or any group of which the user is a member, can write the resource or any folder containing it

The creation rules are just like the updating rules, except simpler, since the user can’t own or write a resource that doesn’t exist. (To create a resource, use the 'New +' icon at the upper left of your workspace.) So one of the following must be true:

- The user must own any containing folder (that is, any single folder higher in the hierarchy than the new resource).
- The user must be able to write any containing folder (that is, any single folder higher in the hierarchy than the new resource).
Note that no user can write or create resources directly in the '/', '/Users', or '/Shared' folder. 

Copying a folder or resource into a target folder, or moving a resource into a target folder, requires the same permission as creating a resource in the target folder.

### **Who can create a draft version of a published resource?**
A draft version of a resource is a resource that can be overwritten, by editing and saving it. All resources in CEDAR start out as a draft, and must be explicitly published (see next item) before this question applies.

For a user to create a draft from a published resource, the following must be true:

- The user owns the published resource that serves as the original content for the draft.
- The resource is a type that supports versioning (field, element or template).
- The resource is the most recently published in the version history of this resource

The last rule means you can not create a draft from some earlier published version of the resource.

### **Who can publish a resource?**
Publishing a resource is like 'releasing' source code or defining a version of a document: a published resource can never be modified. The only types of resource that can be published are templates, elements, and fields, and they must start out in draft state. (The act of publication replaces the 'draft' version.)

For a user to publish a resource, the following must all  be true:

- The user owns the resource that is to be published.
- The resource is in draft state (all resources start in draft state, and if a draft exists, it is always the most recent resource in a version history)
- The resource is of a versioned type (field, element or template).
 

## **Answers**
Now we can answer our original questions.

1. **How can I keep my files private (or make them public)?**
Your resources will stay private if they are in your own CEDAR user folder, and you have not shared any of their parent folders with anyone else.

To make your files public, simply share them, or one of their parent folders, with the individuals or groups who should get access. The 'everybody' group can be used to share the content with all CEDAR users.

2. **How can someone collaborate with me on a lot of different files?**
Just share the folder containing all of your collaborative files with them. Sharing write privileges on the folder will let them modify all the contained files.
(If you want to have a shared folder for your project under /Users/Shared/, just ask us to create it for you. Be aware the contents are readable by *all* CEDAR users.)

3. **Why can't I save this metadata where the template is?**
Often templates are in a read-only folder, so that the template can not be changed. 
CEDAR will automatically save created metadata to your home folder,
and then you can move it to any other folder that for which you have write permissions.

4. **How can I tell which other people can see my file?**
Unfortunately there is no simple way to evaluate this, without examining the sharing permissions on the resource, and on every folder above it.

5. **I just logged in for the first time, why can't I see some of the shared files?**
All CEDAR permissions must be materialized in Elasticsearch, in order to be used directly for search queries.
When you first log in, your materializations must be created, which can take some time.
In a similar way, a change in the permission of any given node is not propagated instantly into the Elasticsearch index.
Depending on the size of the affected subtree (if the node is a folder), materializing this permission can take several seconds.

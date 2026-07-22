# Artifact Versioning

As your templates grow and start reusing elements, you will want to update those elements.
Doing so is a little subtle in CEDAR, especially when you want rigorous version control.

## Updating Fields and Elements

When a template or element contains nested elements, you may need to update a lower-level
element. Because elements are imported as fixed copies, this takes two steps.

First, update the element itself. If it is under version control, follow
[Creating and Managing Versions](#creating-and-managing-versions).

Then open the template that contains it and import the updated element, as described in
[Adding Elements](building-basic-templates.md#adding-elements). The updated element appears at
the bottom of the form. Move it into place and delete the old copy. Repeat for each updated
element, and remember to update any other forms that use it.

### Updating Nested Elements

Because imported fields and elements are fixed once imported, several levels of nesting must be
updated from the bottom up: make all the changes at the lowest level before re-importing at the
next level. For example, if Template A contains Element B, which imported Field C, then changing
Field C means first modifying Field C, then importing the new Field C into Element B, then
importing the new Element B into Template A. When several things change at one level, make them
all before re-importing that element into its parent.

## Creating and Managing Versions

CEDAR gives every new artifact (template, element, or field) the version `0.0.1`. You can edit
the artifact as often as you like without the version changing. You should not, however, modify
a template that already has instances; CEDAR warns you if you try.

Many authors want firmer control, so that a change is visible to everyone, and so that older
copies stay available for comparison or reference.

CEDAR uses semantic versioning, a `major.minor.patch` number. The rightmost number marks a
trivial change, the middle a minor one, and the leftmost a major one. Each release takes a
number higher than the last. From `0.0.1`, for instance, you could go to `0.0.2` (or any higher
`0.0.x`), `0.1.y`, or `1.y.z`.

### Publishing a Version

Version control is enabled by the **Publish version** item on an artifact's kebab menu.
Choosing it prompts you for the version number. Once you pick a version and save, that version
can no longer be modified, and its number appears in your workspace listings.

### Updating a Versioned Artifact

To make a new version, choose **Create version** from the artifact's menu. CEDAR creates a new,
editable draft with the rightmost version number incremented by one, and records the version it
came from as its predecessor. Edit the draft freely; when it is ready, publish it as above,
choosing any number at least as high as the draft's.

As noted in [Updating Nested Elements](#updating-nested-elements), templates and elements import
lower-level artifacts whole, so later changes to those artifacts do not flow into the ones that
imported them. When you create new versions of elements or fields, re-import them by following
[Updating Fields and Elements](#updating-fields-and-elements). Publishing an artifact never
changes its IRI, even when the published version number differs from the draft's.

## Finding and Viewing Versioned Artifacts

When you publish new versions, the earlier published versions stay on the system and remain
accessible. By default, though, the workspace and search show only the most recent published
version of an artifact, plus its draft if one exists.

![](../img/userguide/version-control-closed-20191216.png){:width="20%" class="right"}
This is governed by the Version drop-down in the Filter section on the left of the workspace,
usually closed, as shown at right.

![](../img/userguide/version-control-latest-enabled-20191216.png){:width="20%" class="right"}
Opening it reveals a Latest indicator. With its checkbox darkened, only the latest version is
shown, and older versions are hidden from search results and listings.
![](../img/userguide/version-control-latest-enabled-listed-20191216.png){:width="50%" class="centered"}

![](../img/userguide/version-control-latest-disabled-20191216.png){:width="20%" class="right"}
Click Latest to turn the filter off. Every version then appears in any search or folder that
contains it.
![](../img/userguide/version-control-latest-disabled-listed-20191216.png){:width="50%" class="centered"}

### Seeing All Versions of an Artifact

![](../img/userguide/version-tab-metadata-panel-20191216.png){:width="25%" class="right"}
An artifact's version history is in the Version tab of the metadata panel (right). Click the
'i' icon to open the panel; see
[Viewing Resource Details](viewing-resource-information.md#viewing-resource-metadata) for more.

The example shows three versions of the Version Test artifact. The Version tab lists every
version of the selected artifact, whatever the Filter's Version drop-down is set to. A globe
icon marks a published version; an artifact without it is a draft.

Click a version's title in the list to open it in the Template Designer. A published artifact
can have only one draft open at a time, and that draft is always more current than any of its
published versions.

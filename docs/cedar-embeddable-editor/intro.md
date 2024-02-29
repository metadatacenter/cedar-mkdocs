# Introduction

The CEDAR Embeddable Editor is a stand-alone web-component that can be integrated into any kind of frontend which supports web components.
It is an integral part of the CEDAR project, uses the same template structure that the CEDAR application does.

There are several use cases for this embeddable editor:

## Single template, outside of CEDAR
The embeddable editor will load a single template, and will produce instances of the given template
### Integration
1. Create a CEDAR account on the production CEDAR
2. Create the template
3. Download the template (using curl, or copy-paste)
4. Integrate the web component in your project
5. Make the template accessible at a well-known location
6. Configure the location of the template in the embedded editor
7. Handle the instance data produced by the embeddable editor

## Multiple templates, outside of CEDAR 
The embeddable editor will allow the user to choose from a predefined list of templates, and will produce instances of the given template
### Integration
The steps are similar as above with these differences:
1. All templates must be made accessible by the embeddable editor
2. The template chooser must be enabled from the embeddable editor's config

## Open templates from CEDAR
It is a valid use case to have the templates be stored in the production CEDAR.

In this case the templates can be made "OpenView" accessible, which means they are readable without any authentication data.

The embedded editor will be able to read such templates

## Templates from CEDAR through a proxy
CEDAR normally requires a JSON Web Token (JWT) or a apiKey as authorization data to allow access to its API calls.

Having a front-end that uses an apiKey directly means that the given API key is made public. This is a bad practice, and should be avoided.

Instead, the embeddable editor should make a call to an endpoint which will make a proxy call to CEDAR (providing the correct aut data).
It is the responsibility of the integrator to create such a proxy, provide the auth data, and also protect the proxy from unwanted access.

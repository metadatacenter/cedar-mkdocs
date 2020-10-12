# Overview

The preferred way for the setup of CEDAR would be to first install the infrastructure services, and then proceed with CEDAR code.

However, there is a dependency, where a CEDAR `jar` needs to be installed under `Keycloak`.

In order to do the `Keycloak` installation and setup in one pass (instead of doing a partial setup, and later coming back to it again)
we chose to build the CEDAR code first, and then proceed with the infrastructure services.

We strongly recommend this approach, but the 'infra-first code-second' approach is also valid.      


# Overview
The CEDAR system is relatively complex: it uses 13 microservices, 2 frontends and 7 infrastructure services.

Orchestrating the startup, shutdown, rebuild of this system would be a heavy burden if only shell commands were to be used.

## Scripts
In order to make the developer's life easier, we created a set shell scripts, and a set of aliases. These will help the user to easily handle the tasks that will be performed during the development.

## Environment variables
In order to make the system relatively easily configurable, we extracted the configuration data into environment variables.
These environment variables should be always available in the shell of the user whop develops/maintains the system. 

Currently, there are over 130 variables supported.
These are either read directly from the environment (this is the rare case), or are embedded through automatic interpolation into different configuration files (this is the typical scenario).

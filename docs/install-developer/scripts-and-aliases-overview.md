# Overview
The CEDAR system is relatively complex: it uses 15 microservices, 6 frontends and 7 infrastructure services.

Orchestrating the startup, shutdown, rebuild of this system would be a heavy burden if only shell commands were to be used.

## CEDAR-CLI
In order to make the developer's life easier, we created a command line intyerface that centralizes all the commands. This tool will help the user to easily handle the tasks that will be performed during the development and deployment.

## Environment variables
In order to make the system relatively easily configurable, we extracted the configuration data into environment variables.
These environment variables should be always available in the shell of the user whop develops/maintains the system. 

Currently, there are approximately 180 variables maintained.
These are either read directly from the environment (this is the rare case), or are embedded through automatic interpolation into different configuration files (this is the typical scenario).

# Run CEDAR with Docker

CEDAR is more than a web page. The Workbench depends on authentication, databases, search, and a
collection of services that store and coordinate your templates and metadata. Installing every
part directly on a computer is useful for core development, but it is a lot to ask of someone who
first wants to explore the complete system.

This Docker installation brings those parts up together as one local CEDAR environment. When it is
running, you use CEDAR in a browser much as you would use a hosted installation: sign in, work in
Workspace, design a template, and enter or view metadata. The application is reached through local
`metadatacenter.orgx` addresses, while its internal services stay on a private Docker network.

Your data remains on your computer in Docker volumes. Stopping the application does not discard
it, and restarting does not require another installation. The setup also leaves the native CEDAR
development workflow intact; you simply cannot run native and Docker copies on the same ports at
the same time.

This is a realistic local CEDAR environment, not a one-container demo and not yet a production
deployment recipe. It asks Docker Desktop to run the full application, so the first download and
start take some time. CEDAR publishes the complete, tested image set to Nexus as an immutable build
train. The command-line tool selects the latest verified train and Docker downloads any images that
are not already on your computer.

The next pages walk through the setup in the order you need it: prepare the machine, install the
small CEDAR command-line helper, provide local configuration, create certificates, and then start
the application. Building from source remains available as a separate developer path.

# Before You Begin

This installation runs the whole CEDAR application on one computer. A development laptop can do
that comfortably, but Docker needs enough room for several databases and Java services to remain
running together. Give Docker Desktop at least 12 GB of memory and make sure it has at least 20 GB
of free disk space. Half of the host's CPU cores is a reasonable starting point.

The current setup has been verified on an Apple Silicon Mac. A recent Docker Desktop release with
Compose v2 is the practical requirement. Other Docker Desktop platforms may work, but the complete
installation has not recently been exercised on them.

You will also need Git, Python 3, and OpenSSL. Git retrieves the CEDAR support repositories, Python
runs the CEDAR command-line helper, and OpenSSL creates certificates that your browser can trust.
The installation downloads source and packaged application artifacts from GitHub, Nexus, and the
registries that supply the underlying Docker images, so it needs normal internet access during the
initial build.

You do not need a Java development environment for the normal Docker path. The image builder
uses already-published Java artifacts from Nexus. JDK 17 and the complete Java source tree matter
only if you deliberately choose to rebuild the backend from source.

Finally, make sure another CEDAR installation is not already running. Native CEDAR and Docker CEDAR
both use the same local web and database ports. If you have used the native development stack,
stop it before continuing.

CEDAR will use local addresses ending in `metadatacenter.orgx`—the final `x` is intentional. A
setup command later in the guide adds those names to your hosts file; there is no public DNS or
external deployment involved.

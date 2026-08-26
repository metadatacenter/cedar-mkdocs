# cedarcli Manual

CEDAR is made up of many repositories and applications that must be built and run together.
`cedarcli` provides one command-line interface for that work. It keeps common tasks consistent and
understands the order and grouping that CEDAR requires.

The CLI works with familiar tools rather than replacing them. Git still manages source, Maven and
npm still build artifacts, and Docker still runs containers. `cedarcli` coordinates those tools at
the level of the complete CEDAR system.

## Before You Begin

This manual assumes that `cedarcli` is installed. If it is not, follow the
[cedarcli installation steps](../../install-docker/cli-and-scripts.md) in the Docker installation
guide.

## How the Manual Is Organized

The manual follows the path a change takes through CEDAR.

First, [Working Across Git Repositories](repositories.md) explains how to keep the source estate on
the intended branches and identify repositories that need attention. [Maven](maven.md) and
[Building CEDAR](building.md) then explain how source becomes usable local artifacts.

[Publishing Artifacts and Build Trains](publishing.md) covers the point at which artifacts leave one
machine and become shared inputs for other developers and deployments.

Finally, [Selecting a Deployment Mode](modes.md) introduces the three ways to run CEDAR. The
[native](native.md), [hybrid](hybrid.md), and [Docker](docker.md) chapters show the normal workflow
for each mode. A short [Other Command Groups](other-commands.md) page covers the less frequently used
release, inspection, certificate, and deployment helpers.

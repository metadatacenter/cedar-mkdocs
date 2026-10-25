# Prepare the Development Mac

A native CEDAR installation uses software installed directly on the Mac. `cedarcli` will build and
operate CEDAR, but it does not install Java, Node.js, databases, or the web server.

Homebrew is the supported package manager for this guide. This matters because CEDAR's native
service scripts use Homebrew to start and stop several infrastructure services.

## Install Homebrew

Install Homebrew from [brew.sh](https://brew.sh/) if it is not already available, then bring its
package information up to date:

```bash
brew update
```

## Install the Build Tools

The backend requires JDK 17 and Maven. The frontends require Node.js, npm, and the Gulp CLI
launcher for the retained AngularJS application. Angular projects install their own CLI through
their lockfiles. OpenSSL is used to create the local certificate authority.

```bash
brew install openjdk@17 maven node@24 openssl@3
```

Homebrew may ask you to register JDK 17 with macOS. If `/usr/libexec/java_home -v 17` cannot find it,
run:

```bash
sudo ln -sfn "$(brew --prefix openjdk@17)/libexec/openjdk.jdk" \
  /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

Add the keg-only Node.js and OpenSSL installations to your shell path:

```bash
export PATH="$(brew --prefix node@24)/bin:$(brew --prefix openssl@3)/bin:$PATH"
npm install --global gulp-cli
```

Add that export to your normal shell profile so that native frontend and certificate commands use
the same tools in new terminals.

The modern frontends use Angular 22. The reactor installs each project's exact CLI and build tools;
you do not need a global Angular CLI or a manual Angular upgrade step.

## Node Versions

Use **Node 24.22.1** throughout the frontend reactor, including the retained AngularJS application,
the modern Angular applications, components, model library and consumer demos. CI and the CLI's
toolchain check use this exact security-patched version. Angular 22 accepts
`^22.22.3 || ^24.15.0 || >=26`; Node 20 cannot build it.

If Node 24 is already installed through Homebrew, update it and verify the binary:

```bash
brew update
brew upgrade node@24
node --version  # must print v24.22.1
```

`cedarcli` selects a supported installed toolchain automatically; it does not install Node. If
Homebrew offers a different patch version, use an exact Node installation instead. For example,
with an existing `nvm` installation:

```bash
cd "$CEDAR_HOME/cedar-embeddable-editor"
nvm install     # installs the version in .nvmrc
nvm use
```

## Verify the Toolchain

Confirm that the tools are available before continuing:

```bash
/usr/libexec/java_home -v 17
mvn --version
node --version
npm --version
gulp --version
openssl version
```

JDK 17 must be installed even if another Java release is your shell default. `cedarcli` selects JDK
17 for native CEDAR commands. For direct Java commands, including the one-time Neo4j and Keycloak
setup later in this guide, select it in that shell too:

```bash
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
export PATH="$JAVA_HOME/bin:$PATH"
```

The infrastructure software is installed later, when the guide explains how each data service is
configured. Continue with [Configure the Native Installation](configuration.md).

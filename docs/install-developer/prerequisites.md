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

The backend requires JDK 17 and Maven. The frontends require Node.js, npm, Gulp CLI, and Angular
CLI. OpenSSL is used to create the local certificate authority.

```bash
brew install openjdk@17 maven node@20 openssl@3
```

Homebrew may ask you to register JDK 17 with macOS. If `/usr/libexec/java_home -v 17` cannot find it,
run:

```bash
sudo ln -sfn "$(brew --prefix openjdk@17)/libexec/openjdk.jdk" \
  /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

Add the keg-only Node.js and OpenSSL installations to your shell path:

```bash
export PATH="$(brew --prefix node@20)/bin:$(brew --prefix openssl@3)/bin:$PATH"
npm install --global gulp-cli @angular/cli@14
```

Add that export to your normal shell profile so that native frontend and certificate commands use
the same tools in new terminals.

## Verify the Toolchain

Confirm that the tools are available before continuing:

```bash
/usr/libexec/java_home -v 17
mvn --version
node --version
npm --version
gulp --version
ng version
openssl version
```

JDK 17 must be installed even if another Java release is your shell default. `cedarcli` selects JDK
17 for native CEDAR commands.

The infrastructure software is installed later, when the guide explains how each data service is
configured. Continue with [Configure the Native Installation](configuration.md).

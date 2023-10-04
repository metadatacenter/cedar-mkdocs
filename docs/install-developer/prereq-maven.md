# Maven

You will need `Maven` to build CEDAR.

## Install Maven

```sh
brew install maven
```

## Verify Maven

After the installation, please verify the version in a shell: 
```sh
mvn --version
```

You should see something like:
```
Apache Maven 3.9.4 (dfbb324ad4a7c8fb0bf182e6d91b0ae20e3d2dd9)
Maven home: /opt/homebrew/Cellar/maven/3.9.4/libexec
Java version: 17.0.8, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "14.0", arch: "aarch64", family: "mac"
```

## Configure CEDAR Nexus server

```sh
mkdir ~/.m2
cp -r ${CEDAR_HOME}/cedar-development/os-mirror/development-macos/Users/cedar-dev/.m2/settings.xml \
~/.m2/settings.xml
```

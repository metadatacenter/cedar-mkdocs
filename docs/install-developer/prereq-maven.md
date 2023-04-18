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
Apache Maven 3.9.1 (2e178502fcdbffc201671fb2537d0cb4b4cc58f8)
Maven home: /opt/homebrew/Cellar/maven/3.9.1/libexec
Java version: 17.0.4.1, vendor: Amazon.com Inc., runtime: /Users/cedar-dev/Library/Java/JavaVirtualMachines/corretto-17.0.4.1/Contents/Home
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "13.2.1", arch: "aarch64", family: "mac"
```
It is fine if `maven` uses `openjdk` as seen above. 

## Configure CEDAR Nexus server

```sh
mkdir ~/.m2
cp -r ${CEDAR_HOME}/cedar-development/os-mirror/development-macos/Users/cedar-dev/.m2/settings.xml \
~/.m2/settings.xml
```

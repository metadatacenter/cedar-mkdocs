# JDK 11

The version of Neo4j that we are using currently requires JDK 11 to execute.

???+ warning "Important"
    
    Please note, that a JDK is needed to configure and run CEDAR based on this guide. A JRE will not be enough.
    
## Install JDK 11

```sh
brew install openjdk@11
```

## Verify JDK

After the installation, please verify the version in a shell: 
```sh
export JAVA_HOME=$(brew --prefix)/opt/openjdk@11
java --version
echo
unset JAVA_HOME
java --version
```

You should see something similar:
```
openjdk 11.0.16.1 2022-08-12
OpenJDK Runtime Environment Homebrew (build 11.0.16.1+0)
OpenJDK 64-Bit Server VM Homebrew (build 11.0.16.1+0, mixed mode)

java 19.0.1 2022-10-18
Java(TM) SE Runtime Environment (build 19.0.1+10-21)
Java HotSpot(TM) 64-Bit Server VM (build 19.0.1+10-21, mixed mode, sharing)
```

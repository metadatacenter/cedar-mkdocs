# JDK

You most probably already have `jdk` on your system.
The CEDAR developer team uses `Oracle JDK 19`, and we strongly suggest that you use the same, for compatibility reasons.

???+ warning "Important"
    
    Please note, that a JDK is needed to configure and run CEDAR based on this guide. A JRE will not be enough.
    
    We strongly suggest to use the `macOS Installer` version available at Oracle's download site.

## Download JDK

Please download the latest available version of `JDK 19` from:

[https://www.oracle.com/java/technologies/downloads/#jdk19-mac](https://www.oracle.com/java/technologies/downloads/#jdk19-mac)

You will need to log in to be able to download the JDK.

## Install JDK

Install the downloaded package.

## Verify JDK

After the installation, please verify the version in a shell: 
```sh
java --version
```

You should see something similar:
```
java 19 2022-09-20
Java(TM) SE Runtime Environment (build 19+36-2238)
Java HotSpot(TM) 64-Bit Server VM (build 19+36-2238, mixed mode, sharing)
```

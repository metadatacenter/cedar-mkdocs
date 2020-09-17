# JDK

You most probably already have `jdk` on your system.
The CEDAR developer team uses `Oracle JDK 11`, and we strongly suggest that you use the same, for compatibility reasons.

???+ warning "Important"
    
    Please note, that a JDK is needed to configure and run CEDAR based on this guide. A JRE will not be enough.
    
    We strongly suggest to use the `macOS Installer` version available at Oracle's download site.

## Download JDK

Please download the latest available version of `JDK 11` from:

[https://www.oracle.com/java/technologies/javase-jdk11-downloads.html](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)

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
java 11.0.8 2020-07-14 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.8+10-LTS)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.8+10-LTS, mixed mode)
```


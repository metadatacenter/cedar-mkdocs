# JDK

You most probably already have `jdk` on your system.
The CEDAR developer team uses `Oracle JDK 17`, and we strongly suggest that you use the same, for compatibility reasons.

???+ warning "Important"
    
    Please note, that a JDK is needed to configure and run CEDAR based on this guide. A JRE will not be enough.

## Install JDK 17

Please download and install the latest Oracle JDK 17 (17.0.8 at the time of writing) from:
[https://www.oracle.com/java/technologies/downloads/#java17](https://www.oracle.com/java/technologies/downloads/#java17)

## Verify the installation

After the installation, please verify the version in a shell:
```sh
java --version
```

You should see something similar:
```
java 17.0.8 2023-07-18 LTS
Java(TM) SE Runtime Environment (build 17.0.8+9-LTS-211)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.8+9-LTS-211, mixed mode, sharing)
```

## About+ `JAVA_HOME`

Do not explicitly set `JAVA_HOME` at this time, we will set it in the next step using `jenv`

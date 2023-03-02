# JDK

You most probably already have `jdk` on your system.
The CEDAR developer team uses `Open JDK 17`, and we strongly suggest that you use the same, for compatibility reasons.

???+ warning "Important"
    
    Please note, that a JDK is needed to configure and run CEDAR based on this guide. A JRE will not be enough.

## Install JDK 17

```sh
brew install openjdk@17
```

## Set JAVA_HOME
You should add this line into your ```.zshrc```

```sh
export JAVA_HOME=`/usr/libexec/java_home -v 17`
```

Verify that your ```JAVA_HOME``` is set properly:
```sh
echo $JAVA_HOME
```

You should see something similar:

```
~/Library/Java/JavaVirtualMachines/corretto-17.0.4.1/Contents/Home
```

## Verify the installation

After the installation, please verify the version in a shell:
```sh
java --version
```

You should see something similar:
```
openjdk 17.0.4.1 2022-08-12 LTS
OpenJDK Runtime Environment Corretto-17.0.4.9.1 (build 17.0.4.1+9-LTS)
OpenJDK 64-Bit Server VM Corretto-17.0.4.9.1 (build 17.0.4.1+9-LTS, mixed mode, sharing)
```


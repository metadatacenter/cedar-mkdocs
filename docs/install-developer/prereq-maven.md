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
Apache Maven 3.8.7 (b89d5959fcde851dcb1c8946a785a163f14e1e29)
Maven home: /opt/homebrew/Cellar/maven/3.8.7/libexec
Java version: 17.0.4.1, vendor: Amazon.com Inc., runtime: ~/Library/Java/JavaVirtualMachines/corretto-17.0.4.1/Contents/Home
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "13.2", arch: "aarch64", family: "mac"
```

It is fine if `maven` uses `openjdk` as seen above. 

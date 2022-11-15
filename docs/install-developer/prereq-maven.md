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
Apache Maven 3.8.6 (84538c9988a25aec085021c365c560670ad80f63)
Maven home: /opt/homebrew/Cellar/maven/3.8.6/libexec
Java version: 19, vendor: Homebrew, runtime: /opt/homebrew/Cellar/openjdk/19/libexec/openjdk.jdk/Contents/Home
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "13.0.1", arch: "aarch64", family: "mac"
```

It is fine if `maven` uses `openjdk` as seen above. 

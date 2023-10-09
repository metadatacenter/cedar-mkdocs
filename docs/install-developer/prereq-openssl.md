# OpenSSL

Please install `openssl` on your system. 

```sh
brew install openssl@1.1
```

Then pin this version:

```sh
brew pin openssl@1.1
```

Note that a LibreSSL-based version of `openssl` is typically pre-installed on macOS. 
We do not want to use this version since it may have issues dealing with environment variables in the `openssl` configuration files.
To make sure that the Homebrew-installed version is used instead of the pre-installed version, add the following line to your `bash profile` or the equivalent. (`vi ~/.zshrc`)


```sh
export PATH=$(brew --prefix)/opt/openssl@1.1/bin:$PATH
```

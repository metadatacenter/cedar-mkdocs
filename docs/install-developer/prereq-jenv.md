# Jenv

In order to manage the multiple JDKs that you might have on your system, and to also properly set `JAVA_HOME`, we strongly suggest that you install the `jenv` utility.

## Install Jenv

```sh
brew install jenv
```

## Modify your bash profile

```sh
vi ~/.zshrc
```

Add these lines:

```sh
export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"
```

## Configure Jenv

Open a new shell, so the init command will be executed
Register all the JDKs that you might have on your system into `jenv`:

```sh
jenv add /Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home/
...
```

Set your global JDK version:

```sh
jenv global 17.0
```

Enable the `export` plugin:

```sh
jenv enable-plugin export
```

## Verify `JAVA_HOME`

Open a new shell so your recent changes will be taken into account.
Run this:

```sh
echo $JAVA_HOME
ls -ls $(echo $JAVA_HOME)
```

You should see something similar to:
```
/Users/cedar-dev/.jenv/versions/17.0
/Users/cedar-dev/.jenv/versions/17.0 -> /Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
```

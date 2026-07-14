# Prerequisites

## CEDAR User

???+ warning "Important"
    
    The current guide assumes that you created a dedicated user `cedar-dev` to follow these steps.

    It is totally fine if you proceed with your regular user. However, please replace your current username wherever you see `cedar-dev` throughout this guide. 
    The primary place where you will need to make this change is the configuration files for `nginx`.

## macOS

Please update your OS to the latest version, and please install all the available updates.

## Homebrew
You will need `brew` to install some components.

### Install Homebrew
If you do not have it yet, please install `brew` following their guide at [https://brew.sh/](https://brew.sh/)

Or you can do this:

```sh
/bin/bash -c \
  "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

???+ warning "Important"
    
    If you run into problems during installation of packages with `brew`, please read the Fix Homebrew section below

### Update Homebrew
If you had `brew` installed previously, please update it using:

```sh
brew update
```

### Upgrade brewed components
If you have software installed using `brew`, please upgrade them to their latest version.

???+ warning "Important"
    
    **This is an important step, do not skip this!**
    
    Because of package dependencies, this is actually a very important step. Please **really** do not skip this. We spent several hours debugging services not starting up. These issues were later fixed by a simple `brew upgrade` command. 

If you need to pin down versions of components, do that before upgrading:

```sh
brew pin <formula>
```

Finally upgrade the packages:

```sh
brew upgrade 
```

### Intel vs Apple Silicon
Homebrew changed its install prefix on Apple Silicon from `/usr/local` to `/opt/homebrew`.
We are using `$(brew --prefix)` to get the current prefix throughout this guide.

???+ warning "Important"

    **Prefer `$(brew --prefix)` over hardcoded paths if possible!**
    
    If you have path-related errors while you install or run the application, please double check wether you are using the correct brew prefix or not.

    Use `$(brew --prefix)` whenever this is possible.

## Fix Homebrew

Before you move forward, you should really make sure that your `brew` is in good shape.
 
You can prevent issues with `brew install` later by making everything right at this moment.

With an incorrect setup you could also run into a situation, when an installation goes fine, 
but executing a command will fail for some obscure reason (i.e. an incorrect symlink).

???+ warning "Important"

    Please take your time, and try to fix every warning that `brew doctor` mentions.
    
    Although these are just warnings, we found that they can cause issues later.
    
### Brew doctor, cleanup

Use these commands to see what is not correct with brew. You might need to fix these "by hand"
```sh
brew doctor
```

You can also let `brew` to try to fix things:
```sh
brew cleanup
```

### Common warnings

This is a non-exhaustive set of warnings from `brew doctor` output that you should fix before moving on: 

```
Warning: Unbrewed dylibs were found in /usr/local/lib.

Warning: Unbrewed static libraries were found in /usr/local/lib.

Warning: Unbrewed .pc files were found in /usr/local/lib/pkgconfig.

Warning: You have unlinked kegs in your Cellar.

Warning: Unbrewed header files were found in /usr/local/include.
```

### Common solutions

These are some commands that you can use to fix these issues. Here `cedar-dev` is your current username:

```sh
sudo chown -R cedar-dev $(brew --prefix)/Homebrew/

sudo chown -R cedar-dev $(brew --prefix)/Cellar/

sudo chown -R cedar-dev $(brew --prefix)/share

sudo chown -R cedar-dev $(brew --prefix)/lib

sudo chown -R cedar-dev $(brew --prefix)/Frameworks/Python.framework

brew link --overwrite python@3.8
```

## Wget

In case you don't have `wget` on your system, install it using:

```sh
brew install wget
```

## OpenSSL

Please install `openssl` on your system. 

```sh
brew install openssl@3
```

Then pin this version:

```sh
brew pin openssl@1.1
```

Note that a LibreSSL-based version of `openssl` is typically pre-installed on macOS. 
We do not want to use this version since it may have issues dealing with environment variables in the `openssl` configuration files.
To make sure that the Homebrew-installed version is used instead of the pre-installed version, add the following line to your `bash profile` or the equivalent. (`vi ~/.zshrc`)


```sh
export PATH=$(brew --prefix)/opt/openssl@3/bin:$PATH
```

## iTerm2, oh-my-zsh, powerlevel10k

Although it is not a must, for a smooth development experience we strongly recommend that you install:

* `iTerm2`
* `oh-my-zsh`
* `powerlevel10k`

### Install `iTerm2`

```sh
brew install --cask iterm2
```

### Choose a color preset for `iTerm2`

You can choose a color prest from *Preferences => Profiles => Colors => Color Presets*.

Please be aware that some color presets might flatten some colors that the `cedarcli` utility renders.
This leads to some degree of information loss during the usage of the tool (installed in a later step).

A suitable preset for the full experience would be 'Dark Background' or 'Light Background'.

### Install `oh-my-zsh`

Follow the guide at: [https://ohmyz.sh/#install](https://ohmyz.sh/#install) 

TLDR:
```sh
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

### Install `Powerlevel10k`

Follow the guide at: [https://github.com/romkatv/powerlevel10k](https://github.com/romkatv/powerlevel10k)

TLDR:
```sh
brew install powerlevel10k
echo "source $(brew --prefix)/share/powerlevel10k/powerlevel10k.zsh-theme" >>~/.zshrc
```

### Configure `p10k` 

```sh
p10k configure
```

## JDK

You most probably already have `jdk` on your system.
The CEDAR developer team uses `Oracle JDK 17`, and we strongly suggest that you use the same, for compatibility reasons.

???+ warning "Important"
    
    Please note, that a JDK is needed to configure and run CEDAR based on this guide. A JRE will not be enough.

### Install JDK 17

Please download and install the latest Oracle JDK 17 (17.0.13 at the time of writing) from:
[https://oracle.com/java/technologies/downloads/#java17-mac](https://oracle.com/java/technologies/downloads/#java17-mac)

### Verify the installation

After the installation, please verify the version in a shell:
```sh
java --version
```

You should see something similar:
```
java 17.0.13 2024-10-15 LTS
Java(TM) SE Runtime Environment (build 17.0.13+10-LTS-268)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.13+10-LTS-268, mixed mode, sharing)
```

### About `JAVA_HOME`

Do not explicitly set `JAVA_HOME` at this time, we will set it below using `jenv`

## Jenv

In order to manage the multiple JDKs that you might have on your system, and to also properly set `JAVA_HOME`, we strongly suggest that you install the `jenv` utility.

### Install Jenv

```sh
brew install jenv
```

### Modify your bash profile

```sh
vi ~/.zshrc
```

Add these lines:

```sh
export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"
```

### Configure Jenv

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

### Verify `JAVA_HOME`

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

## Maven

You will need `Maven` to build CEDAR.

### Install Maven

```sh
brew install maven
```

### Verify Maven

After the installation, please verify the version in a shell: 
```sh
mvn --version
```

You should see something like:
```
Apache Maven 3.9.9 (8e8579a9e76f7d015ee5ec7bfcdc97d260186937)
Maven home: /opt/homebrew/Cellar/maven/3.9.9/libexec
Java version: 17.0.13, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "15.2", arch: "aarch64", family: "mac"
```

## Python

Some of the frontend tools and the `cedar-cli` will require `python`. This will be also needed if one wishes to work on the `readthedocs` MkDocs.

???+ warning "Important"
    
    We strongly suggest installing Anaconda, this will fulfill all the requirements towards Python.
    
### Install `Anaconda` using `brew`

```sh
brew install --cask anaconda
```

### Verify Python

After the installation, please verify the version in a shell: 
```sh
python --version
```

You should see something similar:
```
Python 3.11.5
```

### Upgrade conda

```sh
conda update conda
```

### Init conda

```sh
conda init zsh
```

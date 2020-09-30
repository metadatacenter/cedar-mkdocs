# Homebrew
You will need `brew` to install some components.

## Install Homebrew
If you do not have it yet, please install `brew` following their guide at [https://brew.sh/](https://brew.sh/)

Or you can do this:

```sh
/bin/bash -c \
  "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

???+ warning "Important"
    
    If you run into problems during installation of packages with `brew`, please read our next section: [Fix Homebrew](./prereq-homebrew-fix.md)

## Update Homebrew
If you had `brew` installed previously, please update it using:

```sh
brew update
```

## Upgrade brewed components
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

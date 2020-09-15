# Homebrew
You will need `brew` to install some components.

## Install Homebrew
If you do not have it yet, please install it following their guide at [https://brew.sh/](https://brew.sh/)

Or you can do this:

    /bin/bash -c \
    "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

If you run into problems during installing services with `brew`, remember that you can use these commands to try to debug issues:

    brew doctor
    brew cleanup

## Update Homebrew
If you had `brew` installed previously, please update it using:

    brew update

## Upgrade brewed components
If you have software installed using `brew`, please upgrade them to their latest version.

**This is an important step, do not skip this!**

If you need to pin down versions of components, do that before upgrading:

    brew pin <formula>
    brew upgrade 
# Frontend Components

## Overview

The CEDAR frontend was developed in `AngularJS` and `Angular`.

On a development machine you will run local servers to compile and serve the code.
The frontend servers are - as all the components of the system - proxied by `nginx`.

You will need the following components to run and develop the frontend:

* Node.js
* npm
* gulp
* Agular CLI

## Install Node.js

Please install `Node`, version 20 LTS:

```sh
brew install node@20
```

And pin this version:

```sh
brew pin node@20
```

### Add `node` and `npm` to `PATH`

The first lines of confirmation will contain something similar:

```
node@20 is keg-only, which means it was not symlinked into /opt/homebrew,
because this is an alternate version of another formula.

If you need to have node@20 first in your PATH, run:
  echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
```

Please execute the suggested command to add the node `bin` directory to the `PATH` (this line can be different based in your shell):

```sh
echo 'export PATH="$(brew --prefix)/opt/node@20/bin:$PATH"' >> ~/.zshrc
```

### Check the installation

Close the previously active terminal (or source your profile) to have `node` and `npm` in your `PATH`.

`Node.js` will come with `npm` as well.
You can check if both of them are installed:
 
```sh
node --version
npm --version
```

You should see something like the following:

```
v20.18.1
10.8.2
```

## Install Gulp and Angular CLI

### Install `gulp`

Please install the latest `Gulp`, make it available globally:

```sh
npm -g install gulp
```

### Install `Angular CLI`

Please install the latest `Angular CLI`, make it available globally:

```sh
npm install -g @angular/cli@14
```

## Launch main frontend

You will need to install the dependencies for the frontend before the first run,
and every time you add or change a dependency.

### Install dependencies

```sh
goeditor
npm install
``` 

### Start the main frontend

```sh
goeditor
gulp
```

### Stop the main frontend

If you need to stop the frontend, you can do this by pressing ++ctrl++ + C.

## Launch OpenView frontend

You will need to install the dependencies for the frontend before the first run,
and every time you add or change a dependency.

### Install dependencies

```sh
goopenfront
npm install --legacy-peer-deps
``` 

### Start the OpenView frontend

```sh
goopenfront
ng serve
```

### Stop the OpenView frontend

If you need to stop the frontend, you can do this by pressing ++ctrl++ + C.

## Launch Monitoring frontend

You will need to install the dependencies for the frontend before the first run,
and every time you add or change a dependency.

### Install dependencies

```sh
gomonitoring
npm install --legacy-peer-deps
``` 

### Start the Monitoring frontend

```sh
gomonitoring
ng serve
```

### Stop the Monitoring frontend

If you need to stop the frontend, you can do this by pressing ++ctrl++ + C.

## Launch Artifacts frontend

You will need to install the dependencies for the frontend before the first run,
and every time you add or change a dependency.

### Install dependencies

```sh
goartifacts
npm install --legacy-peer-deps
``` 

### Start the Artifacts frontend

```sh
goartifacts
ng serve
```

### Stop the Artifacts frontend

If you need to stop the frontend, you can do this by pressing ++ctrl++ + C.

## Launch Bridging frontend

You will need to install the dependencies for the frontend before the first run,
and every time you add or change a dependency.

### Install dependencies

```sh
gobridging
npm install --legacy-peer-deps
``` 

### Start the Bridging frontend

```sh
gobridging
ng serve
```

### Stop the Bridging frontend

If you need to stop the frontend, you can do this by pressing ++ctrl++ + C.

## Launch Content frontend

You will need to install the dependencies for the frontend before the first run,
and every time you add or change a dependency.

### Install dependencies

```sh
gocontent
npm install --legacy-peer-deps
``` 

### Start the Content frontend

```sh
gocontent
ng serve
```

### Stop the Content frontend

If you need to stop the frontend, you can do this by pressing ++ctrl++ + C.

## Logging in to CEDAR

In a web browser, go to the following URL:

```
https://cedar.metadatacenter.orgx
```

You should be presented with the CEDAR login page.

Two test users are provided initially. These are `test1@test.com` and `test2@test.com`, with passwords `test1` and `test2`, respectively.

Log in using these users and verify that you can create CEDAR artifacts.

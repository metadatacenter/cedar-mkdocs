# Install Node.js

Please install `Node.js, version 12.18.*LTS`:

```sh
brew install node@12
```

## Add `node` and `npm` to `PATH`

The first lines of confirmation will contain something similar:

```
node@12 is keg-only, which means it was not symlinked into /usr/local,
because this is an alternate version of another formula.

If you need to have node@12 first in your PATH run:
  echo 'export PATH="/usr/local/opt/node@12/bin:$PATH"' >> ~/.zshrc
```

Please execute the suggested command to add the node `bin` directory to the `PATH` (this line can be different based in your shell):

```sh
echo 'export PATH="/usr/local/opt/node@12/bin:$PATH"' >> ~/.zshrc
```

## Check the installation

Close the previously active terminal (or source your profile) to have `node` and `npm` in your `PATH`.

`Node.js` will come with `npm` as well.
You can check if both of them are installed:
 
```sh
node --version
npm --version
```

You should see the following:

```
v12.18.4
6.14.6
```

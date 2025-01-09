# Install Node.js

Please install `Node`, version 20 LTS:

```sh
brew install node@20
```

And pin this version:

```sh
brew pin node@20
```

## Add `node` and `npm` to `PATH`

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

## Check the installation

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

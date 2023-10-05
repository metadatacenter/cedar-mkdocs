# Python

Some of the frontend tools and the `cedar-cli` will require `python`. This will be also needed if one wishes to work on the `readthedocs` MkDocs.

???+ warning "Important"
    
    We strongly suggest installing Anaconda, this will fulfill all the requirements towards Python.
    
## Install `Anaconda` using `brew`

```sh
brew install --cask anaconda
```

## Verify Python

After the installation, please verify the version in a shell: 
```sh
python --version
```

You should see something similar:
```
Python 3.11.5
```

## Upgrade conda

```sh
conda update conda
```

## Init conda

```sh
conda init zsh
```

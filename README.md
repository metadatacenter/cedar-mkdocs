# MkDocs for CEDAR

## Conda environment 
### Install Conda
Use the guide at: https://docs.conda.io/

To install Anaconda, you can go directly to: https://www.anaconda.com/products/individual/get-started 

Install Anaconda, close all your terminals and start a new one.

### Create Conda environment to run MkDocs
    conda env create -f ./environment.yml

### Activate Conda environment
    conda activate cedar-mkdocs

### Deactivate Conda environment
    conda deactivate
    
### Remove Conda environment

    conda env remove --name cedar-mkdocs

## MKDocs Material

MkDocs-Material will be installed from conda-forge when creating the environment. 

The documentation can be found at: https://squidfunk.github.io/mkdocs-material/
 
## MkDocs
Please read the full documentation at: https://www.mkdocs.org/

### Start built-in dev server
    mkdocs serve
    
You can see the content served by this dev server at http://localhost:8000/ 

### Build the documentation
    mkdocs build

### Build clean documentation
    mkdocs build --clean

### Markdown extension syntax

https://facelessuser.github.io/pymdown-extensions/extensions/superfences/

https://python-markdown.github.io/extensions/
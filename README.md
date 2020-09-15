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

## MKDocs Material

    pip install mkdocs-material

or 

    git clone https://github.com/squidfunk/mkdocs-material.git

and the copy content into mkdocs-material subfolder

## MkDocs
Please read the full documentation at [www.mkdocs.org](https://www.mkdocs.org/)

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
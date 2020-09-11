# MkDocs for CEDAR

## Conda environment 
### Create Conda environment to run MkDocs
    conda env create -f ./environment.yml

### Activate Conda environment
    conda activate cedar-mkdocs

### Deactivate Conda environment
    conda deactivate

## MkDocs
Please read the full documentation at [www.mkdocs.org](https://www.mkdocs.org/)

### Start built-in dev server
    mkdocs serve

### Build the documentation
    mkdocs build

### Build clean documentation
    mkdocs build --clean

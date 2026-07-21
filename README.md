# MkDocs for CEDAR

## Setup

You can set up the build environment either with a plain Python virtual environment (`pip`) or with
Conda. The `pip` approach is the simplest and does not require installing Conda.

## Python virtual environment (pip)

Requires Python 3 (any recent version). The pinned dependencies live in `requirements.txt`.

### Create the virtual environment

    python3 -m venv .venv

### Activate it and install the dependencies

    source .venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt

Once activated, `mkdocs` is on your `PATH` and the commands under
[MkDocs](#mkdocs) below work directly. Run `deactivate` to leave the environment.

If you prefer not to activate it, you can call the tools directly, e.g. `.venv/bin/mkdocs serve`.
The `.venv/` directory is git-ignored.

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

## Regenerating tutorial screenshots

The screenshots in the CEDAR Tutorial and CEDAR Controlled Term Tutorial are
generated, not captured by hand, by a Playwright step-driver that walks the live
CEDAR Workbench. It lives in [`runner/`](runner/) and writes straight into
`docs/tutorials/img/` and `docs/tutorials/term-img/`. This is local authoring
tooling (Node/Playwright); it never runs during a Read the Docs build. See
[`runner/README.md`](runner/README.md) for setup and usage.
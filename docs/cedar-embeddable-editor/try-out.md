# Try CEDAR Embeddable Editor

Follow the below steps to try CEDAR Embeddable Editor

The steps below were tested on a MacOS, but should run o any other system with slight modifications

```sh

# Create a directory to hold the sample code
cd
mkdir CEE
cd CEE

# Clone the repos
git clone --branch release-2.6.31 https://github.com/metadatacenter/cedar-cee-demo
git clone --branch release-2.6.31 https://github.com/metadatacenter/cedar-component-distribution

# Install Node.Js 16 using your preferred method
brew install node@16

# Install angular for the demo applications
npm install -g @angular/cli

# Install dependencies, and run the content distribution
# This will serve the latest version of the embeddable editor
cd ~/CEE/cedar-component-distribution/
npm install
ng serve

# In a new shell
# Install dependencies, and run the demo app and the docs app
cd ~/CEE/cedar-cee-demo/cedar-cee-demo-angular-src/
npm install
ng serve

# In a new shell
cd ~/CEE/cedar-cee-demo/cedar-cee-docs-angular-src/
npm install
ng serve

```

After these steps you will have:

* the demo app running at: [http://localhost:4260](http://localhost:4260)
* the docs app at [http://localhost:4280](http://localhost:4280) 

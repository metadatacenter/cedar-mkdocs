# Build CEDAR project

## Build the project

```sh
goproject
mcit
```

The above is a shorthand for the following, full version:
 
```sh
cd ${CEDAR_HOME}/cedar-project
mvn clean install -DskipTests=true
```

???+ warning "Important"
    
    You can see that we are building the project by skipping the tests at this point.
   
    Running the tests is the preferred way of building, however at this point the underlying infrastructure is not ready, so the tests would definitely fail.

    Because of this, we will skip the tests this time.  
    

# cloud-developer
This is for course 3 - Refactor Udagram app into microservices.  Screenshots are in the screenshots directory in master branch.

# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](/udacity-c3-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. 
2. [The RestAPI Feed Backend](/udacity-c3-restapi-feed), a Node-Express feed microservice.
3. [The RestAPI User Backend](/udacity-c3-restapi-user), a Node-Express user microservice.

### Installing Node and NPM
This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (NPM is included) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

### Installing Ionic Cli
The Ionic Command Line Interface is required to serve and build the frontend. Instructions for installing the CLI can be found in the [Ionic Framework Docs](https://ionicframework.com/docs/installation/cli).

### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of this repository. After cloning, open your terminal and run:
```bash
npm install
```
>_tip_: **npm i** is shorthand for **npm install**

### Setup Backend Node Environment
You'll need to create a new node server. Open a new terminal within the project directory and run:
1. Initialize a new project: `npm init`
2. Install express: `npm i express --save`
3. Install typescript dependencies: `npm i ts-node-dev tslint typescript  @types/bluebird @types/express @types/node --save-dev`
4. Look at the `package.json` file from the RestAPI repo and copy the `scripts` block into the auto-generated `package.json` in this project. This will allow you to use shorthand commands like `npm run dev`

### Configure The Backend Endpoint
Ionic uses enviornment files located in `./src/enviornments/enviornment.*.ts` to load configuration variables at runtime. By default `environment.ts` is used for development and `enviornment.prod.ts` is used for produciton. The `apiHost` variable should be set to your server url either locally or in the cloud.

***
### Running the Development Server
Ionic CLI provides an easy to use development server to run and autoreload the frontend. This allows you to make quick changes and see them in real time in your browser. To run the development server, open terminal and run:

```bash
ionic serve
```

### Building the Static Frontend Files
Ionic CLI can build the frontend into static HTML/CSS/JavaScript files. These files can be uploaded to a host to be consumed by users on the web. Build artifacts are located in `./www`. To build from source, open terminal and run:
```bash
ionic build
```

### Build and deploy to Docker environment
Next step is to test the applications in Docker.  Ensure `docker-compose` is installed and go to `udacity-c3-deployment/docker` directory.

First, edit the docker-compose-build.yaml file and edit the image line to point to your docker hub.  Then, edit the docker-compose.yaml with your docker hub images.

Next, run the following commands:
1. Build the images: `docker-compose -f docker-compose-build.yaml build --parallel`
2. Push the images: `docker-compose -f docker-compose-build.yaml push`
3. Run the containers: `docker-compose up`

This will build, push, and run the 3 docker images (frontend, restapi-feed, restapi-user).  Perform your testing.

To stop testing, run `docker-compose down`.

### Build and deploy to Kubernetes environment
Navigate to `udacity-c3-deployment/k8s` directory.  Ensure you already have a kubernetes environment setup.  Look at all the .yaml files and modify the images to point to your docker hub.

There is a script called `deploy.sh` that is already prepared and will roll out the docker images to a kubernetes cluster.  Run the following commands:
1. `deploy.sh`
2. Open a new terminal.  Run `kubectl port-forward svc/frontend 8100:8100`.
3. Open another new terminal.  Run `kubectl port-forward svc/reverseproxy 8080:8080`

This will deploy the kubernetes cluster.  To scale the cluster, run `kubectl scale --replicas=X deployment/<frontend,feed,user>`, where X= number of containers to run.

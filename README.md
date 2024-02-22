# ng-stickysession
This is a project for testing nginx sticky session. It builds an nginx-plus image using Docker and can be run on macOS machines.

## Prerequisites
You need to subscribe to nginx-plus to obtain:
1. nginx-repo.crt
2. nginx-repo.key
Place these two files in the project's root directory.

You need to have Node.js installed on your computer.
## Installation and Running
### Nginx-Plus
In the project's root directory, use the docker command to build the image:
```
docker build -t ng-stickysession .
```
After the execution is complete, start the nginx service locally. Once successful, you can access localhost:8080 to verify if nginx is started correctly.

```
docker run -p 8080:8080 -v ./nginx/nginx.conf:/etc/nginx/nginx.conf -d ng-stickysession
```
### Start SSE Server
First, we need to install the project dependencies:
```
npm i
```
After the execution is complete, start the SSE server:

```
npm run start
```

At this point, Node.js will listen on both local ports 3000 and 4000, providing the same SSE connection service.

### Verify Sticky Session
You can access localhost:8080 to verify the sticky session. Click the button and you will always trigger and receive message from specific node app, and you can clear the src_id cookie via Chrome devtool, then you may connect to another SSE service.
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

<img width="691" alt="image" src="https://github.com/yuhao-tubi/ng-stickysession/assets/141899175/12636b4c-d187-4580-be19-183817cd791c">


https://github.com/yuhao-tubi/ng-stickysession/assets/141899175/26b6a4ef-6c2d-4d90-b0ef-bc2ca5a91961


### Verify server shutdown and recovery
A good question thanks to @Chun that what if the sticky target upstream server shutdown or restart, what would happen for stickied user or the SSE connection on the target server.

I added some error proxy rule to nginx.conf:
```
proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
```

After having these rules, if a server was shutdown, the subsequent requests would be transfer to another availiable upstream server with a new cookie key assigned, so the user client would stick to a new upstream server.The ongoing SSE connection would also be redirected.

You can use the server files under `server-shutdown` to verify it like the following video example:

https://github.com/yuhao-tubi/ng-stickysession/assets/141899175/4b409fde-ee02-4c6c-b201-80e28a7c888d


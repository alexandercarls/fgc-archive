# FGC-Archive

Consists of the old Node.JS TypeScript Backend and old README snippets:
- Koa Web API
- Models
- Worker Process for sending mails (via Redis)

Other snapshots of dependencies like `db` and `docker-compose`-files have been added to start the process.

## Run tests
Runs linting, test for models, api and worker layer in `node-multi`
```shell
npm test
```

## Information
The Node.js app consists of two stateless processes. The state is stored in a database.

1. Web-API

    exposes data for the client
1. Worker-Mail

    handles sending e-mails

We still got one application with one dependency management in `package.json`, but we have managed to split it into multiple, independent processes. Each of them can be started and scaled individually, without influencing the other parts. You can achieve this without sacrificing your DRY codebase, because parts of the code, like the models, can be shared between the different processes.

Having only one `package.json` has its own ups and downs.
For example, the `nodemailer` dependency is surely not needed in our web API. However, the size of the container in a server environment is not an issue.
We can still easily refactor it if we decide to create a separate node.js app or use a different technology for that part because we split the concerns as mentioned above.

We end up with one docker image, which can work as either the web API or the [worker process](https://12factor.net/concurrency)
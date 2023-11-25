import ('dotenv/config');
import express from "express";
import actorRouter from "./routes/actor.route.js";
import filmRouter from "./routes/film.route.js";
import loggerRouter from "./routes/logger.route.js";
import authRouter from "./routes/auth.route.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import logger from "./middlewares/logger.mdw.js";
import options from "./utils/swagger/options.js";
import cors from "cors";

// rabbitMQ import
// import newTask from './utils/rabbitMQ/new_task.js';
import worker from './utils/rabbitMQ/publisher.js';

import asyncError from "express-async-errors";

// gRPC import
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
const packageDefinition = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;

// specify swagger
const specs = swaggerJSDoc(options);

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send(`Server is running`);
});

app.use(express.json());
app.use(cors());
// Custom middleware for logging requests and responses
app.use(logger);
app.use("/api/actors", actorRouter);
app.use("/api/films", filmRouter);
app.use("/api/logs", loggerRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/api/auth", authRouter);

// apply gRPC to server with demo is todoList
const server = new grpc.Server();
server.bindAsync(
    "localhost:40000", 
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        console.log(`Server gRPC is running at 127.0.0.1:${port}`);
        server.start();
    }
);

const todos = [];

server.addService(todoPackage.Todo.service, {
    createTodo: (call, callback) => {
        const todoItem = {
            "id": todos.length + 1,
            "text": call.request.text 
        }
        todos.push(todoItem);
        callback(null, todoItem);
    },
    readTodo: (_, callback) => {
        callback(null, {"items": todos})
    },
})

worker();


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

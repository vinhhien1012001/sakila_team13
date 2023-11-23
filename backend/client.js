import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync("./todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];

const client = new todoPackage.Todo(
    "localhost:40000",
    grpc.credentials.createInsecure()
);

client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {
    console.log("Received from server " + JSON.stringify(response));
})

client.readTodo({}, (err, response) => {
    console.log("Read data from server: ", response);
    response.items.forEach(i => console.log(i.text));
})
import express from "express";
import actorRouter from "./routes/actor.route.js";
import filmRouter from "./routes/film.route.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import logger from './utils/logger.js';
import asyncError from 'express-async-errors';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);

const app = express();
const PORT = process.env.PORT || 3000;

// Custom middleware for logging requests and responses
app.use((req, res, next) => {
    // Log the request data
    logger.info(`Request - Method: ${req.method}, URL: ${req.url}`);

    // Log the request body (if it's a POST request)
    if (req.method === 'POST' || req.method === 'PUT') {
        logger.debug('Request Body:', req.body);
    }

    res.on('finish', () => {
        // Log the response data
        logger.info(`Response - Status: ${res.statusCode}`);
    });

    next();
});


app.get("/", (req, res) => {
  res.send(`Server is running`);
});

app.use(express.json());
app.use("/api/actors", actorRouter);
app.use("/api/films", filmRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
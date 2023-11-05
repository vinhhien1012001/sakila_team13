import express from "express";
import actorRouter from "./routes/actor.route.js";
import filmRouter from "./routes/film.route.js";
import loggerRouter from "./routes/logger.route.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import logger from './middlewares/logger.mdw.js';
import searchLog from './utils/logger/searchLog.js';
import options from './utils/swagger/options.js';
import cors from 'cors';
import asyncError from 'express-async-errors';


const specs = swaggerJSDoc(options);

const app = express();
const PORT = process.env.PORT || 3000;


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

// searchLog for debug
searchLog();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
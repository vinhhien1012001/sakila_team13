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
import userModel from "./models/user.model.js";
import cors from "cors";
import jwt from 'jsonwebtoken';
import asyncError from "express-async-errors";

const specs = swaggerJSDoc(options);

const app = express();
const PORT = process.env.PORT || 3002;

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

/** 
 * demo refresh Token
*/
let refreshTokens = [];

app.delete('/logout', (req, res) => {
    // check if the current refreshToken is not the origin refreshToken
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

app.post('/token', (req, res) => {
    // get the origin refreshToken from the api
    const refreshToken = req.body.token;
    if(!refreshToken) return res.sendStatus(401).json({error: "Invalid token"});

    // check if refreshToken is not in the list
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403).json({error: "Token is not exist"});

    // verify refreshToken to generate new accessToken
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403).json({error: "Access denied!"});
        const accessToken = generateAccessToken({username: user.username});
        res.json({accessToken: accessToken});
    })
 
})

app.post('/login', async (req, res) => {
    // get the info from login
    const { username, password } = req. body;
    const user = await userModel.findOne({ username, password });

    // generate accesToken and refreshToken for user
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    
    // add new refreshToken to list
    refreshTokens.push(refreshToken);

    res.json({accessToken: accessToken, refreshToken: refreshToken})
})


function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m'});
}


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from "express";
import loggerModel from "../models/logger.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const list = await loggerModel.findAll();
    res.json(list);
});

export default router;
import express from "express";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST endpoint for user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match in the database (query your MySQL database here)
  const user = await userModel.findOne({ username, password });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Assuming you use JWT for token generation
  const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.json({ accessToken });
});

// router.get("/:id", async (req, res) => {
//     const id = req.params.id || 0;
//     const actor = await actorModel.findById(id);
//     if (actor === null) return res.status(204).end();
//     res.json(actor);
//   });

export default router;

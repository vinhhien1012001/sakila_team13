import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const accessToken = req.headers["authorization"];

  if (!accessToken) {
    return res.status(401).json({ error: "Access denied!" });
  }

  // Verify the token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

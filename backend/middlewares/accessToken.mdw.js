import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const accessToken = req.headers["authorization"];
  console.log("accessToken: ", accessToken);

  if (!accessToken) {
    return res.status(401).json({ error: "Access token is missing!" });
  }

  // Verify the token
  jwt.verify(accessToken, "accessToken123", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.log(err);
    req.user = decoded;
    next();
  });
}

import logger from "../utils/logger/logger.js";

export default function (req, res, next) {
  // Set up an event handler for each request
  res.on("finish", () => {
    // Log the response data
    if (res.statusCode >= 400) {
      logger.error(
        `Response - Status: ${res.statusCode} - ${req.method}: ${req.originalUrl}`
      );
    } else {
      logger.info(
        `Response - Status: ${res.statusCode} - ${req.method}: ${req.originalUrl}`
      );
    }
  });

  next();
}

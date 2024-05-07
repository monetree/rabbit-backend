const logger = require("./logger");

require("dotenv").config();


const handleErrorResponse = (res, error) => {
  logger.error({
    message: `An error occurred ${error.message}`,
    error: error,
  });
  return res.status(500).json({ error: "Internal server error" });
};

const sendErrorResponse = (res, message, statusCode = 400) => {
  logger.error({
    message: `An error occurred ${message}`,
  });
  return res.status(statusCode).json({ error: message });
};

module.exports = {
  handleErrorResponse,
  sendErrorResponse,
};

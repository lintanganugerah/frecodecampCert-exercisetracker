require("dotenv").config();
module.exports = {
  config: {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
    dbName: process.env.DB_NAME || "exercise-track",
    mongoConnectionTimeout: process.env.MONGO_CONNECTION_TIMEOUT_MS || 10000,
  },
};

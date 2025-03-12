const mongoose = require("mongoose");
const { config } = require("../config/config");

const connectDb = mongoose.connect(config.mongoURI, {
  dbName: config.dbName,
  connectTimeoutMS: 10000,
});

module.exports = connectDb;

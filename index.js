const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "public/images" });
const { config } = require("./config/config");
const { connectDb } = require("./database/connection");
require("dotenv").config();

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "*",
  })
);
app.options("*", cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(upload.none());

const router = require("./routes/_routes");
app.use(router);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

const listener = app.listen(config.port || 3000, () => {
  connectDb;
  console.log(
    "Your app is listening on " +
      "address " +
      listener.address().port +
      " port " +
      listener.address().port
  );
});

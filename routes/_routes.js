const express = require("express");
const router = express.Router();
const route = require("./exercise");

router.use("/api", route);

module.exports = router;

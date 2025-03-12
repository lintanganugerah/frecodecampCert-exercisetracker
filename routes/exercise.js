const express = require("express");
const User = require("../models/userSchema");
const { config } = require("../config/config");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/users", async (req, res) => {
  try {
    const body = req.body;
    if (!body.username) {
      return res.status(400).send({
        success: false,
        message: "Username Not Found in Request",
      });
    }
    const newUser = await User.create(body);
    return res.status(200).send({
      _id: newUser._id,
      username: newUser.username,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("-__v -log -updatedAt -createdAt -date -description -duration")
      .lean();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
router.get("/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const user = await User.findById(_id).select("-__v -_id").lean();
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }
  let logs = user.log;
  if (from) {
    logs = logs.filter((log) => log.date >= new Date(from));
  }
  if (to) {
    logs = logs.filter((log) => log.date <= new Date(to));
  }
  if (limit) {
    logs = logs.slice(0, limit);
  }
  return res.status(200).send({
    _id: user._id,
    username: user.username,
    count: logs.length,
    log: logs.map((log) => ({
      description: log.description,
      duration: log.duration,
      date: log.date.toDateString(),
    })),
  });
});
router.post("/users/:_id/exercises", async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return res.status(400).send({
        success: false,
        message: "User ID is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid User ID",
      });
    }
    const { description, duration, date } = req.body;
    if (!description || !duration) {
      return res.status(400).send({
        success: false,
        message: "Description and Duration are required",
      });
    }
    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const exerciseDate = date && Date.parse(date) ? new Date(date) : new Date();

    user.log.push({ description, duration, date: exerciseDate });
    Object.assign(user, { description, duration, date: exerciseDate });

    await user.save();
    console.log(user);
    return res.status(200).send({
      username: user.username,
      description: user.description,
      duration: user.duration,
      date: user.date.toUTCString(),
      _id: user._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});
// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: "Internal Server Error",
  });
});

module.exports = router;

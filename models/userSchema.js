const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
    },
    date: {
      type: Date,
    },
    log: [
      {
        description: {
          type: String,
        },
        duration: {
          type: Number,
        },
        date: {
          type: Date,
        },
      },
    ],
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);

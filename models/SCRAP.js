const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SCRAPSchema = new Schema(
  {
    person: {},
    posts: [],
    comments: [],
    createAt: {type: Date}
  },
  {
    timestamps: true,
  }
);

const SCRAP = mongoose.model("NewList", SCRAPSchema);

module.exports = SCRAP;

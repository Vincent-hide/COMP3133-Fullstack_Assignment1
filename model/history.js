const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let historySchema = new Schema({
  sender: { type: String },
  date: { type: String },
  room: { type: String },
  message: { type: String },
});

module.exports = mongoose.model("History", historySchema);

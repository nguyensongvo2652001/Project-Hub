const mongoose = require("mongoose");

const demoSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

const Demo = mongoose.model("Demo", demoSchema);

module.exports = Demo;

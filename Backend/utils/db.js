const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to database!");
  } catch (error) {
    console.log("Error connecting to database:", error);
  }
};

module.exports = { connectDB };

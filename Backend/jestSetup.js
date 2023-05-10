const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { connectDB } = require("./utils/db");

process.env.NODE_ENV = "TEST";
dotenv.config({ path: `./env/main.env` });

global.beforeEach(async () => {
  const mongod = await MongoMemoryServer.create();
  const testMongoUri = mongod.getUri();
  await connectDB(testMongoUri);
});

global.afterEach(async () => {
  await mongoose.connection.close();
});

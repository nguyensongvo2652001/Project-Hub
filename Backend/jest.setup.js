const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { connectDB } = require("./utils/db");
const User = require("./models/user");

const currentNodeEnv = process.env.NODE_ENV;

global.beforeAll(async () => {
  process.env.NODE_ENV = "TEST";
  dotenv.config({ path: `./env/main.env` });
});

global.afterAll(() => {
  process.env.NODE_ENV = currentNodeEnv;
});

global.beforeEach(async () => {
  const mongod = await MongoMemoryServer.create();
  const testMongoUri = mongod.getUri();
  await connectDB(testMongoUri);
});

global.afterEach(async () => {
  await mongoose.connection.close();
});

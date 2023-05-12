const User = require("../models/user");
const ProjectMember = require("../models/projectMember");

const dotenv = require("dotenv");
const { connectDB } = require("./db");
const Project = require("../models/project");
const Task = require("../models/task");
dotenv.config({ path: "../env/main.env" });

const createDummyData = async () => {
  let uri = process.env.DB_STRING;
  uri = uri.replace(/<password>/, process.env.DB_PASSWORD);
  uri = uri.replace(/<databaseName>/, process.env.DB_NAME);
  await connectDB(uri);

  const user1 = await User.findOne({ email: "user1@example.com" });
  const user2 = await User.findOne({ email: "user2@example.com" });
  const projectId = "645c37b6de64ba77f21d11f5";

  await Task.create({
    projectId,
    creator: user1._id,
    name: "testing task 1",
    type: "feature",
    developers: [user1._id, user2._id],
    dateCreated: "2022-05-01",
    status: "testing",
  });

  await Task.create({
    projectId,
    creator: user1._id,
    name: "testing task 2",
    type: "feature",
    developers: [user1._id],
    dateCreated: "2022-05-01",
    status: "testing",
  });

  await Task.create({
    projectId,
    creator: user1._id,
    name: "doing task 1",
    type: "feature",
    developers: [user2._id],
    dateCreated: "2022-05-01",
    status: "doing",
  });

  await Task.create({
    projectId,
    creator: user1._id,
    name: "open task 2",
    type: "feature",
    developers: [user1._id],
    dateCreated: "2022-05-01",
    status: "open",
  });

  await Task.create({
    projectId,
    creator: user1._id,
    name: "overdue task 1",
    type: "feature",
    developers: [user2._id],
    dateCreated: "2022-05-01",
    status: "overdue",
  });

  await Task.create({
    projectId,
    creator: user1._id,
    name: "overdue task 2",
    type: "feature",
    developers: [user2._id, user1._id],
    dateCreated: "2022-05-01",
    status: "overdue",
  });
};
(async () => {
  await createDummyData();
})();

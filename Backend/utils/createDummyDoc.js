const User = require("../models/user");
const ProjectMember = require("../models/projectMember");

const dotenv = require("dotenv");
const { connectDB } = require("./db");
const Project = require("../models/project");
dotenv.config({ path: "../env/main.env" });

const createDummyData = async () => {
  let uri = process.env.DB_STRING;
  uri = uri.replace(/<password>/, process.env.DB_PASSWORD);
  uri = uri.replace(/<databaseName>/, process.env.DB_NAME);
  await connectDB(uri);

  const user1 = await User.create({
    email: "user1@example.com",
    password: "someThing2605!",
  });
  const project = await Project.create({
    name: "project",
    tag: "Website",
    owner: user1._id,
  });
  const user2 = await User.create({
    email: "user2@example.com",
    password: "someThing2605!",
  });
  await ProjectMember.create({
    projectId: project._id,
    memberId: user2._id,
  });
};

createDummyData();

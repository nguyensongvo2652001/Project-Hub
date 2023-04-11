const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const {
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
} = require("./utils/auth");
const User = require("../models/user");
const ProjectMember = require("../models/projectMember");
const Project = require("../models/project");

describe("Test get project route", () => {
  let agent,
    getProjectRoute,
    user,
    user2,
    user3,
    password,
    privateProject,
    publicProject;
  beforeEach(async () => {
    agent = request.agent(app);
    getProjectRoute = `${process.env.BASE_V1_API_ROUTE}/project`;
    loginRoute = `${process.env.BASE_V1_API_ROUTE}/auth/login`;
    password = "someThing2605!";
    user = await User.create({
      email: "user@example.com",
      password,
    });
    user2 = await User.create({
      email: "user2@example.com",
      password,
    });
    user3 = await User.create({
      email: "user3@example.com",
      password,
    });
    privateProject = await Project.create({
      name: "project",
      tag: "Mobile",
      owner: user._id,
      status: "private",
    });
    publicProject = await Project.create({
      name: "project",
      tag: "Mobile",
      owner: user._id,
      status: "public",
    });
    await ProjectMember.create({
      projectId: privateProject._id,
      memberId: user3._id,
      status: "pending",
      role: "developer",
    });
    await ProjectMember.create({
      projectId: publicProject._id,
      memberId: user3._id,
      status: "pending",
      role: "developer",
    });
  });

  it("should fail if user not logged in", async function () {
    await testShouldFailIfUserNotLoggedIn(agent, getProjectRoute, async () => {
      await agent.get(`${getProjectRoute}/${publicProject._id}`);
    });
  });

  it("should return status code 400 if the project id is invalid", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const res = await agent
      .get(`${getProjectRoute}/123`)
      .set("Cookie", cookie)
      .expect(400);
  });

  it("should return status code 404 if the server can not find the project in database based the provided id", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const randomId = new mongoose.Types.ObjectId();
    const res = await agent
      .get(`${getProjectRoute}/${randomId}`)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("should return status code 404 if the project status is private and the logged in user is not a member of the project", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user2.email,
      password,
    });

    const res = await agent
      .get(`${getProjectRoute}/${privateProject._id}`)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("should return status code 200 if the project status is private and the logged in user is a member of the project", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const res = await agent
      .get(`${getProjectRoute}/${privateProject._id}`)
      .set("Cookie", cookie)
      .expect(200);

    const { project } = res.body.data;
    const actualMembers = await ProjectMember.find({
      projectId: privateProject._id,
      status: "done",
    });
    const allMembers = await ProjectMember.find({
      projectId: privateProject._id,
    });

    expect(project.numberOfMembers).toEqual(actualMembers.length);
    expect(project.numberOfMembers).not.toEqual(allMembers.length);
    expect(project.owner.name).toBeDefined();
  });

  it("should return status code 200 if the project status is public", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user2.email,
      password,
    });

    const res = await agent
      .get(`${getProjectRoute}/${publicProject._id}`)
      .set("Cookie", cookie)
      .expect(200);

    const { project } = res.body.data;
    const actualMembers = await ProjectMember.find({
      projectId: publicProject._id,
      status: "done",
    });
    const allMembers = await ProjectMember.find({
      projectId: publicProject._id,
    });

    expect(project.numberOfMembers).toEqual(actualMembers.length);
    expect(project.numberOfMembers).not.toEqual(allMembers.length);
    expect(project.owner.name).toBeDefined();
  });
});

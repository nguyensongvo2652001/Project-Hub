const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const {
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
} = require("./utils/auth");
const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");

describe("Test get all tasks from project route", () => {
  let agent, getAllTasksRoute, password, owner1, owner2, project1, project2;
  beforeEach(async () => {
    agent = request.agent(app);

    loginRoute = `${process.env.BASE_V1_API_ROUTE}/auth/login`;
    password = "someThing2605!";

    owner1 = await User.create({ email: "owner1@example.com", password });
    owner2 = await User.create({ email: "owner2@example.com", password });

    project1 = await Project.create({
      name: "project 1",
      tag: "Mobile",
      owner: owner1._id,
      status: "public",
    });
    project2 = await Project.create({
      name: "project 2",
      tag: "Mobile",
      owner: owner2._id,
      status: "public",
    });

    await Task.create({
      name: "task 1",
      type: "feature",
      projectId: project1._id,
      creator: owner1._id,
      developers: [owner1._id],
    });

    await Task.create({
      name: "task 2",
      type: "feature",
      projectId: project1._id,
      creator: owner1._id,
      developers: [owner1._id],
    });

    await Task.create({
      name: "task 3",
      type: "feature",
      projectId: project2._id,
      creator: owner2._id,
      developers: [owner2._id],
    });

    getAllTasksRoute = `${process.env.BASE_V1_API_ROUTE}/project`;
  });

  it("should fail if user not logged in", async function () {
    const route = `${getAllTasksRoute}/${project1._id}/task`;
    await testShouldFailIfUserNotLoggedIn(agent, route, async () => {
      await agent.get(route);
    });
  });

  it("should fail if user is not member of project", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner1.email,
      password,
    });

    const randomId = new mongoose.Types.ObjectId();
    const res = await agent
      .get(`${getAllTasksRoute}/${project2._id}/task`)
      .set("Cookie", cookie)
      .expect(400);
  });

  it("should fail if the project is not found", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner1.email,
      password,
    });

    const randomId = new mongoose.Types.ObjectId();
    const res = await agent
      .get(`${getAllTasksRoute}/${randomId}/task`)
      .set("Cookie", cookie)
      .expect(400);
  });

  it("should fail if the project id is invalid", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner1.email,
      password,
    });

    const res = await agent
      .get(`${getAllTasksRoute}/123/task`)
      .set("Cookie", cookie)
      .expect(400);
  });

  it("should return all tasks from project 1 only", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner1.email,
      password,
    });

    const res = await agent
      .get(`${getAllTasksRoute}/${project1._id}/task`)
      .set("Cookie", cookie)
      .expect(200);

    const { data } = res.body;
    expect(data.length).toEqual(2);
  });

  it("should return only 1 task", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner1.email,
      password,
    });

    const res = await agent
      .get(`${getAllTasksRoute}/${project1._id}/task?limit=1`)
      .set("Cookie", cookie)
      .expect(200);

    const { data } = res.body;
    expect(data.length).toEqual(1);
  });
});

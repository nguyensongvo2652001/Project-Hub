const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../../env/main.env" });
const app = require("../../app");
const { getLoginCookie } = require("../utils/auth");
const User = require("../../models/user");
const Project = require("../../models/project");
const ProjectMember = require("../../models/projectMember");
const Task = require("../../models/task");

describe("Test update task route", () => {
  let agent,
    updateTaskRoute,
    owner,
    developer,
    developer2,
    nonMember,
    loginRoute,
    rawPassword,
    task,
    project,
    developerMembership;
  beforeEach(async () => {
    agent = request.agent(app);
    updateTaskRoute = `${process.env.BASE_V1_API_ROUTE}/task`;
    loginRoute = `${process.env.BASE_V1_API_ROUTE}/auth/login`;
    rawPassword = "someThing2605!";
    nonMember = await User.create({
      email: "nonMember@example.com",
      password: rawPassword,
    });
    owner = await User.create({
      email: "owner@example.com",
      password: rawPassword,
    });
    developer = await User.create({
      email: "developer@example.com",
      password: rawPassword,
    });
    developer2 = await User.create({
      email: "developer2@example.com",
      password: rawPassword,
    });
    project = await Project.create({
      name: "project",
      owner: owner._id,
    });
    developerMembership = await ProjectMember.create({
      projectId: project._id,
      memberId: developer._id,
      role: "developer",
    });
    developerMembership = await ProjectMember.create({
      projectId: project._id,
      memberId: developer2._id,
      role: "developer",
    });
    task = await Task.create({
      name: "task name",
      type: "feature",
      developers: [developer._id],
      creator: developer._id,
      projectId: project._id,
    });
  }, 15000);

  it("should fail if user is not logged in", async function () {
    const fullUpdateTaskRoute = `${updateTaskRoute}/123`;
    await agent.patch(fullUpdateTaskRoute).expect(401);
  });
  it("should fail if task id is invalid", async function () {
    const loginCookie = await getLoginCookie(app, loginRoute, {
      email: nonMember.email,
      password: rawPassword,
    });

    const fullUpdateTaskRoute = `${updateTaskRoute}/123`;

    await agent
      .patch(fullUpdateTaskRoute)
      .set("Cookie", loginCookie)
      .expect(400);
  }, 10000);
  it("should fail if task is not found", async function () {
    const loginCookie = await getLoginCookie(app, loginRoute, {
      email: nonMember.email,
      password: rawPassword,
    });

    const randomId = new mongoose.Types.ObjectId();
    const fullUpdateTaskRoute = `${updateTaskRoute}/${randomId}`;

    await agent
      .patch(fullUpdateTaskRoute)
      .set("Cookie", loginCookie)
      .expect(404);
  }, 10000);

  it("should fail if user is not member of the project that the task belongs", async () => {
    const loginCookie = await getLoginCookie(app, loginRoute, {
      email: nonMember.email,
      password: rawPassword,
    });

    const taskId = task._id;
    const fullUpdateTaskRoute = `${updateTaskRoute}/${taskId}`;

    const res = await agent
      .patch(fullUpdateTaskRoute)
      .send({
        startDate: Date.now(),
      })
      .set("Cookie", loginCookie)
      .expect(403);
  });

  it("should fail if user is not admin or manager or creator of the task", async () => {
    const loginCookie = await getLoginCookie(app, loginRoute, {
      email: developer2.email,
      password: rawPassword,
    });

    const taskId = task._id;
    const fullUpdateTaskRoute = `${updateTaskRoute}/${taskId}`;

    const res = await agent
      .patch(fullUpdateTaskRoute)
      .send({
        startDate: Date.now(),
      })
      .set("Cookie", loginCookie)
      .expect(403);
  });

  it("should be successful if the user is not the admin or owner but the creator of the task", async () => {
    const loginCookie = await getLoginCookie(app, loginRoute, {
      email: developer.email,
      password: rawPassword,
    });

    const taskId = task._id;
    const fullUpdateTaskRoute = `${updateTaskRoute}/${taskId}`;

    const res = await agent
      .patch(fullUpdateTaskRoute)
      .send({
        startDate: Date.now(),
      })
      .set("Cookie", loginCookie)
      .expect(200);
  }, 10000);
});

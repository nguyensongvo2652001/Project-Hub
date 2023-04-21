const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const {
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
} = require("../utils/auth");
const User = require("../../models/user");
const Project = require("../../models/project");

describe("Test create new task route", () => {
  let agent, createTaskRoute, member, randomUser, password, project, randomDate;
  beforeEach(async () => {
    agent = request.agent(app);
    createTaskRoute = `${process.env.BASE_V1_API_ROUTE}/task`;
    loginRoute = `${process.env.BASE_V1_API_ROUTE}/auth/login`;
    password = "someThing2605!";
    member = await User.create({
      email: "member@example.com",
      password,
    });
    project = await Project.create({
      name: "test project",
      owner: member._id,
    });
    randomUser = await User.create({
      email: "randomUser@example.com",
      password,
    });
    randomDate = new Date();
  });

  it("should fail if user not logged in", async function () {
    await testShouldFailIfUserNotLoggedIn(agent, createTaskRoute);
  });
  it("should fail if the project id is empty", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: "",
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the project id does not exist", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: new mongoose.Types.ObjectId(),
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the project id is not valid", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: "notarealid",
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should create the task successfully", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        name: "task",
        type: "bug",
        developers: [member._id],
      })
      .set("Cookie", cookie)
      .expect(201);
  });
  it("should fail if the creator is not a member of the project", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: randomUser.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        name: "task",
        type: "bug",
        developers: [member._id],
      })
      .set("Cookie", cookie)
      .expect(403);
  });
  it("should fail if the project name is empty", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        type: "bug",
        developers: [member._id],
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the project name is longer than 100 characters", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        type: "bug",
        name: "a".repeat(101),
        developers: [member._id],
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the field type is empty", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        name: "test",
        developers: [member._id],
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the type is not valid", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        name: "test",
        type: "not a real type",
        developers: [member._id],
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the description is longer than 250 characters", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        name: "task",
        type: "bug",
        developers: [member._id],
        description: "a".repeat(251),
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the developers list is empty", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        name: "task",
        type: "bug",
        developers: [],
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the developers list contains duplications", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        name: "task",
        type: "bug",
        developers: [member._id, member._id],
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the developers list contains non existing ids", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        name: "task",
        type: "bug",
        developers: [new mongoose.Types.ObjectId()],
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should fail if the developers list contains developers not in the project", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const res = await agent
      .post(createTaskRoute)
      .send({
        projectId: project._id,
        name: "task",
        type: "bug",
        developers: [randomUser._id],
      })
      .set("Cookie", cookie)
      .expect(400);
  });
});

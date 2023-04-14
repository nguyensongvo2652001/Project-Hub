const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const {
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
} = require("./utils/auth");
const User = require("../models/user");
const ProjectMember = require("../models/projectMember");

describe("Test create new project route", () => {
  let agent, createProjectRoute, user, password;
  beforeEach(async () => {
    agent = request.agent(app);
    createProjectRoute = `${process.env.BASE_V1_API_ROUTE}/project`;
    loginRoute = `${process.env.BASE_V1_API_ROUTE}/auth/login`;
    password = "someThing2605!";
    user = await User.create({
      email: "user@example.com",
      password,
    });
  });

  it("should fail if user not logged in", async function () {
    await testShouldFailIfUserNotLoggedIn(agent, createProjectRoute);
  });

  it("should fail if the project name is not provided", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const res = await agent
      .post(createProjectRoute)
      .send({
        name: "",
        tag: "Website",
      })
      .set("Cookie", cookie)
      .expect(400);
  });

  it("should fail if the project tag is not valid", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const res = await agent
      .post(createProjectRoute)
      .send({
        name: "Twitter clone",
        tag: "random",
      })
      .set("Cookie", cookie)
      .expect(400);
  });

  it("should fail if the project name is longer than 250 characters", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const res = await agent
      .post(createProjectRoute)
      .send({
        name: "a".repeat(251),
        tag: "Website",
      })
      .set("Cookie", cookie)
      .expect(400);
  });
  it("should create a new project successfully", async () => {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const projectName = "Twitter clone";
    const projectTag = "Website";
    const res = await agent
      .post(createProjectRoute)
      .send({
        name: projectName,
        tag: projectTag,
      })
      .set("Cookie", cookie)
      .expect(201);

    const { project } = res.body.data;
    expect(project.name).toEqual(projectName);
    expect(project.tag).toEqual(projectTag);
    expect(project.owner).toEqual(user._id.toString());

    const membership = await ProjectMember.findOne({
      projectId: project._id,
      memberId: user._id,
      role: "owner",
      status: "done",
    });

    expect(membership).not.toBeUndefined();
  });
});

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const {
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
} = require("./utils/auth");
const User = require("../models/user");
const Project = require("../models/project");

describe("Test get all joined projects route", () => {
  let agent, getJoinedProjectsRoute, user, user2, password, project1, project2;
  beforeEach(async () => {
    agent = request.agent(app);
    getJoinedProjectsRoute = `${process.env.BASE_V1_API_ROUTE}/me/project`;
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

    project1 = await Project.create({
      name: "project",
      tag: "Mobile",
      owner: user._id,
    });
    project2 = await Project.create({
      name: "project",
      tag: "Mobile",
      owner: user2._id,
    });
  });

  it("should fail if user not logged in", async function () {
    await testShouldFailIfUserNotLoggedIn(
      agent,
      getJoinedProjectsRoute,
      async () => {
        await agent.get(getJoinedProjectsRoute);
      }
    );
  });

  it("should return projects that user 1 joined only", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const res = await agent
      .get(getJoinedProjectsRoute)
      .set("Cookie", cookie)
      .expect(200);

    const { data } = res.body;
    expect(data.length).toEqual(1);
  });
});

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const {
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
} = require("./utils/auth");
const User = require("../models/user");
const Project = require("../models/project");
const ProjectMember = require("../models/projectMember");

describe("Test update project route", () => {
  let agent, updateProjectRoute, owner, member, randomUser, password, project;
  beforeEach(async () => {
    agent = request.agent(app);
    updateProjectRoute = `${process.env.BASE_V1_API_ROUTE}/project`;
    loginRoute = `${process.env.BASE_V1_API_ROUTE}/auth/login`;
    password = "someThing2605!";
    owner = await User.create({
      email: "owner@example.com",
      password,
    });
    member = await User.create({
      email: "member@example.com",
      password,
    });
    randomUser = await User.create({
      email: "randomUser@example.com",
      password,
    });
    project = await Project.create({
      name: "project",
      tag: "Mobile",
      owner: owner._id,
    });
    await ProjectMember.create({
      projectId: project._id,
      memberId: member._id,
    });
  });

  it("should fail if user not logged in", async function () {
    await testShouldFailIfUserNotLoggedIn(
      agent,
      `${updateProjectRoute}/${project._id}`,
      async () => {
        await agent.patch(`${updateProjectRoute}/${project._id}`);
      }
    );
  });

  it("should return status code 400 if the project id is invalid", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner.email,
      password,
    });

    const res = await agent
      .patch(`${updateProjectRoute}/123`)
      .set("Cookie", cookie)
      .expect(400);
  });

  it("should return status code 404 if the server can not find the project in database based the provided id", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner.email,
      password,
    });

    const randomId = new mongoose.Types.ObjectId();
    const res = await agent
      .patch(`${updateProjectRoute}/${randomId}`)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("should return status code 404 if the user is not a member of the project", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: randomUser.email,
      password,
    });

    const randomId = new mongoose.Types.ObjectId();
    const res = await agent
      .patch(`${updateProjectRoute}/${project._id}`)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("should return status code 403 if the user is a member but not the owner of the project", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: member.email,
      password,
    });

    const randomId = new mongoose.Types.ObjectId();
    const res = await agent
      .patch(`${updateProjectRoute}/${project._id}`)
      .set("Cookie", cookie)
      .expect(403);
  });

  it("should return status code 200 if updated successfully", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner.email,
      password,
    });

    const data = {
      status: "private",
      name: "new name",
      description: "new description",
    };

    const randomId = new mongoose.Types.ObjectId();
    const res = await agent
      .patch(`${updateProjectRoute}/${project._id}`)
      .send(data)
      .set("Cookie", cookie)
      .expect(200);

    const updatedProject = await Project.findById(project._id);

    expect(updatedProject.status).toEqual(data.status);
    expect(updatedProject.name).toEqual(data.name);
    expect(updatedProject.description).toEqual(data.description);
  });
});

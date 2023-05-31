const mongoose = require("mongoose");
const request = require("supertest");
const User = require("../../../models/user");
const Project = require("../../../models/project");
const ProjectMember = require("../../../models/projectMember");
const app = require("../../../app");
const {
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
} = require("../../utils/auth");

describe("Test invite member to project route", () => {
  let project,
    owner,
    developer,
    newMember,
    baseApiRoute,
    inviteMemberRoute,
    loginRoute;
  beforeEach(async () => {
    owner = await User.create({
      email: "admin@example.com",
      password: "someThing2605!",
    });

    project = await Project.create({
      name: "Test project",
      owner: owner._id,
    });

    developer = await User.create({
      email: "developer@example.com",
      password: "someThing2605!",
    });

    await ProjectMember.create({
      projectId: project._id,
      memberId: developer._id,
      role: "developer",
    });

    newMember = await User.create({
      email: "newMember@example.com",
      password: "someThing2605!",
    });

    baseApiRoute = process.env.BASE_V1_API_ROUTE;
    inviteMemberRoute = `${baseApiRoute}/projectMember/inviteMember`;
    loginRoute = `${baseApiRoute}/auth/login`;
  }, 10000);

  it("should fail if you are not logged in", async () => {
    await testShouldFailIfUserNotLoggedIn(
      request.agent(app),
      inviteMemberRoute
    );
  }, 10000);
  it("should fail if email and projectId are not defined", async () => {
    const agent = request.agent(app);

    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner.email,
      password: "someThing2605!",
    });

    await agent
      .post(inviteMemberRoute)
      .send({
        email: "",
        projectId: "",
      })
      .set("Cookie", cookie)
      .expect(400);
  }, 10000);
  it("should fail if there are no users with specified email", async () => {
    const agent = request.agent(app);

    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner.email,
      password: "someThing2605!",
    });

    await agent
      .post(inviteMemberRoute)
      .send({
        email: "nouserlikethis@example.com",
        projectId: project._id,
      })
      .set("Cookie", cookie)
      .expect(404);
  }, 10000);
  it("should fail if there are no projects with specified id", async () => {
    const agent = request.agent(app);

    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner.email,
      password: "someThing2605!",
    });

    const response = await agent
      .post(inviteMemberRoute)
      .send({
        email: newMember.email,
        projectId: new mongoose.Types.ObjectId(),
      })
      .set("Cookie", cookie)
      .expect(403);
  }, 10000);
  it("should fail if invited user is already in the project", async () => {
    const agent = request.agent(app);

    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner.email,
      password: "someThing2605!",
    });

    await agent
      .post(inviteMemberRoute)
      .send({
        email: developer.email,
        projectId: project._id,
      })
      .set("Cookie", cookie)
      .expect(400);
  }, 10000);

  it("should fail if current log in user is not admin or owner", async () => {
    const agent = request.agent(app);

    const cookie = await getLoginCookie(app, loginRoute, {
      email: developer.email,
      password: "someThing2605!",
    });

    const res = await agent
      .post(inviteMemberRoute)
      .send({
        email: newMember.email,
        projectId: project._id,
      })
      .set("Cookie", cookie)
      .expect(403);
  }, 10000);

  it("should be successful", async () => {
    const agent = request.agent(app);

    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner.email,
      password: "someThing2605!",
    });

    const res = await agent
      .post(inviteMemberRoute)
      .send({
        email: newMember.email,
        projectId: project._id,
      })
      .set("Cookie", cookie)
      .expect(200);

    const pendingMembership = await ProjectMember.findOne({
      memberId: newMember._id,
    });
    expect(pendingMembership).not.toBeUndefined();
    expect(pendingMembership.status).toBe("pending");
  }, 20000);
});

const mongoose = require("mongoose");
const request = require("supertest");
const User = require("../models/user");
const Project = require("../models/project");
const ProjectMember = require("../models/projectMember");
const app = require("../app");
const {
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
} = require("./utils/auth");

describe("Test invite member to project route", () => {
  let project,
    owner,
    newMember,
    newMemberMembership,
    baseApiRoute,
    baseConfirmMembershipRoute,
    trueInvitationToken,
    wrongInvitationToken;
  beforeEach(async () => {
    owner = await User.create({
      email: "admin@example.com",
      password: "someThing2605!",
    });

    project = await Project.create({
      name: "Test project",
      owner: owner._id,
    });

    newMember = await User.create({
      email: "newMember@example.com",
      password: "someThing2605!",
    });

    trueInvitationToken = "trueToken";
    wrongInvitationToken = "wrongToken";
    newMemberMembership = await ProjectMember.create({
      projectId: project._id,
      memberId: newMember._id,
      invitationToken: trueInvitationToken,
      status: "pending",
      role: "developer",
    });

    baseApiRoute = process.env.BASE_V1_API_ROUTE;
    baseConfirmMembershipRoute = `${baseApiRoute}/projectMember/confirmMembership`;
    loginRoute = `${baseApiRoute}/auth/login`;
  }, 10000);

  it("should fail if you are not logged in", async () => {
    const fullConfirmMembershipRoute = `${baseConfirmMembershipRoute}/${trueInvitationToken}`;
    const agent = request.agent(app);
    await testShouldFailIfUserNotLoggedIn(
      agent,
      fullConfirmMembershipRoute,
      async () => {
        await agent.patch(fullConfirmMembershipRoute);
      }
    );
  }, 10000);

  it("should fail when we can not find membership with the specified invitation token", async () => {
    const fullConfirmMembershipRoute = `${baseConfirmMembershipRoute}/${wrongInvitationToken}`;
    const cookie = await getLoginCookie(app, loginRoute, {
      email: newMember.email,
      password: "someThing2605!",
    });
    const agent = request.agent(app);
    await agent
      .patch(fullConfirmMembershipRoute)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("should fail when the invitation token does not belong to the logged in user", async () => {
    const fullConfirmMembershipRoute = `${baseConfirmMembershipRoute}/${trueInvitationToken}`;
    const cookie = await getLoginCookie(app, loginRoute, {
      email: owner.email,
      password: "someThing2605!",
    });
    const agent = request.agent(app);
    await agent
      .patch(fullConfirmMembershipRoute)
      .set("Cookie", cookie)
      .expect(403);
  });

  it("should confirm membership successfully", async () => {
    const fullConfirmMembershipRoute = `${baseConfirmMembershipRoute}/${trueInvitationToken}`;
    const cookie = await getLoginCookie(app, loginRoute, {
      email: newMember.email,
      password: "someThing2605!",
    });
    const agent = request.agent(app);
    await agent
      .patch(fullConfirmMembershipRoute)
      .set("Cookie", cookie)
      .expect(200);

    const updatedNewMemberMembership = await ProjectMember.findById(
      newMemberMembership._id
    );

    expect(updatedNewMemberMembership.invitationToken).toBeUndefined();
    expect(updatedNewMemberMembership.status).toBe("done");
  });
});

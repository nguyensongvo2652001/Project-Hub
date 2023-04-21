const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const {
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
} = require("../utils/auth");
const User = require("../../models/user");

describe("Test get user route", () => {
  let agent, getUserRoute, user;
  beforeEach(async () => {
    agent = request.agent(app);
    getUserRoute = `${process.env.BASE_V1_API_ROUTE}/user`;
    loginRoute = `${process.env.BASE_V1_API_ROUTE}/auth/login`;
    password = "someThing2605!";
    user = await User.create({
      email: "user@example.com",
      password,
    });
  });

  it("should fail if user not logged in", async function () {
    const route = `${getUserRoute}/123`;
    await testShouldFailIfUserNotLoggedIn(agent, route, async () => {
      await agent.get(route);
    });
  });

  it("should return status code 400 if the user id is invalid", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const res = await agent
      .get(`${getUserRoute}/123`)
      .set("Cookie", cookie)
      .expect(400);
  });

  it("should return status code 404 if server can not find user based on the provided id", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const randomId = new mongoose.Types.ObjectId();
    const res = await agent
      .get(`${getUserRoute}/${randomId}`)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("should return status code 200", async function () {
    const cookie = await getLoginCookie(app, loginRoute, {
      email: user.email,
      password,
    });

    const res = await agent
      .get(`${getUserRoute}/${user._id}`)
      .set("Cookie", cookie)
      .expect(200);

    const payloadUser = res.body.data.user;

    expect(payloadUser.password).not.toBeDefined();
  });
});

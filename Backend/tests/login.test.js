const cookie = require("cookie");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { testSendAuthResponse } = require("./utils/auth");

describe("Test login route", () => {
  it("should login successfully", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "someThing2605!",
    });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: "someThing2605!" })
      .expect(200);

    testSendAuthResponse(res);
  }, 10000);

  it("should fail to login", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "", password: "123456" })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("should fail to login", async () => {
    await User.create({
      email: "test@example.com",
      password: "someThing2605!",
    });
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "123456" })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  }, 10000);
});

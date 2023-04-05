const cookie = require("cookie");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { testSendAuthResponse } = require("./utils/auth");

describe("Test sign up route", () => {
  it("should create a new user successfully", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signUp")
      .send({ email: "test@example.com", password: "someThing2605!" })
      .expect(201);

    testSendAuthResponse(res);
  }, 10000);

  it("should fail to create a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signUp")
      .send({ email: "test", password: "123456" })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("should fail to create a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signUp")
      .send({ email: "", password: "haLsads123!" })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  }, 10000);

  it("should fail to create a new user", async () => {
    await request(app)
      .post("/api/v1/auth/signUp")
      .send({ email: "test@example.com", password: "someThing2605!" });

    const res = await request(app)
      .post("/api/v1/auth/signUp")
      .send({ email: "test@example.com", password: "someThing2605!" })
      .expect(409);

    expect(res.body).toHaveProperty("message");
  }, 10000);
});

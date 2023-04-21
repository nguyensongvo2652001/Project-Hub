const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");

describe("Test forgot password route", () => {
  const forgotPasswordRoute = "/api/v1/auth/forgotPassword";

  it("should return 404 if email address is not registered", async () => {
    const response = await request(app)
      .post(forgotPasswordRoute)
      .send({ email: "not_registered@example.com" });

    expect(response.statusCode).toBe(404);
  }, 10000);

  it("should send reset token to user's email", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "someThing2605!",
    });

    const response = await request(app)
      .post(forgotPasswordRoute)
      .send({ email: user.email });

    expect(response.statusCode).toBe(200);

    const updatedUser = await User.findOne({ email: user.email });
    expect(updatedUser.passwordResetToken).toBeDefined();
    expect(updatedUser.passwordResetExpires).toBeDefined();
  }, 15000);
});

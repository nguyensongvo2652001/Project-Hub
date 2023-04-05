const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { testSendAuthResponse } = require("./utils/auth");

describe("Test reset password route", () => {
  const rawPasswordResetToken = "validToken";
  const hashedPasswordResetToken = User.hashPasswordResetToken(
    rawPasswordResetToken
  );
  const resetPasswordRoute = "/api/v1/auth/resetPassword";

  it("should return 400 if password reset token has expired", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "someThing2605!",
      passwordResetToken: hashedPasswordResetToken,
      passwordResetExpires: Date.now() - 10 * 60 * 3600,
    });

    const response = await request(app)
      .patch(`${resetPasswordRoute}/${rawPasswordResetToken}`)
      .send({
        password: "newPassword",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "the password reset token has already expired"
    );
  });

  it("should return 404 if user not found with provided token", async () => {
    const response = await request(app)
      .patch(`${resetPasswordRoute}/randomPasswordResetToken`)
      .send({
        password: "newPassword",
      });

    expect(response.statusCode).toBe(404);
  });

  it("should reset user password and return 200 if password reset is successful", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "someThing2605!",
      passwordResetToken: hashedPasswordResetToken,
      passwordResetExpires: Date.now() + 10 * 60 * 3600,
    });

    const newPassword = "reallyStrongPassword!568";
    const response = await request(app)
      .patch(`${resetPasswordRoute}/${rawPasswordResetToken}`)
      .send({
        password: newPassword,
      });

    expect(response.statusCode).toBe(200);

    const updatedUser = await User.findById(user._id);

    const isCorrectPassword = await updatedUser.checkPassword(newPassword);
    expect(isCorrectPassword).toBeTruthy();

    expect(updatedUser.passwordResetToken).toBeUndefined();
    expect(updatedUser.passwordResetExpires).toBeUndefined();

    const startOfToday = new Date().setHours(0, 0, 0, 0);
    expect(updatedUser.passwordChangedAt.getTime()).toBeGreaterThan(
      startOfToday
    );

    testSendAuthResponse(response);
  });

  it("should return 400 if password is too weak", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "someThing2605!",
      passwordResetToken: hashedPasswordResetToken,
      passwordResetExpires: Date.now() + 10 * 60 * 3600,
    });

    const newPassword = "weakPassword";
    const response = await request(app)
      .patch(`${resetPasswordRoute}/${rawPasswordResetToken}`)
      .send({
        password: newPassword,
      });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if password is not provided", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "someThing2605!",
      passwordResetToken: hashedPasswordResetToken,
      passwordResetExpires: Date.now() + 10 * 60 * 3600,
    });

    const response = await request(app)
      .patch(`${resetPasswordRoute}/${rawPasswordResetToken}`)
      .send({
        password: "",
      });

    expect(response.statusCode).toBe(400);
  });
});

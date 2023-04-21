const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");

// We can only call jest.mock at the top-level, jest.doMock also does not work inside specific test so we have to come up with a workaround to put tests that require specific mockings to a seperated file.

jest.mock("../../utils/email", () => {
  const Email = jest.fn(() => ({
    sendPasswordReset: jest.fn().mockImplementation(() => {
      throw new Error("Failed to send email");
    }),
  }));
  return Email;
});

describe("Test forgot password route (send email fail)", () => {
  const forgotPasswordRoute = "/api/v1/auth/forgotPassword";

  it("should return 500 if there is an error sending the email", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "someThing2605!",
    });

    const response = await request(app)
      .post(forgotPasswordRoute)
      .send({ email: user.email });

    expect(response.statusCode).toBe(500);

    const updatedUser = await User.findOne({ email: user.email });
    expect(updatedUser.passwordResetToken).not.toBeDefined();
    expect(updatedUser.passwordResetExpires).not.toBeDefined();
  });
});

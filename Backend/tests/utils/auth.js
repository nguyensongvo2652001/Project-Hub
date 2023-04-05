const cookie = require("cookie");
const request = require("supertest");

const testSendAuthResponse = (res) => {
  expect(res.body).toHaveProperty("data");

  const { data } = res.body;

  expect(data).toHaveProperty("message");
  expect(data).toHaveProperty("token");
  expect(data).not.toHaveProperty("password");

  const setCookieHeader = res.headers["set-cookie"][0];
  const cookies = cookie.parse(setCookieHeader);
  expect(cookies).toHaveProperty("token");
};

const getLoginCookie = async (app, loginRoute, loginInfo) => {
  const agent = request.agent(app);

  const res1 = await agent.post(loginRoute).send({
    email: loginInfo.email,
    password: loginInfo.password,
  });
  const cookie = res1.headers["set-cookie"][0];

  return cookie;
};

const testShouldFailIfUserNotLoggedIn = async (agent, route, action) => {
  if (!action) {
    return await agent.post(route).expect(401);
  }

  await action(agent, route);
};

module.exports = {
  testSendAuthResponse,
  getLoginCookie,
  testShouldFailIfUserNotLoggedIn,
};

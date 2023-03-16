import { build } from "../helper";

describe("login tests", () => {
  const app = build();

  test("successful login", async () => {
    const res = await app.inject({
      method: "post",
      url: "/api/v1/auth/login",
      payload: {
        username: "modiji",
        password: "modiji",
      },
    });
    expect(res.statusCode).toBe(200);
    let { success, message } = JSON.parse(res.payload);
    expect(success).toEqual(true);
    expect(message).toEqual("Logged in successfully!");
  });
});

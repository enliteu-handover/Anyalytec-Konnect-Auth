import { build } from "../helper";

describe("signup tests", () => {
  const app = build();

  test("successful signup", async () => {
    const res = await app.inject({
      method: "post",
      url: "/api/v1/auth/signup",
      payload: {
        username: `Test_${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        password: "123456789",
      },
    });
    expect(res.statusCode).toBe(200);
    let { success, message } = JSON.parse(res.payload);
    expect(success).toEqual(true);
    expect(message).toEqual("Successfully created User!");
  });

  test("already user exists", async () => {
    const res = await app.inject({
      method: "post",
      url: "/api/v1/auth/signup",
      payload: {
        username: "Test_3056425383",
        password: "12345678",
      },
    });
    expect(res.statusCode).toBe(409);
    let { error, message } = JSON.parse(res.payload);
    expect(error).toEqual("Conflict");
    expect(message).toEqual("User already exists!");
  });
});

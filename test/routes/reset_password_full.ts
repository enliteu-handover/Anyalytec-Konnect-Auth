import { build } from "../helper";

describe("Complete Reset Password Test", () => {
  const app = build();
  let generatedUserToken: string;
  test("successful forgot password invoke", async () => {
    const res = await app.inject({
      method: "post",
      url: "/api/v1/auth/forgot_password",
      payload: {
        email_id: "test@crayond.co",
      },
    });
    expect(res.statusCode).toBe(200);
    let {
      success,
      data: { token },
    } = JSON.parse(res.payload);
    generatedUserToken = token;
    expect(success).toEqual(true);
  });

  test("successfull verify token", async () => {
    const res = await app.inject({
      method: "get",
      url: "/api/v1/auth/verify_token",
      headers: {
        authorization: `Bearer ${generatedUserToken}`,
      },
    });
    expect(res.statusCode).toBe(200);
    let { success, message } = JSON.parse(res.payload);
    expect(success).toEqual(true);
    expect(message).toEqual("Token is Valid!");
  });

  test("successfully reset password", async () => {
    const res = await app.inject({
      method: "post",
      url: "/api/v1/auth/reset_password",
      payload: {
        new_password: "12345678",
      },
      headers: {
        authorization: `Bearer ${generatedUserToken}`,
      },
    });
    expect(res.statusCode).toBe(200);
    let { success, message } = JSON.parse(res.payload);
    expect(success).toEqual(true);
    expect(message).toEqual("Password Reset Successfully!");
  });
});

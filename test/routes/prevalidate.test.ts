import { build } from "../helper";

describe("Prevalidate API Tests", () => {
  const app = build();

  test("Successfull message", async () => {
    const res = await app.inject({
      method: "post",
      url: "/api/v1/auth/prevalidate_user",
      payload: {
        email_id: "test123@crayond.co",
      },
    });
    expect(res.statusCode).toBe(200);
  });

  test("Unsuccessfull message", async () => {
    const res = await app.inject({
      method: "post",
      url: "/api/v1/auth/prevalidate_user",
      payload: {
        email_id: "test@crayond.co",
      },
    });
    expect(res.statusCode).toBe(409);
  });
});

const request = require("supertest");
const app = require("../app.js");

afterAll(async () => {
  const pool = require("../config/db");
  await pool.end();
});

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "secret123",
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("should return 422 for invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test",
      email: "notanemail",
      password: "secret123",
    });

    expect(res.status).toBe(422);
  });

  it("should return 409 for duplicate email", async () => {
    const email = `dup${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({ name: "User", email, password: "secret123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "User", email, password: "secret123" });

    expect(res.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  it("should login and return token", async () => {
    const email = `login${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({ name: "User", email, password: "secret123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "secret123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 401 for wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "john@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });
});

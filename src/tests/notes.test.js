const request = require("supertest");
const app = require("../app.js");

// Helper — register and login, return token
const getToken = async () => {
  const email = `notes${Date.now()}@example.com`;
  await request(app)
    .post("/api/auth/register")
    .send({ name: "Test User", email, password: "secret123" });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "secret123" });

  return res.body.token;
};

describe("Notes API", () => {
  let token;

  beforeEach(async () => {
    token = await getToken();
  });

  it("should create a note", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Note", content: "Test content" });

    expect(res.status).toBe(201);
    expect(res.body.note).toHaveProperty("id");
    expect(res.body.note.title).toBe("Test Note");
  });

  it("should get all notes", async () => {
    await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Note 1", content: "Content 1" });

    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.notes)).toBe(true);
  });

  it("should return 401 without token", async () => {
    const res = await request(app).get("/api/notes");

    expect(res.status).toBe(401);
  });

  it("should not access another users note", async () => {
    // Create note as user A
    const createRes = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Private Note", content: "Private" });

    const noteId = createRes.body.note.id;

    // Get token for user B
    const tokenB = await getToken();

    // Try to access user A note as user B
    const res = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });
});

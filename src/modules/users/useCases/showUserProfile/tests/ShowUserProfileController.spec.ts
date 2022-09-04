import { Connection } from "typeorm";
import createConnection from "../../../../../database";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import request from "supertest";
import { app } from "../../../../../app";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(`
    INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'User Test', 'antonio@dev.com', '${password}', 'now()', 'now()')
  `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show a user profile", async () => {
    const userAuthenticated = await request(app).post('/api/v1/sessions')
    .send({
      email: "antonio@dev.com",
      password: "admin"
    });

    const { token } = userAuthenticated.body;

    const userProfile = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    });

    expect(userProfile.status).toBe(200);
    expect(userProfile.body).toHaveProperty("id");

  });
});

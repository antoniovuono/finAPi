import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import createConnection from "../../../../../database";
import { app } from "../../../../../app";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(`
      INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}', 'User Test', 'user@finapi.com', '${password}', 'now()', 'now()')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Shoud be able to authenticate a user with a valid email and password", async () => {
    const userAuthenticated = await request(app).post(`/api/v1/sessions`)
    .send({
      email: "user@finapi.com",
      password: "admin",
    });

    console.log(userAuthenticated);

    expect(userAuthenticated.body).toHaveProperty("token");
    expect(userAuthenticated.status).toBe(200);
  });
});

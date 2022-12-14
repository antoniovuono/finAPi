import { Connection } from "typeorm";
import createConnection from "../../../../../database";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import request from "supertest";
import { app } from "../../../../../app";

let connection: Connection;

describe("Create Statement Controller", () => {
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

  it("Should be able to create a deposit statement", async () => {
    const userAuthenticated = await request(app).post('/api/v1/sessions')
    .send({
      email: "antonio@dev.com",
      password: "admin"
    });

    const { token } = userAuthenticated.body;

    const depositStatement = await request(app).post('/api/v1/statements/deposit')
    .send({
      amount: 300,
      description: "Test deposit"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(depositStatement.status).toBe(201);
    expect(depositStatement.body).toHaveProperty("id");
  });

  it("Should be able to create a withdraw statement", async () => {
    const userAuthenticated = await request(app).post('/api/v1/sessions')
    .send({
      email: "antonio@dev.com",
      password: "admin"
    });

    const { token } = userAuthenticated.body;

    const withdrawStatement = await request(app).post('/api/v1/statements/withdraw')
    .send({
      amount: 300,
      description: "Test deposit"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(withdrawStatement.status).toBe(201);
    expect(withdrawStatement.body).toHaveProperty("id");
  });
});

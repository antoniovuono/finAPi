import { Connection } from "typeorm";
import request from "supertest";
import { app } from "../../../../../app";
import  createConnection  from "../../../../../database";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const createUser = await request(app).post('/api/v1/users')
      .send({
        name: "User Test",
        email: "teste@example.com",
        password: "123123",
      });

      expect(createUser.status).toBe(201);
  });

  it("Should not be able to create a new user with a exists email", async () => {
    await request(app).post('/api/v1/users')
      .send({
        name: "User Test",
        email: "teste@example.com",
        password: "123123",
      });

      const createSecondUser = await request(app).post('/api/v1/users')
      .send({
        name: "User Test 2",
        email: "teste@example.com",
        password: "123123",
      });

      expect(createSecondUser.status).toBe(400);
  });
});

import { Connection } from "typeorm";
import request from "supertest";
import {v4 as uuid} from "uuid";
import createConnection from "../../../../../database";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = hash("admin", 8);

    connection.query(`
    INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'User Test', 'antonio@dev.com', '${password}', 'now()', 'now()')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});

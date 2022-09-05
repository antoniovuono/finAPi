import { Connection } from "typeorm";
import createConnection from "../../../../../database";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import request from "supertest";
import { app } from "../../../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {
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

  it("Should be able to get a statement balance", async () => {
    const userAuthenticated = await request(app).post('/api/v1/sessions')
    .send({
      email: "antonio@dev.com",
      password: "admin"
    });

    const { token } = userAuthenticated.body;

   await request(app).post('/api/v1/statements/deposit')
    .send({
      amount: 300,
      description: "Test deposit"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    await request(app).post('/api/v1/statements/withdraw')
    .send({
      amount: 100,
      description: "Test deposit"
    })
    .set({
      Authorization: `Bearer ${token}`
    });


    const getBalanceStatement = await request(app).get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${token}`
      });

      expect(getBalanceStatement.status).toBe(200);
      expect(getBalanceStatement.body.statement.length).toBe(2);

  });
});

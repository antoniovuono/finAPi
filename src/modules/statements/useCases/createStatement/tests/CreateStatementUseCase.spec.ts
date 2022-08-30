import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../../entities/Statement";
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../CreateStatementUseCase";
import { ICreateStatementDTO } from "../ICreateStatementDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Stataments", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementsRepository);
  });

  it("Should be able to make a deposit statement", async () => {
    const userTest:ICreateUserDTO = {
      name: "Test User",
      email: "test@example.com",
      password: "password"
    };

    await createUserUseCase.execute(userTest);
    const userAuthenticated = await authenticateUserUseCase.execute(userTest);

    const user_id = userAuthenticated.user.id as string;

    const createDepositStatement = await createStatementUseCase.execute({
      user_id: user_id,
      type: OperationType.DEPOSIT,
      amount: 300,
      description: "Salary for august"
    });

    expect(createDepositStatement).toHaveProperty("id");
    expect(createDepositStatement.type).toEqual(OperationType.DEPOSIT);
  });


  it("Should be able to make a withdraw statement", async () => {
    const userTest:ICreateUserDTO = {
      name: "Test User",
      email: "test@example.com",
      password: "password"
    };

    await createUserUseCase.execute(userTest);
    const userAuthenticated = await authenticateUserUseCase.execute(userTest);

    const user_id = userAuthenticated.user.id as string;

    const createDepositStatament = await createStatementUseCase.execute({
      user_id: user_id,
      type: OperationType.DEPOSIT,
      amount: 300,
      description: "Salary for august"
    });

    const createWithdrawStatement = await createStatementUseCase.execute({
      user_id: user_id,
      type: OperationType.WITHDRAW,
      amount: 120,
      description: "Salary for august"
    });

    expect(createWithdrawStatement).toHaveProperty("id");
    expect(createWithdrawStatement.type).toEqual(OperationType.WITHDRAW);
    expect(createWithdrawStatement.amount).toBeLessThan(createDepositStatament.amount);
  });
});

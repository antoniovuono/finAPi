import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../../entities/Statement";
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "../GetStatementOperationUseCase";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let getStatamentOperationsUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Balance Information", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    getStatamentOperationsUseCase = new GetStatementOperationUseCase(inMemoryUserRepository,inMemoryStatementRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
  });

  it("Should be able to return a balance information for a user account", async () => {
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


    const getStatament = await getStatamentOperationsUseCase.execute({
      user_id: user_id,
      statement_id: createDepositStatement.id as string
    });

    expect(getStatament).toHaveProperty("id");

  });
});

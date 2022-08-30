import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../GetBalanceUseCase";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance Information", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUserRepository);
  });

  it("Should be able to return a balance information for a user account", async () => {
    const userTest:ICreateUserDTO = {
      name: "Test User",
      email: "test@example.com",
      password: "password"
    };

    await createUserUseCase.execute(userTest);
    const userAuthenticated = await authenticateUserUseCase.execute(userTest);

    const user_id = userAuthenticated.user.id;

    const getBalanceInformation = await getBalanceUseCase.execute({user_id: user_id as string});

    expect(getBalanceInformation).toHaveProperty("statement");
    expect(getBalanceInformation).toHaveProperty("balance");
    expect(getBalanceInformation.statement.length).toBe(0);

  });
});

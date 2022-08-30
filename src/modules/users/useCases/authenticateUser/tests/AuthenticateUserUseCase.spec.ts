import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "../AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../IncorrectEmailOrPasswordError";


let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);

  });

  it("Should be able to authenticate a user", async () => {
    const user = {
      name: "User Test",
      email: "antonio@dev.com",
      password: "123123"
    };

    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(userAuthenticated).toHaveProperty("token");
  });

  it("Should not be able to authenticate a user with invalid email", async () => {
    const user = {
      name: "User Test",
      email: "antonio@dev.com",
      password: "123123"
    };

    await createUserUseCase.execute(user);

    expect(async () => {
       await authenticateUserUseCase.execute({
        email: "other_email@test.com",
        password: user.password
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });


  it("Should not be able to authenticate a user with invalid password", async () => {
    const user = {
      name: "User Test",
      email: "antonio@dev.com",
      password: "123123"
    };

    await createUserUseCase.execute(user);

    expect(async () => {
       await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect_password"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });
});

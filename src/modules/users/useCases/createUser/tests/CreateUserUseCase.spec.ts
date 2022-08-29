import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../CreateUserError";
import { CreateUserUseCase } from "../CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Create a user", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
  })

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Example",
      email: "user@example.com",
      password: "123123"
    });

    expect(user).toHaveProperty("id");
  });


  it("Should not be able to create a new user with a exists email address", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User1 Example",
        email: "user@example.com",
        password: "123123"
      });

      await createUserUseCase.execute({
        name: "User2 Example",
        email: "user@example.com",
        password: "1231234"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});

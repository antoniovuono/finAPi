import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
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
});

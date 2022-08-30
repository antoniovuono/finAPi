import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../ShowUserProfileUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
  });

  it("Should be able to return a user profile", async () => {
    const user = {
      name: "user",
      email: "user@example.com",
      password: "123123"
    };

    await createUserUseCase.execute(user);
    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    const showUserProfile = await showUserProfileUseCase.execute(userAuthenticated.user.id as string)

    console.log(showUserProfile);

    expect(showUserProfile).toHaveProperty("id");
  });
});

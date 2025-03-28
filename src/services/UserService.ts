export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

class UserService {
  private static user: User = { id: "1", firstName: "John", lastName: "Doe" };

  static getUser(): User {
    return this.user;
  }
}

export default UserService;

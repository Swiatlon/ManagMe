export enum Role {
  Admin = "admin",
  DevOps = "devops",
  Developer = "developer",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
}

class UserService {
  private static users: User[] = [
    { id: "1", firstName: "John", lastName: "Doe", role: Role.Admin },
    { id: "2", firstName: "Alice", lastName: "Smith", role: Role.DevOps },
    { id: "3", firstName: "Bob", lastName: "Johnson", role: Role.Developer },
  ];

  static getUser(): User {
    return this.users[0];
  }

  static getUsersWithoutAdmin(): User[] {
    return this.users.filter(user => user.role !== Role.Admin)
  }

  static getUsers(): User[] {
    return this.users;
  }
}

export default UserService;

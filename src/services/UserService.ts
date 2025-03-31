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
    if (!this.users.length) {
      throw new Error("No users available.");
    }
    return this.users[0];
  }

  static getUsersWithoutAdmin(): User[] {
    return this.users.filter((user) => user.role !== Role.Admin);
  }

  static getUsers(): User[] {
    return this.users;
  }

  static getUserById(id: string): User | null {
    return this.users.find((u) => u.id === id) || null;
  }

  static validateUserData() {
    const ids = this.users.map((u) => u.id);
    if (ids.length !== new Set(ids).size) {
      throw new Error("Duplicate user IDs found.");
    }
  }
}

export default UserService;

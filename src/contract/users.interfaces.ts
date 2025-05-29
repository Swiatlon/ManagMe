import { Role } from "./enums";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateUserRequest {
  firstName: string;
  lastName: string;
  role: Role;
}

export interface IUpdateUserRequest {
  id: string;
  data: Partial<ICreateUserRequest>;
}

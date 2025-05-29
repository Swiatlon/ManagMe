import { Role } from "./enums";
import { IUser } from "./users.interfaces";

export interface ILoginRequest {
  identifier: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}

export interface IRegisterRequest {
  identifier: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface IRegisterResponse {
  accessToken: string;
  user: IUser;
}

export type ILogoutResponse = object;

export type IRefreshRequest = object;

export interface IRefreshResponse {
  accessToken: string;
  user: IUser;
}

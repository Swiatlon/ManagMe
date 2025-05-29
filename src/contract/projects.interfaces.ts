export interface IProject {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateProjectRequest {
  name: string;
  description: string;
}

export interface IUpdateProjectRequest {
  id: string;
  data: Partial<ICreateProjectRequest>;
}

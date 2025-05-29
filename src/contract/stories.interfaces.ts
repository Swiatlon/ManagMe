import { Priority, Status } from "./enums";
import { IProject } from "./projects.interfaces";

export interface IStory {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  project: IProject;
  status: Status;
  owner: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateStoryRequest {
  name: string;
  description: string;
  priority: Priority;
  projectId: string;
  status?: Status;
  ownerId: string;
}

export interface IUpdateStoryRequest {
  id: string;
  data: Partial<ICreateStoryRequest>;
}

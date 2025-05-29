import { TaskPriority, TaskStatus } from "./enums";
import { IStory } from "./stories.interfaces";
import { IUser } from "./users.interfaces";

export interface ITask {
  id?: string;
  name: string;
  description: string;
  priority: TaskPriority;
  story: IStory;
  estimatedHours: number;
  status: TaskStatus;
  startDate?: string;
  endDate?: string;
  assignedUser: IUser | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateTaskRequest {
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: string;
  estimatedHours: number;
  status?: TaskStatus;
  startDate?: string;
  endDate?: string;
  assignedUserId: string | null;
}

export interface IUpdateTaskRequest {
  id: string;
  data: Partial<Omit<ICreateTaskRequest, 'assignedUserId'>> & {
    assignedUserId?: string | null;
  };
}

export interface ITaskAssignmentRequest {
  taskId: string;
  assignedUserId: string | null;
  startDate?: string;
}

export interface ITaskStatusUpdateRequest {
  taskId: string;
  status: TaskStatus;
  endDate?: string;
}

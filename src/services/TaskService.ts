export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum TaskStatus {
  Todo = "todo",
  Doing = "doing",
  Done = "done",
}

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: string;
  estimatedHours: number;
  status: TaskStatus;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  assignedUserId?: string;
}

class TaskService {
  private static STORAGE_KEY = "tasks";

  static getTasks(): Task[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getTasksByStory(storyId: string): Task[] {
    return this.getTasks().filter((task) => task.storyId === storyId);
  }

  static saveTasks(tasks: Task[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  static addTask(task: Task) {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  static updateTask(updatedTask: Task) {
    const tasks = this.getTasks().map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    this.saveTasks(tasks);
  }

  static deleteTask(id: string) {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    this.saveTasks(tasks);
  }

  static assignUser(taskId: string, userId: string) {
    const tasks = this.getTasks().map((task) => {
      if (task.id === taskId) {
        return { ...task, assignedUserId: userId, status: TaskStatus.Doing, startDate: new Date().toISOString() };
      }
      return task;
    });
    this.saveTasks(tasks);
  }

  static completeTask(taskId: string) {
    const tasks = this.getTasks().map((task) => {
      if (task.id === taskId) {
        return { ...task, status: TaskStatus.Done, endDate: new Date().toISOString() };
      }
      return task;
    });
    this.saveTasks(tasks);
  }
}

export default TaskService;

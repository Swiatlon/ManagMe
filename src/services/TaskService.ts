import StoryService from "./StoryService";

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
  startDate?: string | null;
  endDate?: string | null;
  assignedUserId?: string | null;
}

class TaskService {
  private static STORAGE_KEY = "tasks";

  // Fetch all tasks
  static getTasks(): Task[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to parse tasks from localStorage:", error);
      return [];
    }
  }

  static getTasksByStory(storyId: string): Task[] {
    return this.getTasks().filter((task) => task.storyId === storyId);
  }

  static saveTasks(tasks: Task[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }


  static addTask(task: Task) {
    const tasks = this.getTasks();

    if (tasks.some((t) => t.id === task.id)) {
      throw new Error(`A task with ID ${task.id} already exists.`);
    }

    if (!task.name || !task.description || !task.storyId) {
      throw new Error("Task name, description, and story ID are required.");
    }

    tasks.push(task);
    this.saveTasks(tasks);
  }

  static updateTask(updatedTask: Task) {
    const tasks = this.getTasks();

    if (!updatedTask.name || !updatedTask.description || !updatedTask.storyId) {
      throw new Error("Updated task name, description, and story ID are required.");
    }

    const updatedTasks = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );

    this.saveTasks(updatedTasks);
  }

  static deleteTask(id: string) {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    this.saveTasks(tasks);
  }

  static assignUser(taskId: string, userId: string) {
    const tasks = this.getTasks().map((task) => {
      if (task.id === taskId) {
        if (task.status === TaskStatus.Done) {
          throw new Error("Cannot assign a user to a completed task.");
        }
        return { ...task, assignedUserId: userId, status: TaskStatus.Doing, startDate: new Date().toISOString() };
      }
      return task;
    });

    this.saveTasks(tasks);
  }

  static completeTask(taskId: string) {
    const tasks = this.getTasks().map((task) => {
      if (task.id === taskId) {
        if (task.status === TaskStatus.Done) {
          throw new Error("Task is already completed.");
        }
        return { ...task, status: TaskStatus.Done, endDate: new Date().toISOString() };
      }
      return task;
    });
    this.saveTasks(tasks);
  }

  static getTaskById(id: string): Task | null {
    const tasks = this.getTasks();
    return tasks.find((t) => t.id === id) || null;
  }

  static cleanupTasks() {
    const stories = StoryService.getStories().map((s) => s.id);
    const tasks = this.getTasks().filter((t) => stories.includes(t.storyId));
    this.saveTasks(tasks);
  }
}

export default TaskService;

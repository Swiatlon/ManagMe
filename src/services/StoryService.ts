import ProjectService from "./ProjectService";

export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum Status {
  Todo = "todo",
  Doing = "doing",
  Done = "done",
}

export interface Story {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  projectId: string;
  createdAt: string;
  status: Status;
  ownerId: string;
}

class StoryService {
  private static STORAGE_KEY = "stories";

  static getStories(): Story[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to parse stories from localStorage:", error);
      return [];
    }
  }

  static getStoriesByProject(projectId: string): Story[] {
    return this.getStories().filter((story) => story.projectId === projectId);
  }

  static saveStories(stories: Story[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    } catch (error) {
      console.error("Failed to save stories to localStorage:", error);
    }
  }

  static addStory(story: Story) {
    const stories = this.getStories();

    if (stories.some((s) => s.id === story.id)) {
      throw new Error(`A story with ID ${story.id} already exists.`);
    }

    if (!story.name || !story.description || !story.projectId) {
      throw new Error("Story name, description, and project ID are required.");
    }

    stories.push(story);
    this.saveStories(stories);
  }


  static updateStory(updatedStory: Story) {
    const stories = this.getStories();

    if (!updatedStory.name || !updatedStory.description || !updatedStory.projectId) {
      throw new Error("Updated story name, description, and project ID are required.");
    }

    const updatedStories = stories.map((s) =>
      s.id === updatedStory.id ? updatedStory : s
    );

    this.saveStories(updatedStories);
  }

  static deleteStory(id: string) {
    const stories = this.getStories().filter((s) => s.id !== id);
    this.saveStories(stories);
  }


  static deleteStoriesByProject(projectId: string) {
    const stories = this.getStories().filter((s) => s.projectId !== projectId);
    this.saveStories(stories);
  }


  static cleanupStories() {
    const projects = ProjectService.getProjects().map((p) => p.id);
    const stories = this.getStories().filter((s) => projects.includes(s.projectId));
    this.saveStories(stories);
  }

  static getStoryById(id: string): Story | null {
    const stories = this.getStories();
    return stories.find((s) => s.id === id) || null;
  }
}

export default StoryService;

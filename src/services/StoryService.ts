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
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getStoriesByProject(projectId: string): Story[] {
    return this.getStories().filter((story) => story.projectId === projectId);
  }

  static saveStories(stories: Story[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }

  static addStory(story: Story) {
    const stories = this.getStories();
    stories.push(story);
    this.saveStories(stories);
  }

  static updateStory(updatedStory: Story) {
    const stories = this.getStories().map((s) =>
      s.id === updatedStory.id ? updatedStory : s
    );
    this.saveStories(stories);
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
    const stories = this.getStories().filter((s) => s.projectId);
    this.saveStories(stories);
  }
}

export default StoryService;

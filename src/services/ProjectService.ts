import StoryService from "./StoryService";

export interface Project {
  id: string;
  name: string;
  description: string;
}

class ProjectService {
  private static STORAGE_KEY = "projects";

  static getProjects(): Project[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveProjects(projects: Project[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }

  static addProject(project: Project) {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  }

  static updateProject(updatedProject: Project) {
    const projects = this.getProjects().map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    this.saveProjects(projects);
  }

  static deleteProject(id: string) {
    const projects = this.getProjects().filter((p) => p.id !== id);
    this.saveProjects(projects);
    StoryService.deleteStoriesByProject(id);
  }
}

export default ProjectService;

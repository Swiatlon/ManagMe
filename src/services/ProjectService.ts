import StoryService from "./StoryService";

export interface Project {
  id: string;
  name: string;
  description: string;
}

class ProjectService {
  private static STORAGE_KEY = "projects";

  static getProjects(): Project[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to parse projects from localStorage:", error);
      return [];
    }
  }

  static saveProjects(projects: Project[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects to localStorage:", error);
    }
  }

  static addProject(project: Project) {
    const projects = this.getProjects();

    if (projects.some((p) => p.id === project.id)) {
      throw new Error(`A project with ID ${project.id} already exists.`);
    }

    if (!project.name || !project.description) {
      throw new Error("Project name and description are required.");
    }

    projects.push(project);
    this.saveProjects(projects);
  }

  static updateProject(updatedProject: Project) {
    const projects = this.getProjects();

    if (!updatedProject.name || !updatedProject.description) {
      throw new Error("Updated project name and description are required.");
    }

    const updatedProjects = projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );

    this.saveProjects(updatedProjects);
  }

  static deleteProject(id: string) {
    const projects = this.getProjects();
    const filteredProjects = projects.filter((p) => p.id !== id);

    if (filteredProjects.length === projects.length) {
      console.warn(`No project found with ID ${id}.`);
      return;
    }

    this.saveProjects(filteredProjects);


    try {
      StoryService.deleteStoriesByProject(id);
    } catch (error) {
      console.error(`Failed to delete stories for project ID ${id}:`, error);
    }
  }


  static getProjectById(id: string): Project | null {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id) || null;
  }
}

export default ProjectService;

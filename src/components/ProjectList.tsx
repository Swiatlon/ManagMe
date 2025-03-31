import { useState } from "react";
import { Button, Box, Container } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ProjectService, { Project } from "../services/ProjectService";
import StoryService from "../services/StoryService";
import ProjectForm from "./ProjectForm";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(ProjectService.getProjects());
  const [openModal, setOpenModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const handleAdd = () => {
    setEditProject(null);
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      ProjectService.deleteProject(id);
      StoryService.deleteStoriesByProject(id);
      setProjects(ProjectService.getProjects());
    }
  };

  const handleEdit = (project: Project) => {
    setEditProject(project);
    setOpenModal(true);
  };

  const handleSave = () => {
    setProjects(ProjectService.getProjects());
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 200 },
    { field: "name", headerName: "Name", minWidth: 200 },
    { field: "description", headerName: "Description", minWidth: 200, flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      renderCell: (params) => (
        <>
          <Button color="primary" onClick={() => handleEdit(params.row)}>
            Edit
          </Button>
          <Button color="error" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Box sx={{ display: "flex", gap: 2, my: 2 }}>
        <Button variant="contained" onClick={handleAdd} sx={{ textWrap: "nowrap", px: 6, py: 2 }}>
          Add Project
        </Button>
      </Box>

      <DataGrid
        rows={projects}
        columns={columns}
        getRowId={(row) => row.id}
        rowSelection={false}
        sx={{ width: "100%", height: "80vh" }}
      />

      {openModal && <ProjectForm open={openModal} onClose={() => setOpenModal(false)} project={editProject} onSave={handleSave} />}
    </Container>
  );
}

import { Button, Container, Box, Alert, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Edit, Delete, Add } from "@mui/icons-material";
import { IProject } from "../../../contract/projects.interfaces";
import { useGetAllProjectsQuery, useDeleteProjectMutation } from "../../../redux/apiSlices/projects.api.slice";
import ProjectForm from "./ProjectForm";

export default function ProjectList() {
  const { data: projects = [], isLoading, error, refetch } = useGetAllProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [openModal, setOpenModal] = useState(false);
  const [editProject, setEditProject] = useState<IProject | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleAdd = () => {
    setEditProject(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id).unwrap();
  };

  const handleEdit = (project: IProject) => {
    setEditProject(project);
    setOpenModal(true);
  };

  const handleSave = () => {
    setOpenModal(false);
    refetch(); // Refresh data after save
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditProject(null);
  };

  const handleRetry = () => {
    setDeleteError(null);
    refetch();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 300,
      flex: 2,
      renderCell: (params) => (
        <Tooltip title={params.value || "No description"}>
          <span>{params.value || "No description"}</span>
        </Tooltip>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit project">
            <IconButton
            data-cy="edit-project"
              color="primary"
              onClick={() => handleEdit(params.row)}
              size="small"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete project">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)}
              disabled={isDeleting}
              size="small"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
          sx={{ mt: 2 }}
        >
          Failed to load projects. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <h1>Projects</h1>
          <Button
            variant="contained"
            onClick={handleAdd}
            startIcon={<Add />}
            sx={{ px: 3, py: 1 }}
          >
            Add Project
          </Button>
        </Box>

        {deleteError && (
          <Alert
            severity="error"
            onClose={() => setDeleteError(null)}
            sx={{ mb: 2 }}
          >
            {deleteError}
          </Alert>
        )}

        {projects.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Alert severity="info">
              No projects found. Create your first project to get started!
            </Alert>
          </Box>
        ) : (
          <DataGrid
            rows={projects}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            sx={{
              width: "100%",
              minHeight: 400,
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
              }
            }}
          />
        )}
      </Box>

      {openModal && (
        <ProjectForm
          open={openModal}
          onClose={handleCloseModal}
          project={editProject}
          onSave={handleSave}
        />
      )}
    </Container>
  );
}

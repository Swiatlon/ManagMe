import { useState, useEffect } from "react";
import { Button, Container, Box, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import StoryService, { Story } from "../services/StoryService";
import ProjectService from "../services/ProjectService";
import StoryForm from "./StoryForm";

export default function StoryList() {
  const [stories, setStories] = useState<Story[]>(StoryService.getStories());
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const projects = ProjectService.getProjects();

  useEffect(() => {
    StoryService.cleanupStories();

    if (selectedProject) {
      setStories(StoryService.getStoriesByProject(selectedProject));
    } else {
      setStories(StoryService.getStories());
    }
  }, [selectedProject]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        StoryService.deleteStory(id);
        setStories(StoryService.getStoriesByProject(selectedProject));
      } catch (error) {
        console.error("Failed to delete story:", error);
      }
    }
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setOpenModal(true);
  };

  const handleSave = () => {
    setStories(StoryService.getStoriesByProject(selectedProject));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 100 },
    { field: "name", headerName: "Name", minWidth: 200 },
    { field: "description", headerName: "Description", minWidth: 250 },
    { field: "priority", headerName: "Priority", minWidth: 150 },
    { field: "projectId", headerName: "Project", minWidth: 150 },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 200,
      type: "string",
    },
    { field: "status", headerName: "Status", minWidth: 150 },
    { field: "ownerId", headerName: "Owner (User ID)", minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button color="error" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const filteredStories = stories.filter((story) => {
    if (selectedStatus) {
      return story.status === selectedStatus;
    }
    return true;
  });

  if (projects.length <= 0) {
    return (
      <Container sx={{ display: 'flex', height: "100%", flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <Typography>Create project first!</Typography>
      </Container>
    )
  }

  return (
    <Container>
      <Box sx={{ display: "flex", gap: 2, my: 2, width: "100%" }}>
        <FormControl fullWidth>
          <InputLabel>Select Project</InputLabel>
          <Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            label="Select Project"
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Select Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Select Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="todo">Todo</MenuItem>
            <MenuItem value="doing">Doing</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ textWrap: "nowrap", px: 4 }}>
          Add Story
        </Button>
      </Box>

      {selectedProject && (
        <DataGrid
          rows={filteredStories}
          columns={columns}
          getRowId={(row) => row.id}
          rowSelection={false}
          sx={{ width: "100%", height: "80vh" }}
        />
      )}
      {openModal && <StoryForm open={openModal} onClose={() => setOpenModal(false)} story={editingStory} onSave={handleSave} />}
    </Container>
  );
}

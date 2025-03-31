import { useState, useEffect } from "react";
import { Button, Container, Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TaskService, { Task, TaskStatus } from "../services/TaskService";
import TaskForm from "./TaskForm";


export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(TaskService.getTasks());
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(TaskService.getTasks());
  }, []);

  const handleAdd = () => {
    setEditTask(null);
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    TaskService.deleteTask(id);
    setTasks(TaskService.getTasks());
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setOpenModal(true);
  };

  const handleSave = () => {
    setTasks(TaskService.getTasks());
  };

  const handleComplete = (id: string) => {
    TaskService.completeTask(id);
    setTasks(TaskService.getTasks());
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 100 },
    { field: "name", headerName: "Name", minWidth: 200 },
    { field: "description", headerName: "Description", minWidth: 250 },
    { field: "priority", headerName: "Priority", minWidth: 150 },
    { field: "status", headerName: "Status", minWidth: 150 },
    { field: "assignedUserId", headerName: "Assigned To", minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 250,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button color="error" onClick={() => handleDelete(params.row.id)}>Delete</Button>
          {params.row.status !== TaskStatus.Done && (
            <Button color="success" onClick={() => handleComplete(params.row.id)}>Complete</Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Container>
      <Box sx={{ display: "flex", gap: 2, my: 2 }}>
        <Button variant="contained" onClick={handleAdd}>Add Task</Button>
      </Box>
      <DataGrid rows={tasks} columns={columns} getRowId={(row) => row.id} sx={{ width: "100%", height: "80vh" }} />
      <TaskForm open={openModal} onClose={() => setOpenModal(false)} task={editTask} onSave={handleSave} />
    </Container>
  );
}

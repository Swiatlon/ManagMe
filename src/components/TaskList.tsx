import { useState, useEffect } from "react";
import { Button, Container, Box, Typography, Chip, Avatar } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TaskService, { Task, TaskStatus } from "../services/TaskService";
import TaskForm from "./TaskForm";
import UserService, { User } from "../services/UserService";
import TaskKanban from "./TaskKanban";
import { Priority } from "../services/StoryService";

const priorityColors: Record<string, "primary" | "warning" | "error" | "success"> = {
  [Priority.Low]: "success",
  [Priority.Medium]: "warning",
  [Priority.High]: "error",
};

const statusColors: Record<TaskStatus, "primary" | "warning" | "success"> = {
  [TaskStatus.Done]: "success",
  [TaskStatus.Todo]: "primary",
  [TaskStatus.Doing]: "warning"
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setTasks(TaskService.getTasks());
    setUsers(UserService.getUsersWithoutAdmin());
  }, []);

  const handleAdd = () => {
    setEditTask(null);
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        TaskService.deleteTask(id);
        setTasks([...TaskService.getTasks()]);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setOpenModal(true);
  };

  const handleSave = () => {
    setTasks([...TaskService.getTasks()]);
    setOpenModal(false);
  };

  const handleComplete = (id: string) => {
    try {
      TaskService.completeTask(id);
      setTasks([...TaskService.getTasks()]);
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 100 },
    { field: "name", headerName: "Name", minWidth: 200 },
    { field: "description", headerName: "Description", minWidth: 250 },
    {
      field: "priority",
      headerName: "Priority",
      minWidth: 150,
      renderCell: (params) => (
        <Chip label={params.value} color={priorityColors[params.value] || "default"} />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      renderCell: (params) => (
        <Chip label={params.value} color={statusColors[params.value as TaskStatus] || "default"} />
      ),
    },
    {
      field: "assignedUserId",
      headerName: "Assigned To",
      minWidth: 150,
      renderCell: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user ? `${user.firstName} ${user.lastName} (${user.role})` : "Unassigned";
      },
    },
    {
      field: "estimatedHours",
      headerName: "Est. Hours",
      minWidth: 100,
      renderCell: (params) => <Box sx={{display: 'flex', height: '100%' }}> <Avatar sx={{bgcolor: 'lightblue', my: 'auto'}}>{params.value}</Avatar></Box>,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 200,
      renderCell: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          return (
            <Typography sx={{ placeContent: "center", height: "100%" }}>
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </Typography>
          );
        } else {
          return "Not started";
        }
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 200,
      renderCell: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          return (
            <Typography sx={{ placeContent: "center", height: "100%" }}>
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </Typography>
          );
        } else {
          return "Not completed";
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 250,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button color="error" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
          {params.row.status !== TaskStatus.Done && (
            <Button color="success" onClick={() => handleComplete(params.row.id)}>
              Complete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Container>
      <Box sx={{ display: "flex", gap: 2, my: 2 }}>
        <Button variant="contained" onClick={handleAdd}>
          Add Task
        </Button>
      </Box>
      <DataGrid rows={tasks} columns={columns} getRowId={(row) => row.id} sx={{ width: "100%", height: "50vh" }} rowSelection={false} />
      {openModal && (
        <TaskForm open={openModal} onClose={() => setOpenModal(false)} task={editTask} onSave={handleSave} />
      )}
      <TaskKanban tasks={tasks} users={users} />
    </Container>
  );
}

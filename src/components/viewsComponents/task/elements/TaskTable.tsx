import { Avatar, Box, Chip, Typography } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { TaskStatus } from "../../../../contract/enums";
import { IStory } from "../../../../contract/stories.interfaces";
import { ITask } from "../../../../contract/tasks.interfaces";
import { IUser } from "../../../../contract/users.interfaces";
import TaskActions from "./TaskActions";


const statusColors = {
  [TaskStatus.Todo]: "default",
  [TaskStatus.Doing]: "warning",
  [TaskStatus.Done]: "success",
} as const;

const priorityColors = {
  Low: "success",
  Medium: "warning",
  High: "error",
} as const;

interface Props {
  tasks: ITask[];
  stories: IStory[];
  users: IUser[];
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  isDeleting: boolean;
}

export default function TaskTable({ tasks, stories, users, onEdit, onDelete, onComplete, isDeleting }: Props) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Task Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 2,
    },
    {
      field: "priority",
      headerName: "Priority",
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={priorityColors[params.value as keyof typeof priorityColors]}
          size="small"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value as keyof typeof statusColors]}
          size="small"
        />
      ),
    },
    {
      field: "story",
      headerName: "Story",
      minWidth: 180,
      renderCell: (params) => {
        const story = stories.find(s => s.id === params.row.story?.id);
        return story?.name || "Unknown Story";
      },
    },
        {
      field: "assignedUser",
      headerName: "Assigned To",
      minWidth: 300,
      renderCell: (params) => {
        const user = users.find((user) => user.id === params.row?.assignedUser?.id);
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
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <TaskActions
          onEdit={() => onEdit(params.row)}
          onDelete={() => onDelete(params.row.id)}
          onComplete={() => onComplete(params.row.id)}
          isDeleting={isDeleting}
        />
      ),
    },
  ];

  return (
    <DataGrid
      rows={tasks}
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
        minHeight: 400,
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
        },
      }}
    />
  );
}

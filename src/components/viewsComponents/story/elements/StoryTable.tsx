import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Chip, Tooltip } from "@mui/material";
import StoryActions from "./StoryActions";
import { IStory } from "../../../../contract/stories.interfaces";
import { IProject } from "../../../../contract/projects.interfaces";
import { Status } from "../../../../contract/enums";

const statusColors = {
  [Status.Todo]: "default",
  [Status.Doing]: "warning",
  [Status.Done]: "success",
} as const;

const priorityColors = {
  Low: "success",
  Medium: "warning",
  High: "error",
} as const;

interface Props {
  stories: IStory[];
  projects: IProject[];
  onEdit: (story: IStory) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function StoryTable({ stories, projects, onEdit, onDelete, isDeleting }: Props) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Story Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 250,
      flex: 2,
      renderCell: (params) => (
        <Tooltip title={params.value || "No description"}>
          <span>{params.value || "No description"}</span>
        </Tooltip>
      ),
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
      field: "project",
      headerName: "Project",
      minWidth: 180,
      renderCell: (params) => {
        const project = projects.find((p) => p.id === params.value.id);
        return project?.name || "Unknown Project";
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value as Status]}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      minWidth: 150,
      renderCell: (params) => {
        if (!params.value) return "-";
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <StoryActions
          onEdit={() => onEdit(params.row)}
          onDelete={() => onDelete(params.row.id)}
          isDeleting={isDeleting}
        />
      ),
    },
  ];

  return (
    <DataGrid
      rows={stories}
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

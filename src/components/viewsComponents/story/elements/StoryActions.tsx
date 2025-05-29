import { IconButton, Tooltip, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function StoryActions({ onEdit, onDelete, isDeleting }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip title="Edit story">
        <IconButton color="primary" onClick={onEdit} size="small">
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete story">
        <IconButton color="error" onClick={onDelete} disabled={isDeleting} size="small">
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

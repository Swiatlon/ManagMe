import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface TaskActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  isDeleting?: boolean;
}

export default function TaskActions({ onEdit, onDelete, onComplete, isDeleting }: TaskActionsProps) {
  return (
    <div>
      <Tooltip title="Edit Task">
        <IconButton size="small" onClick={onEdit}>
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete Task">
        <span>
          <IconButton size="small" onClick={onDelete} disabled={isDeleting}>
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Mark Complete">
        <IconButton size="small" onClick={onComplete}>
          <CheckCircleIcon color="success" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

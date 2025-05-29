import { Box, Button, Typography } from "@mui/material";

interface TaskHeaderProps {
  onAdd: () => void;
}

export default function TaskHeader({ onAdd }: TaskHeaderProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
      <Typography variant="h5">Task Management</Typography>
      <Button variant="contained" onClick={onAdd}>
        Add Task
      </Button>
    </Box>
  );
}

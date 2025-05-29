import { Box, Button, Container, Typography } from "@mui/material";

interface Props {
  onAdd: () => void;
}

export default function TaskEmptyState({ onAdd }: Props) {
  return (
    <Container>
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">No tasks found. Try adding one!</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={onAdd}>
          Add Task
        </Button>
      </Box>
    </Container>
  );
}

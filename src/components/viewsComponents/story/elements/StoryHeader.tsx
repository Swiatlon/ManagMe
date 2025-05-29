import { Typography, Button, Box } from "@mui/material";
import { Add } from "@mui/icons-material";

interface Props {
  selectedProjectName: string;
  onAdd: () => void;
}

export default function StoryHeader({ selectedProjectName, onAdd }: Props) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Typography variant="h4" component="h1">
        User Stories
        {selectedProjectName && (
          <Typography variant="subtitle1" color="text.secondary" component="span" sx={{ ml: 2 }}>
            - {selectedProjectName}
          </Typography>
        )}
      </Typography>
      <Button variant="contained" onClick={onAdd} startIcon={<Add />} sx={{ px: 3, py: 1 }}>
        Add Story
      </Button>
    </Box>
  );
}

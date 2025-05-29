import { Alert, Typography, Box } from "@mui/material";
import { IStory } from "../../../../contract/stories.interfaces";

interface Props {
  filters: { project: string; status: string };
  stories: IStory[];
}

export default function StoryEmptyState({ filters, stories }: Props) {
  if (!filters.project) {
    return (
      <Box sx={{ my:3 }}>
        <Alert severity="info">
          <Typography variant="h6">Select a Project</Typography>
          <Typography>Choose a project from the dropdown below to view its stories.</Typography>
        </Alert>
      </Box>
    );
  }

  if (stories.length === 0) {
    return (
      <Box sx={{ my:3 }}>
        <Alert severity="info">
          <Typography variant="h6">No Stories Found</Typography>
          <Typography>
            {filters.status
              ? `No stories with status "${filters.status}" in this project.`
              : "This project doesn't have any stories yet. Create your first story!"}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return null;
}

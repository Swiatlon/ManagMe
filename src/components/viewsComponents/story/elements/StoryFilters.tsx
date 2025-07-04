import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { Clear, FilterList } from "@mui/icons-material";
import { Status } from "../../../../contract/enums";

interface Props {
  filters: { project: string; status: string };
  setFilters: (filters: { project: string; status: string }) => void;
  projects: { id: string; name: string }[];
}

export default function StoryFilters({ filters, setFilters, projects }: Props) {
  const clearFilters = () => setFilters({ project: "", status: "" });

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Select Project</InputLabel>
        <Select
          data-cy="project-filter"
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
          label="Select Project"
          size="medium"
        >
          <MenuItem value="">All Projects</MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
         data-cy="story-status"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          label="Status"
          size="medium"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={Status.Todo}>Todo</MenuItem>
          <MenuItem value={Status.Doing}>Doing</MenuItem>
          <MenuItem value={Status.Done}>Done</MenuItem>
        </Select>
      </FormControl>

      {(filters.project || filters.status) && (
        <Tooltip title="Clear filters">
          <IconButton data-cy="clear-filters" onClick={clearFilters} color="primary">
            <Clear />
          </IconButton>
        </Tooltip>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
        <FilterList color="action" />
        <Typography variant="body2" color="text.secondary">
          Filters applied
        </Typography>
      </Box>
    </Box>
  );
}

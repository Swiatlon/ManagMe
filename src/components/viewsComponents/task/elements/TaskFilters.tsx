import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { IUser } from "../../../../contract/users.interfaces";
import { IStory } from "../../../../contract/stories.interfaces";
import { TaskPriority, TaskStatus } from "../../../../contract/enums";

interface TaskFiltersProps {
  users: IUser[];
  stories: IStory[];
  selectedStatus: TaskStatus | "all";
  selectedUser: string | "all";
  selectedPriority: TaskPriority | "all";
  selectedStory: string | "all";
  onStatusChange: (value: TaskStatus | "all") => void;
  onUserChange: (value: string | "all") => void;
  onPriorityChange: (value: TaskPriority | "all") => void;
  onStoryChange: (value: string | "all") => void;
}

export default function TaskFilters({
  users,
  stories,
  selectedStatus,
  selectedUser,
  selectedPriority,
  selectedStory,
  onStatusChange,
  onUserChange,
  onPriorityChange,
  onStoryChange,
}: TaskFiltersProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={selectedStatus}
          label="Status"
          onChange={(e: SelectChangeEvent) => onStatusChange(e.target.value as TaskStatus | "all")}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value={TaskStatus.Todo}>Todo</MenuItem>
          <MenuItem value={TaskStatus.Doing}>Doing</MenuItem>
          <MenuItem value={TaskStatus.Done}>Done</MenuItem>
        </Select>
      </FormControl>

      {/* User Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Assignee</InputLabel>
        <Select
          value={selectedUser}
          label="Assignee"
          onChange={(e: SelectChangeEvent) => onUserChange(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Priority Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={selectedPriority}
          label="Priority"
          onChange={(e: SelectChangeEvent) => onPriorityChange(e.target.value as TaskPriority | "all")}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value={TaskPriority.Low}>Low</MenuItem>
          <MenuItem value={TaskPriority.Medium}>Medium</MenuItem>
          <MenuItem value={TaskPriority.High}>High</MenuItem>
        </Select>
      </FormControl>

      {/* Story Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Story</InputLabel>
        <Select
          value={selectedStory}
          label="Story"
          onChange={(e) => onStoryChange(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          {stories.map((story) => (
            <MenuItem key={story.id} value={story.id}>
              {story.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

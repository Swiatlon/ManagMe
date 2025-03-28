import { useEffect } from "react";
import { Modal, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import StoryService, { Priority, Status, Story } from "../services/StoryService";
import ProjectService from "../services/ProjectService";
import UserService from "../services/UserService";

interface StoryFormProps {
  open: boolean;
  onClose: () => void;
  story?: Story | null;
  onSave: () => void;
}

const schema = Yup.object({
  name: Yup.string().required("Story name is required."),
  description: Yup.string().required("Description is required."),
  priority: Yup.mixed<Priority>().oneOf([Priority.Low, Priority.Medium, Priority.High]).required("Priority is required."),
  status: Yup.mixed<Status>().oneOf([Status.Todo, Status.Doing, Status.Done]).required("Status is required."),
  projectId: Yup.string().required("Project selection is required."),
  ownerId: Yup.string()
});

export default function StoryForm({ open, onClose, story, onSave }: StoryFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      priority: Priority.Medium,
      status: Status.Todo,
      projectId: "",
      ownerId: UserService.getUser().id,
    },
  });

  const projects = ProjectService.getProjects();

  useEffect(() => {
    if (story) {
      setValue("name", story.name);
      setValue("description", story.description);
      setValue("priority", story.priority);
      setValue("status", story.status);
      setValue("projectId", story.projectId);
    }
  }, [story, setValue]);

  const onSubmit = (data: any) => {
    const storyData = {
      ...data,
      id: story ? story.id : Date.now().toString(),
      createdAt: story ? story.createdAt : new Date().toISOString(),
      ownerId: UserService.getUser().id,
    };

    if (story) {
      StoryService.updateStory(storyData);
    } else {
      StoryService.addStory(storyData);
    }

    onSave();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 3, bgcolor: "white", mx: "auto", mt: 5, width: 400 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Story Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Story Description"
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Priority" error={!!errors.priority}>
                  <MenuItem value={Priority.Low}>Low</MenuItem>
                  <MenuItem value={Priority.Medium}>Medium</MenuItem>
                  <MenuItem value={Priority.High}>High</MenuItem>
                </Select>
              )}
            />
            {errors.priority && <span>{errors.priority.message}</span>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status" error={!!errors.status}>
                  <MenuItem value={Status.Todo}>Todo</MenuItem>
                  <MenuItem value={Status.Doing}>Doing</MenuItem>
                  <MenuItem value={Status.Done}>Done</MenuItem>
                </Select>
              )}
            />
            {errors.status && <span>{errors.status.message}</span>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Project</InputLabel>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Project" error={!!errors.projectId}>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.projectId && <FormHelperText error>{errors.projectId.message}</FormHelperText>}
          </FormControl>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

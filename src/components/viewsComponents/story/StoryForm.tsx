import { yupResolver } from "@hookform/resolvers/yup";
import {
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Priority, Status } from "../../../contract/enums";
import { IStory } from "../../../contract/stories.interfaces";
import { useGetAllProjectsQuery } from "../../../redux/apiSlices/projects.api.slice";
import { useCreateStoryMutation, useUpdateStoryMutation } from "../../../redux/apiSlices/stories.api.slices";
import { storySchema } from "./schema/schema";

interface StoryFormData {
  name: string;
  description: string;
  priority: Priority;
  status: Status;
  projectId: string;
  ownerId: string;
}

interface StoryFormProps {
  open: boolean;
  onClose: () => void;
  story?: IStory | null;
  onSave: () => void;
  currentUserId: string;
  selectedProjectId?: string;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxWidth: 700,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto'
};

export default function StoryForm({ open, onClose, story, onSave, currentUserId, selectedProjectId }: StoryFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue
  } = useForm<StoryFormData>({
    resolver: yupResolver(storySchema),
    mode: 'onChange',
    defaultValues: {
      name: story?.name || "",
      description: story?.description || "",
      priority: story?.priority || Priority.Low,
      status: story?.status || Status.Todo,
      projectId: story?.project.id || selectedProjectId || "",
      ownerId: currentUserId,
    },
  });

  useEffect(() => {
   setValue("projectId", selectedProjectId || "");

    if (story) {
      reset({
        name: story.name,
        description: story.description,
        priority: story.priority,
        status: story.status,
        projectId: story.project.id,
        ownerId: currentUserId,
      });
    }

  }, [selectedProjectId, setValue, story]);

  const { data: projects = [], isLoading: projectsLoading } = useGetAllProjectsQuery();
  const [createStory, { isLoading: isCreating }] = useCreateStoryMutation();
  const [updateStory, { isLoading: isUpdating }] = useUpdateStoryMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isLoading = isCreating || isUpdating;
  const isEditMode = !!story;
  const watchedProjectId = selectedProjectId

  const onSubmit = async (data: StoryFormData) => {
    try {
      setSubmitError(null);

      const projectId = data.projectId || selectedProjectId;

      if (!projectId) {
        setSubmitError("Project is required.");
        return;
      }
      const payload = {
        ...data,
        projectId,
        ownerId: currentUserId,
      };

      if (story) {
        await updateStory({ id: story.id, data: payload }).unwrap();
      } else {
        await createStory(payload).unwrap();
      }

      onSave();
      onClose();
      reset();
    } catch (error: any) {
      console.error("Failed to save story:", error);
      setSubmitError(
        error?.data?.message ||
        `Failed to ${isEditMode ? 'update' : 'create'} story. Please try again.`
      );
    }
  };

  const handleClose = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to close?")) {
      return;
    }

    setSubmitError(null);
    reset();
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  const selectedProject = projects.find(p => p.id === watchedProjectId);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="story-form-title"
      aria-describedby="story-form-description"
    >
      <Box sx={modalStyle} onKeyDown={handleKeyDown}>
        <Typography id="story-form-title" variant="h5" component="h2" sx={{ mb: 3 }}>
          {isEditMode ? 'Edit Story' : 'Create Story'}
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {projectsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Story Name *"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={isLoading}
                    autoFocus
                    placeholder="As a user, I want to..."
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
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isLoading}
                    placeholder="Describe the user story in detail, including acceptance criteria..."
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Priority *</InputLabel>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Priority *"
                        error={!!errors.priority}
                        disabled={isLoading}
                      >
                        <MenuItem value={Priority.Low}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            🟢 Low Priority
                          </Box>
                        </MenuItem>
                        <MenuItem value={Priority.Medium}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            🟡 Medium Priority
                          </Box>
                        </MenuItem>
                        <MenuItem value={Priority.High}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            🔴 High Priority
                          </Box>
                        </MenuItem>
                      </Select>
                    )}
                  />
                  {errors.priority && <FormHelperText error>{errors.priority.message}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Status *</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Status *"
                        error={!!errors.status}
                        disabled={isLoading}
                      >
                        <MenuItem value={Status.Todo}>📋 Todo</MenuItem>
                        <MenuItem value={Status.Doing}>⚡ In Progress</MenuItem>
                        <MenuItem value={Status.Done}>✅ Done</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.status && <FormHelperText error>{errors.status.message}</FormHelperText>}
                </FormControl>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Project *</InputLabel>
                <Controller
                  name="projectId"
                  control={control}
                  render={({ field }) => {
                    return (
                    <Select
                      {...field}
                      label="Project *"
                      error={!!errors.projectId}
                      disabled={isLoading}
                    >
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )
                  }}
                />
                {errors.projectId && <FormHelperText error>{errors.projectId.message}</FormHelperText>}
                {selectedProject && (
                  <FormHelperText>
                    Project: {selectedProject.name}
                    {selectedProject.description && ` - ${selectedProject.description}`}
                  </FormHelperText>
                )}
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isValid || isLoading || projects.length === 0}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isLoading
                    ? (isEditMode ? 'Updating...' : 'Creating...')
                    : (isEditMode ? 'Update Story' : 'Create Story')
                  }
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Box>
    </Modal>
  );
}

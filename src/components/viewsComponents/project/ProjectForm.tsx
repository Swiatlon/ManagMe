import { yupResolver } from "@hookform/resolvers/yup";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { IProject } from "../../../contract/projects.interfaces";
import { useCreateProjectMutation, useUpdateProjectMutation } from "../../../redux/apiSlices/projects.api.slice";
import { projectSchema } from "./schema/schema";

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  project?: IProject | null;
  onSave: () => void;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto'
};

export default function ProjectForm({ open, onClose, project, onSave }: ProjectFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    reset,
  } = useForm<{ name: string; description: string }>({
    resolver: yupResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isLoading = isCreating || isUpdating;
  const isEditMode = !!project;

  useEffect(() => {
    if (project) {
      setValue("name", project.name);
      setValue("description", project.description);
    } else {
      reset();
    }
    setSubmitError(null);
  }, [project, setValue, reset]);

  const onSubmit = async (data: { name: string; description: string }) => {
    try {
      setSubmitError(null);

      if (project) {
        await updateProject({ id: project.id, data }).unwrap();
      } else {
        await createProject(data).unwrap();
      }

      onSave();
      onClose();
      reset();
    } catch (error: any) {
      console.error("Failed to save project:", error);
      setSubmitError(
        error?.data?.message ||
        `Failed to ${isEditMode ? 'update' : 'create'} project. Please try again.`
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="project-form-title"
      aria-describedby="project-form-description"
    >
      <Box sx={modalStyle} onKeyDown={handleKeyDown}>
        <Typography id="project-form-title" variant="h5" component="h2" sx={{ mb: 3 }}>
          {isEditMode ? 'Edit Project' : 'Create New Project'}
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  data-cy="name"
                  label="Project Name *"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                  autoFocus
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
                  label="Project Description"
                  multiline
                  rows={4}
                  data-cy="description"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isLoading}
                  placeholder="Describe your project..."
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
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
                disabled={!isValid || isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading
                  ? (isEditMode ? 'Updating...' : 'Creating...')
                  : (isEditMode ? 'Update Project' : 'Create Project')
                }
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}

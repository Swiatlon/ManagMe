import { useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ProjectService, { Project } from "../services/ProjectService";

const schema = Yup.object({
  name: Yup.string().required("Project name is required."),
  description: Yup.string().required("Project description is required."),
});

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
  onSave: () => void;
}

export default function ProjectForm({ open, onClose, project, onSave }: ProjectFormProps) {
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
    },
  });

  useEffect(() => {
    if (project) {
      setValue("name", project.name);
      setValue("description", project.description);
    }
  }, [project, setValue]);

  const onSubmit = async (data: { name: string; description: string }) => {
    try {
      if (project) {
        ProjectService.updateProject({ ...project, ...data });
      } else {
        ProjectService.addProject({ id: Date.now().toString(), ...data });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Failed to save project:", error);
    }
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
                label="Project Name"
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
                label="Project Description"
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Button type="submit" variant="contained">
            Save
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

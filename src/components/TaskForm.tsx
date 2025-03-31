import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { useEffect } from "react";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import StoryService from "../services/StoryService";
import TaskService, { Task, TaskPriority, TaskStatus } from "../services/TaskService";
import UserService from "../services/UserService";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: () => void;
}

const schema = Yup.object({
  name: Yup.string().required("Task name is required."),
  description: Yup.string().required("Description is required."),
  priority: Yup.mixed<TaskPriority>().oneOf(Object.values(TaskPriority)).required("Priority is required."),
  storyId: Yup.string().required("Story selection is required."),
  estimatedHours: Yup.number().min(1, "Estimated hours must be at least 1").required("Estimated hours are required."),
  assignedUserId: Yup.string().nullable(),
  status: Yup.mixed<TaskStatus>().oneOf(Object.values(TaskStatus)).required(),
});

export default function TaskForm({ open, onClose, task, onSave }: TaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      priority: TaskPriority.Medium,
      storyId: "",
      estimatedHours: 0,
      assignedUserId: null,
      status: TaskStatus.Todo,
    },
  });

  const stories = StoryService.getStories();
  const users = UserService.getUsersWithoutAdmin();
  const assignedUserId = watch("assignedUserId");
  const status = watch("status");

  useEffect(() => {
    if (assignedUserId) {
      setValue("status", TaskStatus.Doing);
    } else if (status === TaskStatus.Doing) {
      setValue("status", TaskStatus.Todo);
    }
  }, [assignedUserId, status, setValue]);

  useEffect(() => {
    if (status === TaskStatus.Done) {
      setValue("endDate", new Date().toISOString());
    }
  }, [status, setValue]);

  const onSubmit = (data: any) => {
    const isNewTask = !task;
    const taskData = {
      ...data,
      id: isNewTask ? Date.now().toString() : task.id,
      createdAt: isNewTask ? new Date().toISOString() : task.createdAt,
      startDate: data.assignedUserId && isNewTask ? new Date().toISOString() : task?.startDate || null,
      endDate: task?.status === TaskStatus.Done ? new Date().toISOString() : null,
    };

    if (task) {
      TaskService.updateTask(taskData);
    } else {
      TaskService.addTask(taskData);
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
              <TextField {...field} fullWidth label="Task Name" error={!!errors.name} helperText={errors.name?.message} sx={{ mb: 2 }} />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Description" error={!!errors.description} helperText={errors.description?.message} sx={{ mb: 2 }} />
            )}
          />
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.priority}>
            <InputLabel>Priority</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Priority">
                  <MenuItem value={TaskPriority.Low}>Low</MenuItem>
                  <MenuItem value={TaskPriority.Medium}>Medium</MenuItem>
                  <MenuItem value={TaskPriority.High}>High</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.priority?.message}</FormHelperText>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.storyId}>
            <InputLabel>Story</InputLabel>
            <Controller
              name="storyId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Story">
                  {stories.map((story) => (
                    <MenuItem key={story.id} value={story.id}>
                      {story.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.storyId?.message}</FormHelperText>
          </FormControl>
          <Controller
            name="estimatedHours"
            control={control}
            render={({ field }) => (
              <TextField {...field} type="number" fullWidth label="Estimated Hours" error={!!errors.estimatedHours} helperText={errors.estimatedHours?.message} sx={{ mb: 2 }} />
            )}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Assigned User</InputLabel>
            <Controller
              name="assignedUserId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Assigned User">
                  <MenuItem value="">Unassigned</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status">
                  <MenuItem value={TaskStatus.Todo}>To Do</MenuItem>
                  <MenuItem value={TaskStatus.Doing} disabled={!assignedUserId}>
                    Doing {assignedUserId ? "" : "(assign user first)"}
                  </MenuItem>
                  <MenuItem value={TaskStatus.Done}>Done</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.status?.message}</FormHelperText>
          </FormControl>
          <Button type="submit" variant="contained">
            Save Task
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

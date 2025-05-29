import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, Box, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Button } from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Role, Status, TaskPriority, TaskStatus } from "../../../contract/enums";
import { useGetAllStoriesQuery } from "../../../redux/apiSlices/stories.api.slices";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../../../redux/apiSlices/tasks.api.slice";
import { useGetAllUsersQuery } from "../../../redux/apiSlices/users.api.slice";
import { taskSchema } from "./schema/schema";
import { ITask } from "../../../contract/tasks.interfaces";

interface TaskFormData {
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: string;
  estimatedHours: number;
  assignedUserId: string | null;
  status: TaskStatus;
  startDate?: string | null;
  endDate?: string | null;
}

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: ITask | null;
  onSave: () => void;
}


export default function TaskForm({ open, onClose, task, onSave }: TaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: TaskPriority.Medium,
      storyId: "",
      estimatedHours: 0,
      assignedUserId: null,
      status: TaskStatus.Todo,
      startDate: null,
      endDate: null,
    },
  });

  const { data: stories = [] } = useGetAllStoriesQuery();
  const { data: users = [] } = useGetAllUsersQuery();
  const filteredUsers = users.filter((u) => u.role !== Role.Admin);

  const [addTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const assignedUserId = watch("assignedUserId");
  const status = watch("status");

  useEffect(() => {
    if (task) {
      setValue("name", task.name);
      setValue("description", task.description);
      setValue("priority", task.priority);
      setValue("storyId", task.story.id);
      setValue("estimatedHours", task.estimatedHours);
      setValue("assignedUserId", task.assignedUser?.id ?? null);
      setValue("status", task.status);
    }
  }, [task, setValue]);

  useEffect(() => {
    if (!(assignedUserId) && status === TaskStatus.Doing) {
      setValue("status", TaskStatus.Todo);
    }
  }, [assignedUserId, status, setValue]);

  useEffect(() => {
    if (status === TaskStatus.Done) {
      setValue("endDate", new Date().toISOString());
    }
  }, [status, setValue]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const isNew = !task;

      const payload = {
        ...data,
        startDate: data.status === TaskStatus.Doing ? new Date().toISOString() : task?.startDate,
        endDate: data.status === TaskStatus.Done ? new Date().toISOString() : task?.endDate ?? undefined,
      };

      if (isNew) {
        await addTask(payload).unwrap();
      } else {
        await updateTask({ id:task.id!, data: {
          ...data,
          startDate: data.status === TaskStatus.Doing  ? new Date().toISOString() : task?.startDate,
          endDate: data.status === TaskStatus.Done ? new Date().toISOString() : task?.endDate ?? undefined,
          assignedUserId: data.assignedUserId || null,
        } }).unwrap();
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
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
                  {filteredUsers.map((user) => (
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
          <Button type="submit" variant="contained" fullWidth>
            Save Task
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

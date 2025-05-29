import * as Yup from "yup";
import { TaskPriority, TaskStatus } from "../../../../contract/enums";

export const taskSchema = Yup.object({
  name: Yup.string().required("Task name is required."),
  description: Yup.string().required("Description is required."),
  priority: Yup.mixed<TaskPriority>()
    .oneOf(Object.values(TaskPriority))
    .required("Priority is required."),
  storyId: Yup.string().required("Story selection is required."),
  estimatedHours: Yup.number()
    .min(1, "Estimated hours must be at least 1")
    .required("Estimated hours are required."),
  assignedUserId: Yup.string().nullable().defined(),
  status: Yup.mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus))
    .required("Status is required."),
  startDate: Yup.string().nullable(),
  endDate: Yup.string().nullable(),
});

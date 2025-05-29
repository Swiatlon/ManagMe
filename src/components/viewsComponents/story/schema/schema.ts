import * as Yup from "yup";
import { Priority, Status } from "../../../../contract/enums";

export const storySchema = Yup.object({
  name: Yup.string().required("Story name is required."),
  description: Yup.string().required("Description is required."),
  priority: Yup.mixed<Priority>().oneOf([Priority.Low, Priority.Medium, Priority.High]).required("Priority is required."),
  status: Yup.mixed<Status>().oneOf([Status.Todo, Status.Doing, Status.Done]).required("Status is required."),
  projectId: Yup.string().required("Project selection is required."),
  ownerId: Yup.string().required("Owner ID is required."),
});

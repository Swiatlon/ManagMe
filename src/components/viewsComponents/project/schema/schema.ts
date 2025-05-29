import * as Yup from "yup";

export const projectSchema = Yup.object({
  name: Yup.string().required("Project name is required."),
  description: Yup.string().required("Project description is required."),
});

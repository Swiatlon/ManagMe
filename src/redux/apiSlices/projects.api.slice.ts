import { IProject, ICreateProjectRequest, IUpdateProjectRequest } from "../../contract/projects.interfaces";
import Api from "../api";
import { extendedOnQueryStartedWithNotifications } from "../utils/JWT/extendedOnQueryStarted";

export const projectSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getAllProjects: builder.query<IProject[], void>({
      query: () => ({
        url: '/projects',
      }),
      providesTags: ['projectsGet'],
    }),

    getProjectById: builder.query<IProject, string>({
      query: id => `/projects/${id}`,
    }),

    createProject: builder.mutation<IProject, ICreateProjectRequest>({
      query: project => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['projectsGet', 'storiesGet'],
    }),

    updateProject: builder.mutation<IProject, IUpdateProjectRequest>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['projectsGet', 'storiesGet'],
    }),

    deleteProject: builder.mutation<{ id: string }, string>({
      query: id => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Deleted project',
      }),
      invalidatesTags: ['projectsGet', 'storiesGet'],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectSlice;

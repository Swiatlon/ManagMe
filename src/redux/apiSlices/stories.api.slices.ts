import { IStory, ICreateStoryRequest, IUpdateStoryRequest } from "../../contract/stories.interfaces";
import Api from "../api";
import { extendedOnQueryStartedWithNotifications } from "../utils/JWT/extendedOnQueryStarted";

export const storySlice = Api.injectEndpoints({
  endpoints: builder => ({
    getAllStories: builder.query<IStory[], void>({
      query: () => ({
        url: '/stories',
      }),
      providesTags: ['storiesGet'],
    }),

    getStoryById: builder.query<IStory, string>({
      query: id => `/stories/${id}`,
    }),

    createStory: builder.mutation<IStory, ICreateStoryRequest>({
      query: story => ({
        url: '/stories',
        method: 'POST',
        body: story,
      }),
      invalidatesTags: ['storiesGet'],
    }),

    updateStory: builder.mutation<IStory, IUpdateStoryRequest>({
      query: ({ id, data }) => ({
        url: `/stories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['storiesGet'],
    }),

    deleteStory: builder.mutation<{ id: string }, string>({
      query: id => ({
        url: `/stories/${id}`,
        method: 'DELETE',
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Deleted story',
      }),
      invalidatesTags: ['storiesGet'],
    }),
  }),
});

export const {
  useGetAllStoriesQuery,
  useGetStoryByIdQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
} = storySlice;

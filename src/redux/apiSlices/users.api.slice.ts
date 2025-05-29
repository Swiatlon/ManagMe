import { IUser, ICreateUserRequest, IUpdateUserRequest } from "../../contract/users.interfaces";
import Api from "../api";
import { extendedOnQueryStartedWithNotifications } from "../utils/JWT/extendedOnQueryStarted";

export const userSlice = Api.injectEndpoints({
  endpoints: builder => ({
    getAllUsers: builder.query<IUser[], void>({
      query: () => ({
        url: '/users',
      }),
      providesTags: ['usersGet'],
    }),

    getUserById: builder.query<IUser, string>({
      query: id => `/users/${id}`,
    }),

    createUser: builder.mutation<IUser, ICreateUserRequest>({
      query: user => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['usersGet'],
    }),

    updateUser: builder.mutation<IUser, IUpdateUserRequest>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['usersGet'],
    }),

    deleteUser: builder.mutation<{ id: string }, string>({
      query: id => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Deleted user',
      }),
      invalidatesTags: ['usersGet'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userSlice;

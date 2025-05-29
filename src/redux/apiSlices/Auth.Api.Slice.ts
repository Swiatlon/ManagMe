import { ILoginResponse, ILoginRequest, IRegisterResponse, IRegisterRequest, ILogoutResponse, IRefreshResponse } from "../../contract/auth.interfaces";
import { Role } from "../../contract/enums";
import Api from "../api";
import {  setCredentials, logOut } from "../statesSlices/auth.state.slice";
import { extendedOnQueryStartedWithNotifications } from "../utils/JWT/extendedOnQueryStarted";

export interface IDecodedJwt {
  accountId: number;
  role: Role;
  exp?: number;
  iat?: number;
}

const authApiSlice = Api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Login successful!',
        successCallback: (data, dispatch) => {
          dispatch(setCredentials({
            accessToken: data.accessToken,
            user: data.user
          }));
        },
      }),
    }),

    register: builder.mutation<IRegisterResponse, IRegisterRequest>({
      query: newUser => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Registration successful!',
        successCallback: (data, dispatch) => {
          dispatch(setCredentials({
            accessToken: data.accessToken,
            user: data.user
          }));
        },
      }),
    }),

    sendLogout: builder.mutation<ILogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Logout successful',
        successCallback: (_data, dispatch) => {
          dispatch(logOut());
          dispatch(Api.util.resetApiState());
        },
      }),
    }),

    refresh: builder.mutation<IRefreshResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(setCredentials({
          accessToken: data.accessToken,
          user: data.user
        }));
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendLogoutMutation,
  useRefreshMutation,
} = authApiSlice;

export default authApiSlice;

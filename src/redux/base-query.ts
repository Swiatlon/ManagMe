import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { enqueueSnackbar } from 'notistack';
import qs from 'qs';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface IAuthState {
  token: string | null;
  expDate: string | null;
}

const baseQuery = fetchBaseQuery({
  baseUrl: `http://localhost:3000`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as { authSlice: IAuthState }).authSlice;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
  paramsSerializer: params =>
    qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false,
    }),
});

export const baseQueryWithReauth: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.meta?.request.url.includes('auth/refresh') && result.error?.status === 403) {
    enqueueSnackbar(`You've reached limit of logged time, please login again!`, { variant: 'error' });
    return result;
  }

  return result;
};

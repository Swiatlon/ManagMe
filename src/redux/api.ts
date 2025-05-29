import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './base-query';

const Api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: _builder => ({}),
  tagTypes: [
    'projectsGet',
    'storiesGet',
    'tasksGet',
    'usersGet',
  ],
});

export default Api;

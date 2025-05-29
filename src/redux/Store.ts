import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import Api from './api';
import authSlice from './statesSlices/auth.state.slice';
import viewSlice from './statesSlices/view.state.slice';

export const store = configureStore({
  reducer: {
    [Api.reducerPath]: Api.reducer,
    authSlice,
    viewSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(Api.middleware),
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;

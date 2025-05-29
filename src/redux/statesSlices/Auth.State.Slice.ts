import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { parseJwt } from '../utils/JWT/jwt.utils';
import { IUser } from '../../contract/users.interfaces';

export interface IAuthState {
  token: string | null;
  expDate: string | null;
  user: IUser | null;
}

const initialState: IAuthState = {
  token: null,
  expDate: null,
  user: null,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setCredentials: {
      prepare: ({ accessToken, user }: { accessToken: string; user?: IUser }) => {
        localStorage.setItem('accessToken', accessToken);

        const decoded = parseJwt(accessToken);
        const expDate = decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null;

        const userData = user || null;

        return {
          payload: {
            token: accessToken,
            expDate,
            user: userData,
          }
        };
      },

      reducer: (state, action: PayloadAction<IAuthState>) => {
        const { token, expDate, user } = action.payload;

        state.token = token;
        state.expDate = expDate;
        state.user = user;
      },
    },

    logOut: state => {
      localStorage.removeItem('accessToken');
      state.token = null;
      state.expDate = null;
      state.user = null;
    },
  },
  selectors: {
    selectCurrentToken: state => state.token,
    selectTokenExpirationTime: state => state.expDate,
    selectCurrentUser: state => state.user,
    selectUserRoles: state => state.user?.role,
    selectAccountId: state => state.user?.id,
    selectUserId: state => state.user?.id,
    selectUserName: state => state.user ? `${state.user.firstName} ${state.user.lastName}` : null,
    selectUserRole: state => state.user?.role,
  },
});

export const {
  selectCurrentToken,
  selectTokenExpirationTime,
  selectCurrentUser,
  selectUserRoles,
  selectAccountId,
  selectUserId,
  selectUserName,
  selectUserRole
} = authSlice.selectors;

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

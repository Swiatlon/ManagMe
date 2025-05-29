import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logOut, setCredentials } from '../redux/statesSlices/auth.state.slice';
import { useRefreshMutation } from '../redux/apiSlices/auth.api.slice';
import { useEffectOnce } from './useEffect';
import { useTypedDispatch } from './useStore.Hooks';

export const useVerifySession = (token: string | null) => {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const [isVerifying, setIsVerifying] = useState(true);
  const [refresh, { isLoading }] = useRefreshMutation();

  useEffectOnce(() => {
    if (!token) {
      setIsVerifying(false);
      return;
    }

    refresh()
      .unwrap()
      .then(result => {
        dispatch(setCredentials({ accessToken: result.accessToken, user: result.user }));
      })
      .catch(() => {
        dispatch(logOut());
        navigate('/login');
      })
      .finally(() => {
        setIsVerifying(false);
      });
  });
  return { isLoading: isLoading || isVerifying };
};

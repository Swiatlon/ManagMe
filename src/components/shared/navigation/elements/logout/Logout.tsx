import { useEffect } from 'react';
import { useSendLogoutMutation } from '../../../../../redux/apiSlices/auth.api.slice';

function Logout() {
  const [sendLogout] = useSendLogoutMutation();

  useEffect(() => {
    sendLogout();
  }, []);

  return null;
}

export default Logout;

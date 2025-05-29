import { Avatar, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import UserIcon from '../../../../../assets/icons/exampleUserIcon.png';
import { selectCurrentUser } from '../../../../../redux/statesSlices/auth.state.slice';

function UserProfile() {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return null;
  }

  return (
    <Box className="UserProfileContainer">
      <Avatar
        alt={`${user.firstName} ${user.lastName}`}
        className="Avatar IncreaseSizeAnimation"
        src={UserIcon}
      >
        {`${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`}
      </Avatar>
      <Box className="UserInfoDisplay">
        <Typography className="UsernameText" fontWeight="bold" variant="body1">
          {`${user.firstName} ${user.lastName}`}
      </Typography>
        <Typography className="userRoleText" variant="body2" sx={{ color: 'white' }}>
          Role: {user.role}
        </Typography>
      </Box>
    </Box>
  );
}

export default UserProfile;

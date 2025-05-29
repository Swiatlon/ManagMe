import BookIcon from '@mui/icons-material/Book';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../../contract/enums';

export const useMenuItems = () => {
  return [
    {
      id: uuidv4(),
      text: 'projects',
      icon: <DashboardIcon />,
      availableForRoles: [Role.Admin, Role.Developer, Role.DevOps],
      linkTo: 'projects',
    },
    {
      id: uuidv4(),
      text: 'stories',
      linkTo: 'stories',
      icon: <PersonIcon />,
      availableForRoles: [Role.Admin, Role.Developer, Role.DevOps],
    },
    {
      id: uuidv4(),
      text: 'tasks',
      linkTo: 'tasks',
      icon: <BookIcon />,
      availableForRoles: [Role.Admin, Role.Developer, Role.DevOps],
    },
    {
      id: uuidv4(),
      text: 'logout',
      icon: <LogoutIcon />,
      linkTo: 'logout',
    },
  ];
};

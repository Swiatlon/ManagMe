import { Outlet } from 'react-router-dom';
import './styles/PostAuthLayout.scss';
import { Box } from '@mui/material';
import { useMenuItems } from './constants/MenuItems';
import Navigation from '../../components/shared/navigation/Navigation';
import AppBar from '../../components/shared/appBar/AppBar';

function PostAuthLayout() {
  const menuItems = useMenuItems();

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation menuItems={menuItems} />
      <Box sx={{ width: '100%', position: 'relative' }}>
        <AppBar />
        <Box className="ContentContainer">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default PostAuthLayout;

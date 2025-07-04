import MenuIcon from '@mui/icons-material/Menu';
import { Box, Typography } from '@mui/material';
import AppBarConfig from './elements/AppBarConfig';
import './styles/AppBar.scss';
import { useTypedDispatch } from '../../../hooks/useStore.Hooks';
import { useTypedMatches } from '../../../hooks/useTypedMatches.Hook';
import { toggleDrawer } from '../../../redux/statesSlices/view.state.slice';

function AppBar() {
  const dispatch = useTypedDispatch();
  const matches = useTypedMatches();

  const currentMatch = matches.find(match => match.handle);
  const pageTitle = currentMatch?.handle?.navigation?.text;

  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
  };

  return (
    <Box className="AppBarBox">
      <MenuIcon fontSize="medium" onClick={handleToggleDrawer} className="AppBarHamburger" />
      <Typography variant="h5">{pageTitle}</Typography>
      <AppBarConfig />
    </Box>
  );
}

export default AppBar;

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Divider, List, Collapse } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '../../../assets/images/logo.png';
import UserProfile from './elements/headerItems/UserProfile';
import MenuItemComponent from './elements/menuItems/MenuItem';
import { Drawer } from './styles/Styled';
import type { INavigationProps, OpenMenuItemsStateType } from './types/types';
import { useTypedDispatch, useTypedSelector } from '../../../hooks/useStore.Hooks';
import { selectCurrentToken, selectUserRoles } from '../../../redux/statesSlices/auth.state.slice';
import { selectIsDrawerOpen, toggleDrawer, setDrawerState } from '../../../redux/statesSlices/view.state.slice';

function Navigation({ menuItems }: INavigationProps) {
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const isMenuFullWidth = useMediaQuery('(max-width:910px)');

  const token = useTypedSelector(selectCurrentToken);
  const isOpen = useTypedSelector(selectIsDrawerOpen);
  const userRole = useTypedSelector(selectUserRoles);

  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
  };

  const [openMenuItems, setOpenMenuItems] = useState<OpenMenuItemsStateType>(() =>
    menuItems.reduce<OpenMenuItemsStateType>((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
  );

  const onNavigate = useCallback(() => {
    if (isMenuFullWidth) {
      handleToggleDrawer();
    }
  }, [navigate, isMenuFullWidth]);

  const onToggleSubmenu = useCallback((id: string) => {
    setOpenMenuItems(prevState => ({ ...prevState, [id]: !prevState[id] }));
  }, []);

  useEffect(() => {
    dispatch(setDrawerState(!isMenuFullWidth));
  }, [isMenuFullWidth, dispatch]);

  return (
    <Drawer component="nav" isOpen={isOpen}>
      <Box className="ContentContainer">
        <Box className="HeaderContainer">
          <Box className="LogoContainer">
            <Box className="Logo IncreaseSizeAnimation" component="img" src={Logo} />
          </Box>
          <MenuIcon className="MenuToggleIcon IncreaseSizeAnimation" fontSize="medium" onClick={handleToggleDrawer} />
        </Box>

        {Boolean(token && token.length > 0) && <UserProfile />}
        <Divider className="Divider" variant="middle" />

        <List className="List" component="ul">
          {menuItems.map(item => {
            if (userRole && item.availableForRoles && !item.availableForRoles.includes(userRole)) {
              return null;
            }

            return (
              <Box key={item.id}>
                <MenuItemComponent
                  isOpen={openMenuItems[item.id]}
                  item={item}
                  onNavigate={onNavigate}
                  onToggleSubmenu={item.children ? onToggleSubmenu : undefined}
                />
                {item.children ? (
                  <Collapse in={openMenuItems[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map(subItem => {
                        if (
                          userRole && subItem.availableForRoles && !subItem.availableForRoles.includes(userRole)
                        ) {
                          return null;
                        }

                        return <MenuItemComponent isChildren item={subItem} key={subItem.id} onNavigate={onNavigate} />;
                      })}
                    </List>
                  </Collapse>
                ) : null}
              </Box>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}

export default Navigation;

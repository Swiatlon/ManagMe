import { NavLink } from 'react-router-dom';
import { ListItemButton } from '@mui/material';
import concatClasses from 'classnames';
import MenuItemContent from './MenuItemContent';
import type { IMenuItemProps } from '../../types/types';
import { useTypedSelector } from '../../../../../hooks/useStore.Hooks';
import { selectIsDrawerOpen } from '../../../../../redux/statesSlices/view.state.slice';

function MenuItemComponent({ item, onToggleSubmenu, isOpen, isChildren, onNavigate }: IMenuItemProps) {
  const isOpenDrawer = useTypedSelector(selectIsDrawerOpen);

  const className = concatClasses('ListItem IncreaseSizeAnimation', {
    ListItemChildren: isChildren,
  });

  const onClick = () => {
    if (!item.linkTo) {
      onToggleSubmenu?.(item.id);
    }
  };

  if (item.linkTo) {
    return (
      <ListItemButton
        component={NavLink}
        to={item.linkTo}
        className={className}
        data-cy={item.text}
        onClick={() => {
          onNavigate();
        }}
      >
        <MenuItemContent item={item} isOpenDrawer={isOpenDrawer} isOpen={isOpen} />
      </ListItemButton>
    );
  }

  return (
    <ListItemButton className={className} onClick={onClick}>
      <MenuItemContent item={item} isOpenDrawer={isOpenDrawer} isOpen={isOpen} />
    </ListItemButton>
  );
}

export default MenuItemComponent;

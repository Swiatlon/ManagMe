import { Drawer, List, ListItemButton, ListItemText, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import UserService from "../services/UserService";

const drawerWidth = 240;

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = UserService.getUser();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          <ListItemButton sx={{ paddingBottom: 2 }}>
            <Typography variant="h6">
              {user.firstName} {user.lastName}
            </Typography>
          </ListItemButton>

          <ListItemButton component={Link} to="/projects">
            <ListItemText primary="Projects" />
          </ListItemButton>

          <ListItemButton component={Link} to="/stories">
            <ListItemText primary="Stories" />
          </ListItemButton>

          <ListItemButton component={Link} to="/tasks">
            <ListItemText primary="Tasks" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 0 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              ManagMe
            </Typography>
          </Toolbar>
        </AppBar>

        {children}
      </Box>
    </Box>
  );
}

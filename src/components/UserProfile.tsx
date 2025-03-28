import { Box, Typography } from "@mui/material";
import UserService from "../services/UserService";

export default function UserProfile() {
  const user = UserService.getUser();

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Logged in as:</Typography>
      <Typography variant="body1">{user.firstName} {user.lastName}</Typography>
      <Typography variant="body2">ID: {user.id}</Typography>
    </Box>
  );
}

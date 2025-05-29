import { Container, Box, Typography, Card, CardContent } from "@mui/material";
import { TaskStatus } from "../../../../contract/enums";
import { ITask } from "../../../../contract/tasks.interfaces";
import { IUser } from "../../../../contract/users.interfaces";

interface TaskKanbanProps {
  tasks: ITask[];
  users: IUser[];
}

export default function TaskKanban({ tasks, users }: TaskKanbanProps) {
  const columns = [
    { status: TaskStatus.Todo, title: "Todo", color: "#FFEBEE" },
    { status: TaskStatus.Doing, title: "Doing", color: "#E3F2FD" },
    { status: TaskStatus.Done, title: "Done", color: "#E8F5E9" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
        {columns.map(({ status, title, color }) => (
          <Box key={status} sx={{ flex: 1, bgcolor: color, p: 2, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
              {title}
            </Typography>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <Card key={task.id} sx={{ mb: 2, boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="body1" fontWeight="bold">
                      {task.name}
                    </Typography>
                    {task?.assignedUser?.id && (
                      <Typography variant="body2" color="text.secondary">
                        Assigned to:
                        {users.find((user) => user.id === task?.assignedUser?.id)?.firstName}{" "}
                        {users.find((user) => user.id === task?.assignedUser?.id)?.lastName}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
          </Box>
        ))}
      </Box>
    </Container>
  );
}

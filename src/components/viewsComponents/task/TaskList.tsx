import { useState } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import {
  useGetAllTasksQuery,
  useDeleteTaskMutation,
  useCompleteTaskMutation
} from "../../../redux/apiSlices/tasks.api.slice";
import { useGetAllUsersQuery } from "../../../redux/apiSlices/users.api.slice";
import TaskForm from "./TaskForm";
import TaskHeader from "./elements/TaskHeader";
import TaskEmptyState from "./elements/TaskEmptyState";
import TaskTable from "./elements/TaskTable";
import { ITask } from "../../../contract/tasks.interfaces";
import { TaskStatus, TaskPriority } from "../../../contract/enums";
import TaskFilters from "./elements/TaskFilters";
import TaskKanban from "./elements/TaskKanban";
import { useGetAllStoriesQuery } from "../../../redux/apiSlices/stories.api.slices";

export default function TaskList() {
  const { data: tasks = [], isLoading: loadingTasks, refetch } = useGetAllTasksQuery();
  const { data: users = [], isLoading: loadingUsers } = useGetAllUsersQuery();
  const { data: stories = [], isLoading: loadingStories } = useGetAllStoriesQuery();

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [completeTask] = useCompleteTaskMutation();

  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState<ITask | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">("all");
  const [selectedUser, setSelectedUser] = useState<string | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | "all">("all");
  const [selectedStory, setSelectedStory] = useState<string | "all">("all");

  const handleAdd = () => {
    setEditTask(null);
    setOpenModal(true);
  };

  const handleEdit = (task: ITask) => {
    setEditTask(task);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
  };

  const handleComplete = async (id: string) => {
    await completeTask(id);
  };

  const handleSave = () => {
    setOpenModal(false);
    refetch();
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (selectedStatus === "all" || task.status === selectedStatus) &&
      (selectedUser === "all" || task?.assignedUser?.id === selectedUser) &&
      (selectedPriority === "all" || task.priority === selectedPriority) &&
      (selectedStory === "all" || task.story?.id === selectedStory)
    );
  });

  if (loadingTasks || loadingUsers || loadingStories) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <TaskHeader onAdd={handleAdd} />
      <TaskFilters
        users={users}
        stories={stories}
        selectedStatus={selectedStatus}
        selectedUser={selectedUser}
        selectedPriority={selectedPriority}
        selectedStory={selectedStory}
        onStatusChange={setSelectedStatus}
        onUserChange={setSelectedUser}
        onPriorityChange={setSelectedPriority}
        onStoryChange={setSelectedStory}
      />
      {filteredTasks.length === 0 ? (
        <TaskEmptyState onAdd={handleAdd} />
      ) : (
        <>
          <TaskTable
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
            users={users}
            stories={stories}
            isDeleting={isDeleting}
          />
          <TaskKanban tasks={filteredTasks} users={users} />
        </>
      )}
      {openModal && (
        <TaskForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          task={editTask}
          onSave={handleSave}
        />
      )}
    </Container>
  );
}

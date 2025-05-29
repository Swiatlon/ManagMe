import TaskList from "../../components/viewsComponents/task/TaskList";

export const tasksConfig = {
  path: 'tasks',
  handle: {
    navigation: {
      text: 'Tasks',
    },
  },
  element: <TaskList />,
};

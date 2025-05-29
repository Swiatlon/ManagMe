import ProjectList from "../../components/viewsComponents/project/ProjectList";

export const indexPostAuthConfig = {
  index: true,
  path: '*',
  handle: {
    navigation: {
      text: 'projects',
    },
  },
  element: <ProjectList />,
};

import StoryList from "../../components/viewsComponents/story/StoryList";

export const storiesConfig = {
  path: 'stories',
  handle: {
    navigation: {
      text: 'Stories',
    },
  },
  element: <StoryList />,
};

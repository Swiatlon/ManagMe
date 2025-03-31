import {  Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProjectList from "./components/ProjectList";
import StoryList from "./components/StoryList";
import TaskList from "./components/TaskList";

function App() {
  return (
      <Layout>
        <Routes>
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/stories" element={<StoryList />} />
          <Route path="/tasks" element ={<TaskList/>} />
        </Routes>
      </Layout>
  );
}

export default App;

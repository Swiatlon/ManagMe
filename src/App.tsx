import {  Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProjectList from "./components/ProjectList";
import StoryList from "./components/StoryList";

function App() {
  return (
      <Layout>
        <Routes>
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/stories" element={<StoryList />} />
        </Routes>
      </Layout>
  );
}

export default App;

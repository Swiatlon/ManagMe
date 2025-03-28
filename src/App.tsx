// App.tsx
import { Routes, Route } from 'react-router-dom'
import ProjectView from './pages/ProjectView'
import ListView from './pages/ListView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path="/crud" element={<ProjectView />} />
    </Routes>
  )
}

export default App

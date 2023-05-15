import "./App.css";

import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import AllJoinedProjectsPage from "./pages/AllJoinedProjectsPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/projects" element={<AllJoinedProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;

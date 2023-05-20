import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/AuthPage/LoginPage";
import SignUpPage from "./pages/AuthPage/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import PersonalNotificationsPage from "./pages/NotificationPage/PersonalNotificationsPage";
import MyProfilePage from "./pages/MyProfilePage/MyProfilePage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />

        <Route path="/me">
          <Route index element={<MyProfilePage />} />
          <Route path="notifications" element={<PersonalNotificationsPage />} />
        </Route>

        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;

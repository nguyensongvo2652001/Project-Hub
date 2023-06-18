import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/AuthPage/LoginPage";
import SignUpPage from "./pages/AuthPage/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import PersonalNotificationsPage from "./pages/NotificationPage/PersonalNotificationsPage";
import MyProfilePage from "./pages/MyProfilePage/MyProfilePage";
import PersonalStatPage from "./pages/PersonalStatPage/PersonalStatPage";
import ProjectDashboardPage from "./pages/ProjectDashboardPage/ProjectDashboardPage";
import ProjectMemberPage from "./pages/ProjectMembersPage/ProjectMemberPage";
import ProjectNotificationPage from "./pages/ProjectNotificationPage/ProjectNotificationPage";
import ProjectSettingsPage from "./pages/ProjectSettingsPage/ProjectSettingsPage";
import ProjectStatPage from "./pages/ProjectStatPage/ProjectStatPage";
import ForbiddenPage from "./pages/ForbiddenPage/ForbiddenPage";
import TaskDetail from "./components/TaskDetail/TaskDetail";
import TaskPage from "./pages/TaskPage/TaskPage";
import UserPublicPage from "./pages/UserPublicPage/UserPublicPage";
import ProjectPublicDetailPage from "./pages/ProjectPublicDetailPage/ProjectPublicDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage";

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
          <Route path="stat" element={<PersonalStatPage />} />
        </Route>

        <Route path="/projects">
          <Route index element={<ProjectsPage />} />
          <Route path=":id">
            <Route index element={<ProjectDashboardPage />} />
            <Route path="publicDetail" element={<ProjectPublicDetailPage />} />
            <Route path="members" element={<ProjectMemberPage />} />
            <Route path="notifications" element={<ProjectNotificationPage />} />
            <Route path="settings" element={<ProjectSettingsPage />} />
            <Route path="stat" element={<ProjectStatPage />} />
            <Route path="tasks">
              <Route path=":taskId" element={<TaskPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/users">
          <Route path=":id" element={<UserPublicPage />} />
        </Route>

        <Route path="/search" element={<SearchResultsPage />} />

        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ResumeManagement from "./pages/ResumeManagement";
import ResumeBuilder from "./pages/ResumeBuilder";
import TemplateSelectionPage from "./pages/TemplateSelectionPage";
import ResumePreviewPage from "./pages/ResumePreviewPage";
import PublicResumeView from "./pages/PublicResumeView";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/signup" replace />}
      />

      {/* Public Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/view/:id" element={<PublicResumeView />} />
      <Route path="/share/:id" element={<PublicResumeView />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resumes"
        element={
          <ProtectedRoute>
            <ResumeManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume/new"
        element={
          <ProtectedRoute>
            <TemplateSelectionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume/:id/edit"
        element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume/:id/preview"
        element={
          <ProtectedRoute>
            <ResumePreviewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
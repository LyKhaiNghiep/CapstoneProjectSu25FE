import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Restrooms from "../pages/Restrooms";
import Shifts from "../pages/Shifts";
import Floors from "../pages/Floors";
import UserManagement from "../pages/UserManagement";
import ReportManagement from "../pages/ReportManagement";
import TrashBinList from "../pages/TrashBinList";
import NotFound from "../pages/NotFound";
import { useAuth } from "../contexts/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "restrooms",
        element: (
          <ProtectedRoute>
            <Restrooms />
          </ProtectedRoute>
        ),
      },
      {
        path: "shifts",
        element: (
          <ProtectedRoute>
            <Shifts />
          </ProtectedRoute>
        ),
      },
      {
        path: "floors",
        element: (
          <ProtectedRoute>
            <Floors />
          </ProtectedRoute>
        ),
      },
      {
        path: "trash",
        element: (
          <ProtectedRoute>
            <TrashBinList />
          </ProtectedRoute>
        ),
      },
      
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-management",
        element: (
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "report-management",
        element: (
          <ProtectedRoute>
            <ReportManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

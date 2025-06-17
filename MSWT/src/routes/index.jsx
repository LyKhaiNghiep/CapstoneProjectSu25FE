import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Restrooms from "../pages/Restrooms";
import RestroomDetails from "../pages/RestroomDetails";
import EditRestroom from "../pages/EditRestroom";
import AddRestroom from "../pages/AddRestroom";
import NotFound from "../pages/NotFound";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  // Add your authentication logic here
  const isAuthenticated = true; // Set to true for now to test

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
        element: <Navigate to="/restrooms" replace />,
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
        path: "restrooms/add",
        element: (
          <ProtectedRoute>
            <AddRestroom />
          </ProtectedRoute>
        ),
      },
      {
        path: "restrooms/:id",
        element: (
          <ProtectedRoute>
            <RestroomDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "restrooms/:id/edit",
        element: (
          <ProtectedRoute>
            <EditRestroom />
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
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

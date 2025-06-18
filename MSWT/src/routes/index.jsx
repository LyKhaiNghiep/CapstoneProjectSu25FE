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

// We'll use the auth context in RootLayout instead of here
// This makes routing simpler and handles authentication at layout level

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
        element: <Dashboard />,
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
        element: <Profile />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "report-management",
        element: <ReportManagement />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

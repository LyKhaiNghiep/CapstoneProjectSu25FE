import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Toilets from "../pages/Toilets";
import UserManagement from "../pages/UserManagement";
import ReportManagement from "../pages/ReportManagement";
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
        path: "toilets",
        element: <Toilets />,
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

import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Pages that don't require authentication
  const publicPages = ['/login', '/register'];
  const isPublicPage = publicPages.includes(location.pathname);
  
  // If not authenticated and trying to access protected page, redirect to login
  if (!isAuthenticated && !isPublicPage) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  // If on public page (login/register), show without layout
  if (isPublicPage) {
    return <Outlet />;
  }

  // Show with sidebar and layout for authenticated pages
  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "256px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
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

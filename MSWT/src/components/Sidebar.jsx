import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineTrash,
  HiOutlineCog,
  HiOutlineOfficeBuilding,
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLogout,
} from "react-icons/hi";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
    }
  };

  const menuItems = [
    {
      title: "Danh sách báo cáo",
      path: "/report-management",
      icon: HiOutlineChartBar,
    },
    {
      title: "Danh sách người dùng",
      path: "/user-management",
      icon: HiOutlineUsers,
    },
    {
      title: "Danh sách thùng rác",
      path: "/trash",
      icon: HiOutlineTrash,
    },
    {
      title: "Cảm biến",
      path: "/sensors",
      icon: HiOutlineCog,
    },
    {
      title: "Các tầng",
      path: "/floors",
      icon: HiOutlineOfficeBuilding,
    },
    {
      title: "Nhà vệ sinh",
      path: "/toilets",
      icon: HiOutlineHome,
    },
    {
      title: "Lịch làm việc",
      path: "/schedule",
      icon: HiOutlineCalendar,
    },
    {
      title: "Ca làm việc",
      path: "/shifts",
      icon: HiOutlineClock,
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "256px",
        height: "100vh",
        backgroundColor: "white",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div style={{ padding: "32px 24px" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "black",
            margin: 0,
          }}
        >
          MSWT
        </h1>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "0 20px" }}>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            gap: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li
                key={index}
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                <Link
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    borderRadius: "8px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    backgroundColor: isActive ? "#d1d5db" : "transparent",
                    color: "#000000",
                    marginBottom: "4px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "16px",
                      color: "#000000",
                    }}
                  />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div
        style={{
          padding: "24px",
          borderTop: "1px solid #e5e7eb",
          marginTop: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "white",
                fontWeight: "500",
                fontSize: "16px",
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div style={{ marginLeft: "16px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#000000",
                margin: 0,
                marginBottom: "2px",
              }}
            >
              {user?.name || 'Administrator'}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: 0,
              }}
            >
              {user?.role || 'admin'}
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "transparent",
            color: "#dc2626",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#fef2f2";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
        >
          <HiOutlineLogout
            style={{
              width: "20px",
              height: "20px",
              marginRight: "12px",
            }}
          />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

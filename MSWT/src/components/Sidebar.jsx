import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  HiOutlineBell,
} from "react-icons/hi";
import { HiOutlineX } from "react-icons/hi";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      title: "Danh sách nhân viên",
      path: "/user-management",
      icon: HiOutlineUsers,
    },
    {
      title: "Danh sách thùng rác",
      path: "/trash",
      icon: HiOutlineTrash,
    },
    {
      title: "Các tầng",
      path: "/floors",
      icon: HiOutlineOfficeBuilding,
    },
          {
        title: "Khu vực",
        path: "/areas",
        icon: HiOutlineOfficeBuilding,
      },
    {
      title: "Nhà vệ sinh",
      path: "/restrooms",
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
      {/* Header với MSWT và Icon thông báo */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 20px",
        borderBottom: "2px solid #f1f5f9",
        backgroundColor: "white"
      }}>
        {/* MSWT Logo */}
        <div 
          onClick={() => navigate('/dashboard')}
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#FF5B27",
            cursor: "pointer",
            letterSpacing: "1px",
            textShadow: "0 2px 4px rgba(255, 91, 39, 0.2)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.textShadow = "0 4px 8px rgba(255, 91, 39, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.textShadow = "0 2px 4px rgba(255, 91, 39, 0.2)";
          }}
        >
          MSWT
        </div>

        {/* Icon thông báo */}
        <div 
          onClick={() => navigate('/notifications')}
          style={{
            position: "relative",
            padding: "8px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: "2px solid transparent"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#FF5B27";
            e.target.style.borderColor = "#FF5B27";
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 4px 12px rgba(255, 91, 39, 0.3)";
            // Change icon color to white on hover
            const icon = e.target.querySelector('svg');
            if (icon) icon.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.borderColor = "transparent";
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
            // Reset icon color
            const icon = e.target.querySelector('svg');
            if (icon) icon.style.color = "#FF5B27";
          }}
        >
          <HiOutlineBell 
            style={{ 
              width: "24px", 
              height: "24px", 
              color: "#FF5B27",
              transition: "color 0.3s ease"
            }} 
          />
          {/* Badge cho số thông báo chưa đọc */}
          <div style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "8px",
            height: "8px",
            backgroundColor: "#ef4444",
            borderRadius: "50%",
            border: "2px solid white"
          }} />
        </div>
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

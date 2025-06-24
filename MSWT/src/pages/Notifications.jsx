import React, { useState } from 'react';
import { 
  HiOutlineBell, 
  HiOutlineCheck, 
  HiOutlineX, 
  HiOutlineTrash,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle
} from "react-icons/hi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Báo cáo mới từ Nguyễn Văn A",
      message: "Thùng rác T1-01 đã đầy và cần được xử lý ngay",
      type: "warning", // info, success, warning, error
      time: "2 phút trước",
      read: false,
      priority: "high"
    },
    {
      id: 2,
      title: "Hoàn thành bảo trì",
      message: "Thùng rác T2-03 đã được bảo trì và hoạt động bình thường",
      type: "success",
      time: "15 phút trước",
      read: false,
      priority: "normal"
    },
    {
      id: 3,
      title: "Nhân viên mới được thêm",
      message: "Trần Thị B đã được thêm vào hệ thống với vai trò Công nhân",
      type: "info",
      time: "1 giờ trước",
      read: true,
      priority: "normal"
    },
    {
      id: 4,
      title: "Cập nhật lịch làm việc",
      message: "Lịch làm việc tuần này đã được cập nhật, vui lòng kiểm tra",
      type: "info",
      time: "2 giờ trước",
      read: true,
      priority: "low"
    },
    {
      id: 5,
      title: "Lỗi hệ thống",
      message: "Phát hiện lỗi kết nối với sensor thùng rác T3-05",
      type: "error",
      time: "3 giờ trước",
      read: false,
      priority: "high"
    },
    {
      id: 6,
      title: "Báo cáo tuần đã sẵn sàng",
      message: "Báo cáo tổng hợp tuần 12 đã được tạo và sẵn sàng xem",
      type: "success",
      time: "1 ngày trước",
      read: true,
      priority: "normal"
    }
  ]);

  const [filter, setFilter] = useState("all"); // all, unread, read

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <HiOutlineCheckCircle className="text-green-500" />;
      case "warning":
        return <HiOutlineExclamationCircle className="text-yellow-500" />;
      case "error":
        return <HiOutlineExclamationCircle className="text-red-500" />;
      default:
        return <HiOutlineInformationCircle className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return { 
          bg: "#dcfce7", 
          border: "#bbf7d0",
          icon: "#15803d"
        };
      case "warning":
        return { 
          bg: "#fef3c7", 
          border: "#fde68a",
          icon: "#d97706"
        };
      case "error":
        return { 
          bg: "#fee2e2", 
          border: "#fecaca",
          icon: "#dc2626"
        };
      default:
        return { 
          bg: "#dbeafe", 
          border: "#bfdbfe",
          icon: "#2563eb"
        };
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: false } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thông báo này?")) {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div style={{ 
      backgroundColor: "#ffffff", 
      minHeight: "100vh", 
      padding: "24px 32px" 
    }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ 
              fontSize: "32px", 
              fontWeight: "700", 
              color: "#111827", 
              margin: "0 0 8px 0" 
            }}>
              Thông báo
            </h1>
            <p style={{ 
              fontSize: "16px", 
              color: "#6b7280", 
              margin: 0 
            }}>
              Quản lý tất cả thông báo của hệ thống
            </p>
          </div>
          <div style={{
            backgroundColor: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <HiOutlineBell style={{ width: "24px", height: "24px", color: "#FF5B27" }} />
            <div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                {unreadCount}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                Chưa đọc
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Actions */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { key: "all", label: `Tất cả (${notifications.length})` },
              { key: "unread", label: `Chưa đọc (${unreadCount})` },
              { key: "read", label: `Đã đọc (${notifications.length - unreadCount})` }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  backgroundColor: filter === tab.key ? "#FF5B27" : "transparent",
                  color: filter === tab.key ? "white" : "#6b7280",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (filter !== tab.key) {
                    e.target.style.backgroundColor = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== tab.key) {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Button */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#e5e7eb"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#f3f4f6"}
            >
              <HiOutlineCheck style={{ width: "16px", height: "16px" }} />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        overflow: "hidden"
      }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            padding: "48px 24px",
            textAlign: "center",
            color: "#6b7280"
          }}>
            <HiOutlineBell style={{ 
              width: "48px", 
              height: "48px", 
              margin: "0 auto 16px",
              color: "#d1d5db"
            }} />
            <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 8px 0" }}>
              Không có thông báo
            </h3>
            <p style={{ fontSize: "14px", margin: 0 }}>
              {filter === "unread" ? "Tất cả thông báo đã được đọc" : 
               filter === "read" ? "Không có thông báo đã đọc" : 
               "Chưa có thông báo nào"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const colors = getNotificationColor(notification.type);
            return (
              <div
                key={notification.id}
                style={{
                  padding: "20px 24px",
                  borderBottom: index < filteredNotifications.length - 1 ? "1px solid #f3f4f6" : "none",
                  backgroundColor: notification.read ? "white" : "#fafafa",
                  position: "relative",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (notification.read) {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read ? "white" : "#fafafa";
                }}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div style={{
                    position: "absolute",
                    left: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "4px",
                    backgroundColor: "#FF5B27",
                    borderRadius: "50%"
                  }} />
                )}

                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  {/* Icon */}
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <div style={{ color: colors.icon, fontSize: "18px" }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: "16px",
                          fontWeight: notification.read ? "500" : "600",
                          color: "#111827",
                          margin: "0 0 4px 0"
                        }}>
                          {notification.title}
                        </h4>
                        <p style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          margin: "0 0 8px 0",
                          lineHeight: "1.5"
                        }}>
                          {notification.message}
                        </p>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px"
                        }}>
                          <span style={{
                            fontSize: "12px",
                            color: "#9ca3af"
                          }}>
                            {notification.time}
                          </span>
                          {notification.priority === "high" && (
                            <span style={{
                              fontSize: "10px",
                              padding: "2px 6px",
                              backgroundColor: "#fee2e2",
                              color: "#dc2626",
                              borderRadius: "4px",
                              fontWeight: "500"
                            }}>
                              Ưu tiên cao
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                        {!notification.read ? (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            style={{
                              padding: "6px",
                              backgroundColor: "transparent",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              color: "#6b7280",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#f3f4f6";
                              e.target.style.color = "#374151";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.color = "#6b7280";
                            }}
                            title="Đánh dấu đã đọc"
                          >
                            <HiOutlineCheck style={{ width: "16px", height: "16px" }} />
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsUnread(notification.id)}
                            style={{
                              padding: "6px",
                              backgroundColor: "transparent",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              color: "#6b7280",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#f3f4f6";
                              e.target.style.color = "#374151";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.color = "#6b7280";
                            }}
                            title="Đánh dấu chưa đọc"
                          >
                            <HiOutlineX style={{ width: "16px", height: "16px" }} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          style={{
                            padding: "6px",
                            backgroundColor: "transparent",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            color: "#6b7280",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#fee2e2";
                            e.target.style.borderColor = "#fecaca";
                            e.target.style.color = "#dc2626";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.borderColor = "#e5e7eb";
                            e.target.style.color = "#6b7280";
                          }}
                          title="Xóa thông báo"
                        >
                          <HiOutlineTrash style={{ width: "16px", height: "16px" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
import React, { useState } from "react";
import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";
import ScheduleTable from "../components/ScheduleTable";
import Pagination from "../components/Pagination";
import Notification from "../components/Notification";
import { useSchedules } from "../hooks/useSchedule";
import { Schedule } from "@/config/models/schedule.model";

const Schedules = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "",
    message: "",
  });

  const { schedules, isLoading, error } = useSchedules();
  const itemsPerPage = 10;

  const handleActionClick = ({
    action,
    schedule,
  }: {
    action: string;
    schedule: Schedule;
  }) => {
    if (action === "view") {
      setSelectedSchedule(schedule);
      setShowViewModal(true);
    } else if (action === "edit") {
      // TODO: Implement edit functionality
      showNotificationMessage("info", "Chức năng chỉnh sửa đang được phát triển");
    } else if (action === "delete") {
      if (window.confirm("Bạn có chắc muốn xóa lịch trình này?")) {
        showNotificationMessage("success", "Đã xóa lịch trình thành công!");
      }
    }
  };

  const showNotificationMessage = (type: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      message,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  // Filter schedules based on search term and active tab
  const filteredSchedules = schedules.filter((schedule) => {
    // Search filtering
    const matchesSearch = !searchTerm || 
      schedule.scheduleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.areaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.scheduleType.toLowerCase().includes(searchTerm.toLowerCase());

    // Tab filtering
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "cleaning") return matchesSearch && schedule.scheduleType.toLowerCase() === "cleaning";
    if (activeTab === "maintenance") return matchesSearch && schedule.scheduleType.toLowerCase() === "maintenance";
    if (activeTab === "inspection") return matchesSearch && schedule.scheduleType.toLowerCase() === "inspection";

    return matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchedules = filteredSchedules.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh" 
      }}>
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh" 
      }}>
        <div style={{ color: "#dc2626" }}>
          Lỗi khi tải dữ liệu: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      <div style={{ padding: "16px 32px", flex: "0 0 auto" }}>
        <div style={{ marginBottom: "16px" }}>
          <nav style={{ color: "#6b7280", fontSize: "14px" }}>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "16px",
              }}
            >
              Quản lý lịch trình
            </h1>
            <span>Trang chủ</span>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Quản lý lịch trình
            </span>
          </nav>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
            {[
              { key: "all", label: "Tất cả" },
              { key: "cleaning", label: "Vệ sinh" },
              { key: "maintenance", label: "Bảo trì" },
              { key: "inspection", label: "Kiểm tra" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === tab.key
                      ? "2px solid #FF5B27"
                      : "2px solid transparent",
                  color: activeTab === tab.key ? "#FF5B27" : "#6b7280",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e: any) => {
                  if (activeTab !== tab.key) {
                    e.target.style.color = "#374151";
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (activeTab !== tab.key) {
                    e.target.style.color = "#6b7280";
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Add Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ position: "relative", width: "300px" }}>
            <HiOutlineSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                width: "20px",
                height: "20px",
              }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm lịch trình..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                padding: "10px 10px 10px 40px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FF5B27";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
              }}
            />
          </div>

          <button
            onClick={() => showNotificationMessage("info", "Chức năng thêm lịch trình đang được phát triển")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#FF5B27",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e: any) => {
              e.target.style.backgroundColor = "#E5501F";
            }}
            onMouseLeave={(e: any) => {
              e.target.style.backgroundColor = "#FF5B27";
            }}
          >
            <HiOutlinePlus style={{ width: "20px", height: "20px" }} />
            Thêm lịch trình
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              minWidth: "120px",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
              {schedules.length}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Tổng lịch trình
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              minWidth: "120px",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
              {filteredSchedules.length}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Hiển thị
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ flex: "1 1 auto", overflow: "auto" }}>
        <ScheduleTable
          schedules={currentSchedules}
          onActionClick={handleActionClick}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: "16px 32px", flex: "0 0 auto" }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedSchedule && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              width: "500px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <h2 style={{ marginBottom: "16px", color: "#111827" }}>
              Chi tiết lịch trình
            </h2>
            <div style={{ marginBottom: "16px" }}>
              <strong>ID:</strong> {selectedSchedule.scheduleId}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Khu vực:</strong> {selectedSchedule.areaId}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Loại:</strong> {selectedSchedule.scheduleType}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Ngày bắt đầu:</strong>{" "}
              {new Date(selectedSchedule.startDate).toLocaleString("vi-VN")}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Ngày kết thúc:</strong>{" "}
              {new Date(selectedSchedule.endDate).toLocaleString("vi-VN")}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Ca làm việc:</strong> {selectedSchedule.shiftId}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowViewModal(false)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules; 
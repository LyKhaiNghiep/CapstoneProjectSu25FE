import { useState, useEffect } from "react";
import { HiOutlineSearch, HiOutlinePlus, HiX } from "react-icons/hi";
import ShiftTable from "../components/ShiftTable";
import Pagination from "../components/Pagination";
import Notification from "../components/Notification";

const Shifts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddShiftPopup, setShowAddShiftPopup] = useState(false);
  const [showViewShiftModal, setShowViewShiftModal] = useState(false);
  const [showUpdateShiftModal, setShowUpdateShiftModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [sortState, setSortState] = useState("default"); // "asc", "desc", or "default"
  const [updateShiftData, setUpdateShiftData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    status: "",
  });
  const [newShift, setNewShift] = useState({
    name: "",
    startTime: "",
    endTime: "",
    status: "active",
  });
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
  });

  const itemsPerPage = 5;

  // Sample data for statuses
  const sampleStatuses = [
    { id: "1", name: "active", label: "Hoạt động" },
    { id: "2", name: "inactive", label: "Tạm dừng" },
  ];

  // Default shift data
  const defaultShifts = [
    {
      id: "1",
      name: "1",
      startTime: "07:30",
      endTime: "14:20",
      status: "Hoạt động",
      statusValue: "active",
      createdDate: "2024-01-15",
    },
    {
      id: "2",
      name: "2",
      startTime: "16:00",
      endTime: "20:00",
      status: "Tạm dừng",
      statusValue: "inactive",
      createdDate: "2024-02-10",
    },
  ];

  const [shifts, setShifts] = useState([]);

  // LocalStorage functions
  const saveShiftsToLocalStorage = (shiftData) => {
    try {
      localStorage.setItem("shiftManagement_shifts", JSON.stringify(shiftData));
      console.log("Đã lưu dữ liệu vào LocalStorage");
    } catch (error) {
      console.error("❌ Lỗi khi lưu vào LocalStorage:", error);
    }
  };

  // Helper function to convert Vietnamese time format to HH:MM
  const convertVietnameseTimeToHHMM = (timeStr) => {
    // Remove Vietnamese time indicators
    let cleanTime = timeStr.replace(/\s*(sáng|chiều|tối)\s*/g, "").trim();

    // Handle different time formats and ensure HH:MM format
    if (cleanTime.includes(":")) {
      const [hours, minutes] = cleanTime.split(":");
      const paddedHours = hours.padStart(2, "0");
      const paddedMinutes = minutes ? minutes.padStart(2, "0") : "00";
      return `${paddedHours}:${paddedMinutes}`;
    }

    // If no colon, assume it's just hours
    const paddedHours = cleanTime.padStart(2, "0");
    return `${paddedHours}:00`;
  };

  const loadShiftsFromLocalStorage = () => {
    try {
      const savedShifts = localStorage.getItem("shiftManagement_shifts");
      if (savedShifts) {
        const parsedShifts = JSON.parse(savedShifts);

        // Migrate old time format to new 24-hour format
        const migratedShifts = parsedShifts.map((shift) => {
          let startTime = shift.startTime;
          let endTime = shift.endTime;

          // Convert old Vietnamese format to 24-hour format
          if (
            startTime &&
            (startTime.includes("sáng") ||
              startTime.includes("chiều") ||
              startTime.includes("tối"))
          ) {
            startTime = convertVietnameseTimeToHHMM(startTime);
          }
          if (
            endTime &&
            (endTime.includes("sáng") ||
              endTime.includes("chiều") ||
              endTime.includes("tối"))
          ) {
            endTime = convertVietnameseTimeToHHMM(endTime);
          }

          return {
            ...shift,
            startTime,
            endTime,
          };
        });

        // Save the migrated data back to localStorage
        saveShiftsToLocalStorage(migratedShifts);

        console.log(
          "✅ Đã tải và chuyển đổi dữ liệu từ LocalStorage:",
          migratedShifts.length,
          "shifts"
        );
        return migratedShifts;
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải từ LocalStorage:", error);
    }
    return null;
  };

  // Load data when component mounts
  useEffect(() => {
    const savedShifts = loadShiftsFromLocalStorage();
    if (savedShifts && savedShifts.length > 0) {
      setShifts(savedShifts);
    } else {
      setShifts(defaultShifts);
      saveShiftsToLocalStorage(defaultShifts);
    }
  }, []);

  const handleActionClick = ({ action, shift }) => {
    if (action === "view") {
      setSelectedShift(shift);
      setShowViewShiftModal(true);
    } else if (action === "update") {
      setSelectedShift(shift);
      setUpdateShiftData({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: shift.statusValue,
      });
      setShowUpdateShiftModal(true);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewShiftModal(false);
    setSelectedShift(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateShiftModal(false);
    setSelectedShift(null);
    setUpdateShiftData({
      name: "",
      startTime: "",
      endTime: "",
      status: "",
    });
  };

  // Time validation function
  const validateTimeInput = (value) => {
    // Remove any non-digit characters except colon
    let cleanValue = value.replace(/[^\d:]/g, "");

    // Limit to HH:MM format
    if (cleanValue.length > 5) {
      cleanValue = cleanValue.substring(0, 5);
    }

    // Auto-add colon after 2 digits
    if (cleanValue.length === 2 && !cleanValue.includes(":")) {
      cleanValue += ":";
    }

    // Validate the time format
    if (cleanValue.includes(":")) {
      let [hours, minutes] = cleanValue.split(":");

      // Validate hours (00-23)
      if (hours && parseInt(hours) > 23) {
        hours = "23";
      }

      // Validate minutes (00-59)
      if (minutes && parseInt(minutes) > 59) {
        minutes = "59";
      }

      // Ensure two digits for hours
      if (hours && hours.length === 1) {
        hours = "0" + hours;
      }

      // Ensure two digits for minutes when complete
      if (minutes !== undefined) {
        if (minutes.length === 1) {
          minutes = "0" + minutes;
        } else if (minutes.length === 0) {
          minutes = "00";
        }
      }

      cleanValue = hours + ":" + (minutes || "");
    } else if (cleanValue.length === 1 || cleanValue.length === 2) {
      // If only hours are entered, pad with zero if needed
      if (cleanValue.length === 1) {
        cleanValue = "0" + cleanValue;
      }
    }

    return cleanValue;
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    if (name === "startTime" || name === "endTime") {
      const validatedTime = validateTimeInput(value);
      setUpdateShiftData((prev) => ({
        ...prev,
        [name]: validatedTime,
      }));
    } else {
      setUpdateShiftData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !updateShiftData.name ||
      !updateShiftData.startTime ||
      !updateShiftData.endTime ||
      !updateShiftData.status
    ) {
      showNotificationMessage(
        "error",
        "Vui lòng điền đầy đủ thông tin bắt buộc!"
      );
      return;
    }

    // Validate time format (24-hour format with leading zeros)
    const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(updateShiftData.startTime)) {
      showNotificationMessage(
        "error",
        "Thời gian bắt đầu không hợp lệ! Vui lòng nhập theo định dạng HH:MM"
      );
      return;
    }
    if (!timePattern.test(updateShiftData.endTime)) {
      showNotificationMessage(
        "error",
        "Thời gian kết thúc không hợp lệ! Vui lòng nhập theo định dạng HH:MM"
      );
      return;
    }

    const statusObj = sampleStatuses.find(
      (s) => s.name === updateShiftData.status
    );
    const updatedShifts = shifts.map((shift) =>
      shift.id === selectedShift.id
        ? {
            ...shift,
            ...updateShiftData,
            status: statusObj ? statusObj.label : updateShiftData.status,
            statusValue: updateShiftData.status,
          }
        : shift
    );
    setShifts(updatedShifts);
    saveShiftsToLocalStorage(updatedShifts);
    handleCloseUpdateModal();
    showNotificationMessage("success", "Đã cập nhật ca làm thành công!");
  };

  const handleAddShift = () => {
    setShowAddShiftPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddShiftPopup(false);
    setNewShift({
      name: "",
      startTime: "",
      endTime: "",
      status: "active",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "startTime" || name === "endTime") {
      const validatedTime = validateTimeInput(value);
      setNewShift((prev) => ({
        ...prev,
        [name]: validatedTime,
      }));
    } else {
      setNewShift((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitShift = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !newShift.name ||
      !newShift.startTime ||
      !newShift.endTime ||
      !newShift.status
    ) {
      showNotificationMessage(
        "error",
        "Vui lòng điền đầy đủ thông tin bắt buộc!"
      );
      return;
    }

    // Validate time format (24-hour format with leading zeros)
    const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(newShift.startTime)) {
      showNotificationMessage(
        "error",
        "Thời gian bắt đầu không hợp lệ! Vui lòng nhập theo định dạng HH:MM"
      );
      return;
    }
    if (!timePattern.test(newShift.endTime)) {
      showNotificationMessage(
        "error",
        "Thời gian kết thúc không hợp lệ! Vui lòng nhập theo định dạng HH:MM"
      );
      return;
    }

    const statusObj = sampleStatuses.find((s) => s.name === newShift.status);
    const shiftToAdd = {
      ...newShift,
      id: Date.now().toString(),
      status: statusObj ? statusObj.label : newShift.status,
      statusValue: newShift.status,
      createdDate: new Date().toISOString().split("T")[0],
    };

    const updatedShifts = [...shifts, shiftToAdd];
    setShifts(updatedShifts);
    saveShiftsToLocalStorage(updatedShifts);
    handleClosePopup();
    showNotificationMessage("success", "Đã thêm ca làm thành công!");
  };

  const showNotificationMessage = (type, message) => {
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

  const filteredShifts = shifts.filter(
    (shift) =>
      shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.startTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.endTime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered shifts based on sort state
  const sortedShifts = [...filteredShifts].sort((a, b) => {
    if (sortState === "default") {
      // Sort by creation date (newest first)
      return new Date(b.createdDate) - new Date(a.createdDate);
    } else if (sortState === "asc") {
      // Sort by shift name A-Z
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    } else if (sortState === "desc") {
      // Sort by shift name Z-A
      return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
    }
    return 0;
  });

  const handleSortClick = () => {
    if (sortState === "default") {
      setSortState("asc");
    } else if (sortState === "asc") {
      setSortState("desc");
    } else {
      setSortState("default");
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(sortedShifts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentShifts = sortedShifts.slice(startIndex, endIndex);

  // Reset to page 1 when searching
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
              Ca làm
            </h1>
            <span>Trang chủ</span>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#374151", fontWeight: "500" }}>Ca làm</span>
          </nav>
        </div>

        {/* Search and Add Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          {/* Search Box */}
          <div style={{ position: "relative", flex: "1" }}>
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            >
              <HiOutlineSearch style={{ width: "20px", height: "20px" }} />
            </div>
            <input
              type="text"
              placeholder="Tìm ca làm"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "40%",
                padding: "12px 16px 12px 48px",
                border: "1px solid #d1d5db",
                borderRadius: "50px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", marginLeft: "24px" }}>
            {/* Add Shift Button */}
            <button
              onClick={handleAddShift}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#FF5B27",
                color: "white",
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#E04B1F")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF5B27")}
            >
              <HiOutlinePlus style={{ width: "16px", height: "16px" }} />
              Thêm ca làm
            </button>
          </div>
        </div>
      </div>

      {/* Shift Table Container */}
      <div style={{ flex: "1", overflow: "auto", minHeight: 0 }}>
        <ShiftTable
          shifts={currentShifts}
          onActionClick={handleActionClick}
          sortState={sortState}
          onSortClick={handleSortClick}
        />
      </div>

      {/* Pagination */}
      <div style={{ flex: "0 0 auto", padding: "16px 32px" }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Shift Popup */}
      {showAddShiftPopup && (
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
          onClick={handleClosePopup}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Thêm ca làm mới
              </h2>
              <button
                onClick={handleClosePopup}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  color: "#6b7280",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitShift}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Tên ca làm *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newShift.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter slot name"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Thời gian bắt đầu *
                </label>
                <input
                  type="text"
                  name="startTime"
                  value={newShift.startTime}
                  onChange={handleInputChange}
                  required
                  placeholder="HH:MM"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Thời gian kết thúc *
                </label>
                <input
                  type="text"
                  name="endTime"
                  value={newShift.endTime}
                  onChange={handleInputChange}
                  required
                  placeholder="HH:MM"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Trạng thái *
                </label>
                <select
                  name="status"
                  value={newShift.status}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  {sampleStatuses.map((status) => (
                    <option key={status.id} value={status.name}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={handleClosePopup}
                  style={{
                    padding: "12px 20px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "white")
                  }
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "#FF5B27",
                    color: "white",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#E04B1F")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#FF5B27")
                  }
                >
                  Tạo ca làm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Shift Modal */}
      {showViewShiftModal && selectedShift && (
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
          onClick={handleCloseViewModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Chi tiết ca làm
              </h2>
              <button
                onClick={handleCloseViewModal}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  color: "#6b7280",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Shift Info */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Shift Details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Tên ca làm
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {selectedShift.name}
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Ngày tạo
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {selectedShift.createdDate
                      ? new Date(selectedShift.createdDate).toLocaleDateString(
                          "vi-VN"
                        )
                      : "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Thời gian bắt đầu
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {selectedShift.startTime}
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Thời gian kết thúc
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {selectedShift.endTime}
                  </p>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Trạng thái
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "4px 0 0 0",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "9999px",
                        backgroundColor:
                          selectedShift.status === "Hoạt động"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          selectedShift.status === "Hoạt động"
                            ? "#15803d"
                            : "#dc2626",
                      }}
                    >
                      {selectedShift.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "24px",
              }}
            >
              <button
                onClick={handleCloseViewModal}
                style={{
                  padding: "12px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: "white",
                  color: "#374151",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Shift Modal */}
      {showUpdateShiftModal && selectedShift && (
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
          onClick={handleCloseUpdateModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Cập nhật ca làm
              </h2>
              <button
                onClick={handleCloseUpdateModal}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  color: "#6b7280",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitUpdate}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Tên ca làm *
                </label>
                <input
                  type="text"
                  name="name"
                  value={updateShiftData.name}
                  onChange={handleUpdateChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Thời gian bắt đầu *
                </label>
                <input
                  type="text"
                  name="startTime"
                  value={updateShiftData.startTime}
                  onChange={handleUpdateChange}
                  required
                  placeholder="HH:MM"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Thời gian kết thúc *
                </label>
                <input
                  type="text"
                  name="endTime"
                  value={updateShiftData.endTime}
                  onChange={handleUpdateChange}
                  required
                  placeholder="HH:MM"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Trạng thái *
                </label>
                <select
                  name="status"
                  value={updateShiftData.status}
                  onChange={handleUpdateChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  {sampleStatuses.map((status) => (
                    <option key={status.id} value={status.name}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseUpdateModal}
                  style={{
                    padding: "12px 20px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "white")
                  }
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "#FF5B27",
                    color: "white",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#E04B1F")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#FF5B27")
                  }
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shifts;

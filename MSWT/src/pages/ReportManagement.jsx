import { useState, useEffect } from "react";
import { HiOutlinePlus, HiX } from "react-icons/hi";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/Pagination";
import { useReports, useReportsWithRole, createReport, updateReport, deleteReport, PRIORITY_MAPPING } from "../hooks/useReport";
import { useAuth } from "../contexts/AuthContext";

const ReportManagement = () => {
  const [priorityFilter, setPriorityFilter] = useState(""); // Filter by priority
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); // "all", "supervisor", "worker", "mine"
  const [showAddReportPopup, setShowAddReportPopup] = useState(false);
  const [showViewReportModal, setShowViewReportModal] = useState(false);
  const [showUpdateReportModal, setShowUpdateReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [updateReportData, setUpdateReportData] = useState({
    reportType: "",
    location: "",
    status: ""
  });
  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    priority: "Trung bình",
    reportedTo: "", // Nhân viên được báo cáo
    image: null, // File hình ảnh
    imagePreview: null // URL preview hình ảnh
  });

  const itemsPerPage = 5; // Số báo cáo hiển thị mỗi trang
  const { user } = useAuth(); // Get current user from auth context
  const currentUser = user?.username || "Alex Morgan"; // Fallback

  // API hooks - now using single call to get all reports with role info
  const { reports: allReports, isLoading: allLoading, isError: allError, refresh: refreshAll } = useReports();
  const { reports: reportsWithRole, isLoading: roleLoading, isError: roleError, refresh: refreshWithRole } = useReportsWithRole();

  // Get reports based on active tab
  const getReportsForTab = () => {
    switch (activeTab) {
      case "all":
        return { reports: allReports, isLoading: allLoading, isError: allError };
      case "supervisor":
        // Filter reports where roleName is "Supervisor"
        const supervisorReports = reportsWithRole.filter(report => 
          report.roleName === "Supervisor" || report.roleName === "supervisor"
        );
        return { reports: supervisorReports, isLoading: roleLoading, isError: roleError };
      case "worker":
        // Filter reports where roleName is "Worker" 
        const workerReports = reportsWithRole.filter(report => 
          report.roleName === "Worker" || report.roleName === "worker"
        );
        return { reports: workerReports, isLoading: roleLoading, isError: roleError };
      case "mine":
        // Filter reports created by current leader specifically
        console.log('🔍 Filtering current leader reports - User:', user?.username);
        console.log('🔍 Reports with role data:', reportsWithRole.map(r => ({ 
          roleName: r.roleName, 
          userName: r.userName, 
          createdBy: r.createdBy 
        })));
        const myLeaderReports = reportsWithRole.filter(report => 
          (report.roleName === "Leader" || report.roleName === "leader") &&
          (report.userName === user?.username || report.createdBy === user?.username)
        );
        console.log('🔍 My leader reports:', myLeaderReports);
        return { reports: myLeaderReports, isLoading: roleLoading, isError: roleError };
      default:
        return { reports: [], isLoading: false, isError: false };
    }
  };

  const { reports, isLoading, isError } = getReportsForTab();

  const handleActionClick = ({ action, report }) => {
    if (action === 'view') {
      setSelectedReport(report);
      setShowViewReportModal(true);
    } else if (action === 'update') {
      setSelectedReport(report);
      setUpdateReportData({
        reportType: report.reportType,
        location: report.location,
        status: report.status
      });
      setShowUpdateReportModal(true);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewReportModal(false);
    setSelectedReport(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateReportModal(false);
    setSelectedReport(null);
    setUpdateReportData({
      reportType: "",
      location: "",
      status: ""
    });
  };

  const handleUpdateStatusChange = (e) => {
    setUpdateReportData(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    if (selectedReport && updateReportData.status) {
      // Call API to update report
      updateReport(selectedReport.id, {
        status: updateReportData.status,
        reportType: updateReportData.reportType,
        location: updateReportData.location,
      })
      .then(() => {
        // Refresh all tabs data
        refreshAll();
        refreshWithRole();
    handleCloseUpdateModal();
    alert("✅ Đã cập nhật trạng thái báo cáo thành công!");
      })
      .catch((error) => {
        console.error("Error updating report:", error);
        alert("❌ Có lỗi xảy ra khi cập nhật báo cáo!");
      });
    }
  };

  const handleAddReport = () => {
    setShowAddReportPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddReportPopup(false);
    setNewReport({
      title: "",
      description: "",
      priority: "Trung bình",
      reportedTo: "",
      image: null,
      imagePreview: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file thành base64 để có thể lưu vào localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setNewReport(prev => ({
          ...prev,
          image: file,
          imagePreview: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewReport(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    
    if (newReport.title && newReport.description) {
      // Prepare data for Leader API format
      const reportData = {
        description: newReport.description,
        reportName: newReport.title,
        image: newReport.imagePreview || "", // Base64 string or empty string
        priority: PRIORITY_MAPPING[newReport.priority] || 2, // Map to number (default: Medium)
        reportType: 1, // Default report type
      };

      console.log('🔄 Creating report with data:', reportData);

      // Call API to create report
      createReport(reportData)
        .then(() => {
          // Refresh all tabs data
          refreshAll();
          refreshWithRole();
          
          // Reset form
          setNewReport({
            title: "",
            description: "",
            priority: "Trung bình",
            reportedTo: "",
            image: null,
            imagePreview: null
          });
          
          handleClosePopup();
          alert("✅ Đã thêm báo cáo mới thành công!");
        })
        .catch((error) => {
          console.error("Error creating report:", error);
          alert("❌ Có lỗi xảy ra khi tạo báo cáo: " + error.message);
        });
    } else {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    }
  };

  // Filter reports based on active tab and priority filter
  const filteredReports = reports.filter(report => {
    // Priority filtering
    if (priorityFilter && report.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  // Tính toán pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Calculate statistics for each tab
  const getTabCount = (tabType) => {
    switch (tabType) {
      case "all":
        return allReports.length;
      case "supervisor":
        return reportsWithRole.filter(report => 
          report.roleName === "Supervisor" || report.roleName === "supervisor"
        ).length;
      case "worker":
        return reportsWithRole.filter(report => 
          report.roleName === "Worker" || report.roleName === "worker"
        ).length;
      case "mine":
        return reportsWithRole.filter(report => 
          (report.roleName === "Leader" || report.roleName === "leader") &&
          (report.userName === user?.username || report.createdBy === user?.username)
        ).length;
      default:
        return 0;
    }
  };

  // Reset về trang 1 khi filter priority
  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    <div style={{ backgroundColor: "#ffffff", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
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
          Danh sách báo cáo
        </h1>
            <span>Trang chủ</span>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Danh sách báo cáo
            </span>
          </nav>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
            <button
              onClick={() => {
                  setActiveTab("all");
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                  borderBottom: activeTab === "all" ? "2px solid #FF5B27" : "2px solid transparent",
                  color: activeTab === "all" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
              }}
              onMouseEnter={(e) => {
                  if (activeTab !== "all") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                  if (activeTab !== "all") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
                Báo cáo tổng
                <span style={{
                  backgroundColor: activeTab === "all" ? "#FF5B27" : "#e5e7eb",
                  color: activeTab === "all" ? "white" : "#6b7280",
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: "600"
                }}>
                  {getTabCount("all")}
                </span>
            </button>
            <button
              onClick={() => {
                  setActiveTab("supervisor");
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                  borderBottom: activeTab === "supervisor" ? "2px solid #FF5B27" : "2px solid transparent",
                  color: activeTab === "supervisor" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
              }}
              onMouseEnter={(e) => {
                  if (activeTab !== "supervisor") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                  if (activeTab !== "supervisor") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
                Báo cáo giám sát viên
                <span style={{
                  backgroundColor: activeTab === "supervisor" ? "#FF5B27" : "#e5e7eb",
                  color: activeTab === "supervisor" ? "white" : "#6b7280",
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: "600"
                }}>
                  {getTabCount("supervisor")}
                </span>
            </button>
            <button
              onClick={() => {
                  setActiveTab("worker");
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                  borderBottom: activeTab === "worker" ? "2px solid #FF5B27" : "2px solid transparent",
                  color: activeTab === "worker" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
              }}
              onMouseEnter={(e) => {
                  if (activeTab !== "worker") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                  if (activeTab !== "worker") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
                Báo cáo công nhân
                <span style={{
                  backgroundColor: activeTab === "worker" ? "#FF5B27" : "#e5e7eb",
                  color: activeTab === "worker" ? "white" : "#6b7280",
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: "600"
                }}>
                  {getTabCount("worker")}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("mine");
                  setCurrentPage(1);
                }}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  borderBottom: activeTab === "mine" ? "2px solid #FF5B27" : "2px solid transparent",
                  color: activeTab === "mine" ? "#FF5B27" : "#6b7280",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== "mine") {
                    e.target.style.color = "#374151";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== "mine") {
                    e.target.style.color = "#6b7280";
                  }
                }}
              >
                Báo cáo của tôi
                <span style={{
                  backgroundColor: activeTab === "mine" ? "#FF5B27" : "#e5e7eb",
                  color: activeTab === "mine" ? "white" : "#6b7280",
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: "600"
                }}>
                  {getTabCount("mine")}
                </span>
            </button>
          </div>
        </div>

        {/* Priority Filter and Add Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          {/* Priority Filter Dropdown */}
          <div style={{ position: "relative",  flex: "1" }}>
            <select
              value={priorityFilter}
              onChange={handlePriorityFilterChange}
                disabled={isLoading}
              style={{
                width: "30%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                  backgroundColor: isLoading ? "#f9fafb" : "white",
                  cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            >
              <option value="">Tất cả</option>
              <option value="Cao">Cao</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Thấp">Thấp</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", marginLeft: "24px" }}>
            {/* Add Report Button */}
            <button
              onClick={handleAddReport}
                disabled={isLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                  backgroundColor: isLoading ? "#9ca3af" : "#FF5B27",
                color: "white",
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                  cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#E04B1F")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF5B27")}
            >
              <HiOutlinePlus style={{ width: "16px", height: "16px" }} />
              Tạo báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Report Table Container */}
      <div style={{ flex: "0 0 auto" }}>
          {isLoading ? (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              padding: "60px",
              color: "#6b7280"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #f3f4f6",
                  borderTop: "4px solid #FF5B27",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 16px"
                }} />
                <p>Đang tải danh sách báo cáo...</p>
              </div>
            </div>
          ) : isError ? (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              padding: "60px",
              color: "#dc2626"
            }}>
              <div style={{ textAlign: "center" }}>
                <svg style={{ width: "48px", height: "48px", margin: "0 auto 16px", color: "#dc2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p>Có lỗi xảy ra khi tải dữ liệu</p>
                <button
                  onClick={() => {
                    refreshAll();
                    refreshWithRole();
                  }}
                  style={{
                    marginTop: "12px",
                    padding: "8px 16px",
                    border: "1px solid #dc2626",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    color: "#dc2626",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              padding: "60px",
              color: "#6b7280"
            }}>
              <div style={{ textAlign: "center" }}>
                <svg style={{ width: "48px", height: "48px", margin: "0 auto 16px", color: "#9ca3af" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Không có báo cáo nào</p>
              </div>
            </div>
          ) : (
        <ReportTable reports={currentReports} onActionClick={handleActionClick} />
          )}
      </div>

      {/* Pagination */}
      <div style={{ flex: "0 0 auto", padding: "16px 32px" }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Report Popup */}
      {showAddReportPopup && (
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
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
                Tạo báo cáo mới
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
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReport}>
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
                  Tên báo cáo *
                </label>
                <input
                  type="text"
                  name="title"
                  value={newReport.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập tên báo cáo"
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
                  Mức độ ưu tiên *
                </label>
                <select
                  name="priority"
                  value={newReport.priority}
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
                    backgroundColor: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="Thấp">Thấp</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Cao">Cao</option>
                </select>
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
                  Mô tả *
                </label>
                <textarea
                  name="description"
                  value={newReport.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Nhập mô tả chi tiết"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    resize: "vertical",
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
                  Báo cáo giám sát viên *
                </label>
                <select
                  name="reportedTo"
                  value={newReport.reportedTo}
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
                    backgroundColor: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="">Chọn nhân viên</option>
                  <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                  <option value="Trần Thị B">Trần Thị B</option>
                  <option value="Lê Văn C">Lê Văn C</option>
                  <option value="Phạm Thị D">Phạm Thị D</option>
                  <option value="Hoàng Văn E">Hoàng Văn E</option>
                  <option value="Võ Thị F">Võ Thị F</option>
                  <option value="Đặng Văn G">Đặng Văn G</option>
                  <option value="Bùi Thị H">Bùi Thị H</option>
                  <option value="Ngô Văn I">Ngô Văn I</option>
                  <option value="Lý Thị K">Lý Thị K</option>
                </select>
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
                  Hình ảnh minh chứng
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
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
                  />
                  
                  {newReport.imagePreview && (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img
                        src={newReport.imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
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
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                >
                  Hủy
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
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#E04B1F")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF5B27")}
                >
                  Tạo báo cáo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewReportModal && selectedReport && (
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
              width: "600px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
                Chi tiết báo cáo
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
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Image at the top */}
            {selectedReport.imageUrl && (
              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", marginBottom: "8px", display: "block" }}>
                  Hình ảnh minh chứng
                </label>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={selectedReport.imageUrl}
                    alt="Hình ảnh báo cáo"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      objectFit: "contain",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    onClick={(e) => {
                      // Mở hình ảnh trong tab mới khi click
                      window.open(e.target.src, '_blank');
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.cursor = "pointer";
                      e.target.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = "1";
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  
                </div>
              </div>
            )}

            {/* Report Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Report Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Loại báo cáo
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedReport.reportType}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Địa điểm
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedReport.location}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Mức độ ưu tiên
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "9999px",
                        backgroundColor: 
                          selectedReport.priority === "Cao" ? "#fee2e2" :
                          selectedReport.priority === "Trung bình" ? "#fef3c7" : "#dcfce7",
                        color: 
                          selectedReport.priority === "Cao" ? "#dc2626" :
                          selectedReport.priority === "Trung bình" ? "#d97706" : "#15803d",
                      }}
                    >
                      {selectedReport.priority}
                    </span>
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Trạng thái
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: "4px 0 0 0" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "9999px",
                        backgroundColor: 
                          selectedReport.status === "Đã duyệt" ? "#dcfce7" :
                          selectedReport.status === "Đang duyệt" ? "#fef3c7" : "#fee2e2",
                        color: 
                          selectedReport.status === "Đã duyệt" ? "#15803d" :
                          selectedReport.status === "Đang duyệt" ? "#d97706" : "#dc2626",
                      }}
                    >
                      {selectedReport.status}
                    </span>
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Người báo cáo
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedReport.reportedBy}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Liên hệ
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedReport.contactInfo}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Ngày tạo
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedReport.createdDate ? new Date(selectedReport.createdDate).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Thời gian
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedReport.timeCreated || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {/* Description - Full width */}
              <div>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                  Mô tả chi tiết
                </label>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0", lineHeight: "1.5" }}>
                  {selectedReport.description || "Chưa có mô tả"}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div style={{ textAlign: "right", marginTop: "24px" }}>
              <button
                onClick={handleCloseViewModal}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: "#6b7280",
                  color: "white",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#4b5563")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#6b7280")}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Report Modal */}
      {showUpdateReportModal && selectedReport && (
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
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
                Cập nhật báo cáo
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
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
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
                  Loại báo cáo 
                </label>
                <input
                  type="text"
                  value={updateReportData.reportType}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f9fafb",
                    color: "#6b7280",
                    cursor: "not-allowed",
                  }}
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
                  Địa điểm 
                </label>
                <input
                  type="text"
                  value={updateReportData.location}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f9fafb",
                    color: "#6b7280",
                    cursor: "not-allowed",
                  }}
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
                  value={updateReportData.status}
                  onChange={handleUpdateStatusChange}
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
                  <option value="Đang duyệt">Đang duyệt</option>
                  <option value="Đã duyệt">Đã duyệt</option>
                  <option value="Hoàn thành">Hoàn thành</option>
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
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                >
                  Hủy
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
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#E04B1F")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF5B27")}
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ReportManagement; 
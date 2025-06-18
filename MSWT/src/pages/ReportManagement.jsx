import { useState, useEffect } from "react";
import { HiOutlineSearch, HiOutlinePlus, HiX } from "react-icons/hi";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/Pagination";

const ReportManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("assigned"); // "assigned" or "created"
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
  const currentUser = "Alex Morgan"; // User hiện tại - có thể lấy từ context/auth

  // Sample report data - Dữ liệu báo cáo mặc định
  const defaultReports = [
    {
      id: 1,
      title: "Lỗi cảm biến tầng 1",
      reportType: "Sensor error",
      location: "Floor 1",
      description: "Cảm biến nhiệt độ không hoạt động",
      status: "Đã duyệt",
      priority: "Cao",
      reportedBy: "Nguyễn Văn A",
      contactInfo: "0123456789",
      createdDate: "2024-02-24",
      timeCreated: "14:30",
      createdBy: "Nguyễn Văn A",
      assignedTo: "Alex Morgan",
      imageUrl: null
    },
    {
      id: 2,
      title: "Yêu cầu vệ sinh toilet",
      reportType: "Restroom cleaning",
      location: "Floor 3",
      description: "Toilet cần được vệ sinh",
      status: "Đang duyệt",
      priority: "Trung bình",
      reportedBy: "Trần Thị B",
      contactInfo: "0987654321",
      createdDate: "2024-04-26",
      timeCreated: "09:15",
      createdBy: "Trần Thị B",
      assignedTo: "Alex Morgan",
      imageUrl: null
    },
    {
      id: 3,
      title: "Bảo trì điều hòa",
      reportType: "Equipment maintenance",
      location: "Floor 2",
      description: "Máy điều hòa cần bảo trì định kỳ",
      status: "Hoàn thành",
      priority: "Thấp",
      reportedBy: "Alex Morgan",
      contactInfo: "0369852147",
      createdDate: "2024-03-15",
      timeCreated: "16:45",
      createdBy: "Alex Morgan",
      assignedTo: "Lê Văn C",
      imageUrl: null
    },
    {
      id: 4,
      title: "Vấn đề an toàn đèn khẩn cấp",
      reportType: "Safety issue",
      location: "Floor 4",
      description: "Đèn khẩn cấp không sáng",
      status: "Đã duyệt",
      priority: "Cao",
      reportedBy: "Phạm Thị D",
      contactInfo: "0741852963",
      createdDate: "2024-03-20",
      timeCreated: "11:20",
      createdBy: "Phạm Thị D",
      assignedTo: "Alex Morgan",
      imageUrl: null
    },
    {
      id: 5,
      title: "Sự cố mạng internet",
      reportType: "Network issue",
      location: "Floor 1",
      description: "Mạng internet chậm tại khu vực làm việc",
      status: "Đang duyệt",
      priority: "Trung bình",
      reportedBy: "Alex Morgan",
      contactInfo: "0159753486",
      createdDate: "2024-03-25",
      timeCreated: "13:10",
      createdBy: "Alex Morgan",
      assignedTo: "Hoàng Văn E",
      imageUrl: null
    },
    {
      id: 6,
      title: "Làm sạch thảm phòng họp",
      reportType: "Cleaning request",
      location: "Floor 5",
      description: "Cần vệ sinh thảm tại phòng họp",
      status: "Hoàn thành",
      priority: "Thấp",
      reportedBy: "Võ Thị F",
      contactInfo: "0852741963",
      createdDate: "2024-03-28",
      timeCreated: "10:30",
      createdBy: "Võ Thị F",
      assignedTo: "Alex Morgan",
      imageUrl: null
    },
    {
      id: 7,
      title: "Camera an ninh hỏng",
      reportType: "Security concern",
      location: "Floor 2",
      description: "Camera an ninh không hoạt động",
      status: "Đã duyệt",
      priority: "Cao",
      reportedBy: "Alex Morgan",
      contactInfo: "0963852741",
      createdDate: "2024-03-30",
      timeCreated: "08:45",
      createdBy: "Alex Morgan",
      assignedTo: "Đặng Văn G",
      imageUrl: null
    },
    {
      id: 8,
      title: "Rò rỉ nước toilet",
      reportType: "Water leakage",
      location: "Floor 3",
      description: "Rò rỉ nước tại toilet nam",
      status: "Đang duyệt",
      priority: "Cao",
      reportedBy: "Bùi Thị H",
      contactInfo: "0741963852",
      createdDate: "2024-04-01",
      timeCreated: "15:20",
      createdBy: "Bùi Thị H",
      assignedTo: "Alex Morgan",
      imageUrl: null
    },
    {
      id: 9,
      title: "Sửa chữa máy photocopy",
      reportType: "Equipment repair",
      location: "Floor 4",
      description: "Máy photocopy bị kẹt giấy",
      status: "Hoàn thành",
      priority: "Trung bình",
      reportedBy: "Alex Morgan",
      contactInfo: "0852963741",
      createdDate: "2024-04-03",
      timeCreated: "12:15",
      createdBy: "Alex Morgan",
      assignedTo: "Ngô Văn I",
      imageUrl: null
    },
    {
      id: 10,
      title: "Thay bóng đèn hành lang",
      reportType: "Maintenance request",
      location: "Floor 1",
      description: "Cần thay bóng đèn hành lang",
      status: "Đã duyệt",
      priority: "Thấp",
      reportedBy: "Lý Thị K",
      contactInfo: "0963741852",
      createdDate: "2024-04-05",
      timeCreated: "14:00",
      createdBy: "Lý Thị K",
      assignedTo: "Alex Morgan",
      imageUrl: null
    }
  ];

  const [reports, setReports] = useState([]);

  // LocalStorage functions
  const saveReportsToLocalStorage = (reportsData) => {
    try {
      localStorage.setItem('reportManagement_reports', JSON.stringify(reportsData));
      console.log('✅ Đã lưu báo cáo vào LocalStorage');
    } catch (error) {
      console.error('❌ Lỗi khi lưu báo cáo vào LocalStorage:', error);
    }
  };

  const loadReportsFromLocalStorage = () => {
    try {
      const savedReports = localStorage.getItem('reportManagement_reports');
      if (savedReports) {
        const parsedReports = JSON.parse(savedReports);
        console.log('✅ Đã tải báo cáo từ LocalStorage:', parsedReports.length, 'reports');
        return parsedReports;
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải báo cáo từ LocalStorage:', error);
    }
    return null;
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    const savedReports = loadReportsFromLocalStorage();
    if (savedReports && savedReports.length > 0) {
      // Migrate old data - add missing fields if they don't exist
      const migratedReports = savedReports.map(report => ({
        ...report,
        title: report.title || `Báo cáo #${report.id}`,
        priority: report.priority || "Trung bình",
        reportedBy: report.reportedBy || "Không xác định",
        contactInfo: report.contactInfo || "Chưa cập nhật",
        timeCreated: report.timeCreated || "00:00",
        createdBy: report.createdBy || report.reportedBy || "Không xác định",
        assignedTo: report.assignedTo || currentUser,
        imageUrl: report.imageUrl || null // Migrate image field
      }));
      setReports(migratedReports);
      // Save migrated data back to localStorage
      if (JSON.stringify(migratedReports) !== JSON.stringify(savedReports)) {
        saveReportsToLocalStorage(migratedReports);
      }
    } else {
      // Nếu chưa có dữ liệu trong LocalStorage, sử dụng dữ liệu mặc định
      setReports(defaultReports);
      saveReportsToLocalStorage(defaultReports);
    }
  }, []);

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
    const updatedReports = reports.map(report => 
      report.id === selectedReport.id 
        ? { ...report, status: updateReportData.status }
        : report
    );
    setReports(updatedReports);
    saveReportsToLocalStorage(updatedReports);
    handleCloseUpdateModal();
    alert("✅ Đã cập nhật trạng thái báo cáo thành công!");
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
    if (newReport.title && newReport.description && newReport.reportedTo) {
      const reportToAdd = {
        ...newReport,
        id: Date.now(),
        reportType: newReport.title, // Sử dụng title làm reportType cho hiển thị
        location: "Floor 1", // Mặc định
        contactInfo: "Chưa cập nhật",
        status: "Đang duyệt", // Mặc định khi tạo mới
        reportedBy: currentUser, // Người tạo báo cáo
        assignedTo: newReport.reportedTo, // Người được báo cáo
        createdDate: new Date().toISOString().split('T')[0],
        timeCreated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        createdBy: currentUser,
        imageUrl: newReport.imagePreview // Lưu base64 string hình ảnh
      };
      
      const updatedReports = [...reports, reportToAdd];
      setReports(updatedReports);
      
      // Lưu vào LocalStorage
      saveReportsToLocalStorage(updatedReports);
      
      handleClosePopup();
      
      // Thông báo thành công
      alert("✅ Đã tạo báo cáo thành công!");
    } else {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    }
  };

  // Filter reports based on active tab and search term
  const filteredReports = reports.filter(report => {
    // Tab filtering
    const tabFilter = activeTab === "assigned" 
      ? report.assignedTo === currentUser 
      : report.createdBy === currentUser;
    
    if (!tabFilter) return false;
    
    // Search filtering
    if (!searchTerm) return true;
    
    return (
      (report.title && report.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Tính toán pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset về trang 1 khi search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
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
                setActiveTab("assigned");
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "assigned" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "assigned" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "assigned") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "assigned") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Báo cáo nhân viên
            </button>
            <button
              onClick={() => {
                setActiveTab("created");
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "created" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "created" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "created") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "created") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Báo cáo của tôi
            </button>
          </div>
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
          <div style={{ position: "relative",  flex: "1" }}>
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
              placeholder="Search reports"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "100%",
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
            {/* Add Report Button */}
            <button
              onClick={handleAddReport}
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
              Tạo báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Report Table Container */}
      <div style={{ flex: "1", overflow: "auto", minHeight: 0 }}>
        <ReportTable reports={currentReports} onActionClick={handleActionClick} />
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
                  Báo cáo về nhân viên *
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
  );
};

export default ReportManagement; 
import React, { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineSearch, HiX, HiOutlineLocationMarker } from "react-icons/hi";
import AreaTable from "../components/AreaTable";
import Pagination from "../components/Pagination";

const Areas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); // "all", "active", "maintenance", "inactive"
  const [showAddAreaPopup, setShowAddAreaPopup] = useState(false);
  const [showViewAreaModal, setShowViewAreaModal] = useState(false);
  const [showUpdateAreaModal, setShowUpdateAreaModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [updateAreaData, setUpdateAreaData] = useState({
    name: "",
    floor: "",
    startRoom: "",
    endRoom: "",
    description: "",
    status: ""
  });
  const [newArea, setNewArea] = useState({
    name: "",
    floor: "",
    startRoom: "",
    endRoom: "",
    description: "",
    status: "Hoạt động"
  });

  const itemsPerPage = 5; // Số khu vực hiển thị mỗi trang

  // Sample area data - Dữ liệu mặc định
  const defaultAreas = [
    {
      id: 1,
      name: "Khu vực A",
      floor: 1,
      startRoom: "A101",
      endRoom: "A120",
      description: "Khu vực văn phòng chính, bao gồm các phòng họp và phòng làm việc",
      status: "Hoạt động",
      createdDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Khu vực B",
      floor: 1,
      startRoom: "B101",
      endRoom: "B115",
      description: "Khu vực tiếp đón khách hàng và phòng chờ",
      status: "Hoạt động",
      createdDate: "2024-02-10"
    },
    {
      id: 3,
      name: "Khu vực C",
      floor: 2,
      startRoom: "C201",
      endRoom: "C225",
      description: "Khu vực phòng thí nghiệm và nghiên cứu",
      status: "Bảo trì",
      createdDate: "2024-01-20"
    },
    {
      id: 4,
      name: "Khu vực D",
      floor: 2,
      startRoom: "D201",
      endRoom: "D210",
      description: "Khu vực đào tạo và hội thảo",
      status: "Hoạt động",
      createdDate: "2024-03-05"
    },
    {
      id: 5,
      name: "Khu vực E",
      floor: 3,
      startRoom: "E301",
      endRoom: "E330",
      description: "Khu vực hành chính và quản lý",
      status: "Hoạt động",
      createdDate: "2024-02-28"
    },
    {
      id: 6,
      name: "Khu vực F",
      floor: 3,
      startRoom: "F301",
      endRoom: "F315",
      description: "Khu vực lưu trữ tài liệu và kho",
      status: "Tạm ngưng",
      createdDate: "2024-03-10"
    },
    {
      id: 7,
      name: "Khu vực G",
      floor: 4,
      startRoom: "G401",
      endRoom: "G420",
      description: "Khu vực giải trí và nghỉ ngơi cho nhân viên",
      status: "Hoạt động",
      createdDate: "2024-03-15"
    },
    {
      id: 8,
      name: "Khu vực H",
      floor: 4,
      startRoom: "H401",
      endRoom: "H410",
      description: "Khu vực máy chủ và hệ thống IT",
      status: "Hoạt động",
      createdDate: "2024-03-20"
    }
  ];

  const [areas, setAreas] = useState([]);

  // LocalStorage functions
  const saveAreasToLocalStorage = (areasData) => {
    try {
      localStorage.setItem('areaManagement_areas', JSON.stringify(areasData));
      console.log('✅ Đã lưu khu vực vào LocalStorage');
    } catch (error) {
      console.error('❌ Lỗi khi lưu khu vực vào LocalStorage:', error);
    }
  };

  const loadAreasFromLocalStorage = () => {
    try {
      const savedAreas = localStorage.getItem('areaManagement_areas');
      if (savedAreas) {
        const parsedAreas = JSON.parse(savedAreas);
        console.log('✅ Đã tải khu vực từ LocalStorage:', parsedAreas.length, 'areas');
        return parsedAreas;
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải khu vực từ LocalStorage:', error);
    }
    return null;
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    const savedAreas = loadAreasFromLocalStorage();
    if (savedAreas && savedAreas.length > 0) {
      // Migrate old data - add missing fields if they don't exist
      const migratedAreas = savedAreas.map(area => ({
        ...area,
        createdDate: area.createdDate || "2024-01-01"
      }));
      setAreas(migratedAreas);
      // Save migrated data back to localStorage
      if (JSON.stringify(migratedAreas) !== JSON.stringify(savedAreas)) {
        saveAreasToLocalStorage(migratedAreas);
      }
    } else {
      // Nếu chưa có dữ liệu trong LocalStorage, sử dụng dữ liệu mặc định
      setAreas(defaultAreas);
      saveAreasToLocalStorage(defaultAreas);
    }
  }, []);

  const handleActionClick = ({ action, area }) => {
    if (action === 'view') {
      setSelectedArea(area);
      setShowViewAreaModal(true);
    } else if (action === 'edit') {
      setSelectedArea(area);
      setUpdateAreaData({
        name: area.name,
        floor: area.floor,
        startRoom: area.startRoom,
        endRoom: area.endRoom,
        description: area.description,
        status: area.status
      });
      setShowUpdateAreaModal(true);
    } else if (action === 'delete') {
      if (window.confirm("Bạn có chắc muốn xóa khu vực này?")) {
        const updatedAreas = areas.filter(a => a.id !== area.id);
        setAreas(updatedAreas);
        saveAreasToLocalStorage(updatedAreas);
        alert("✅ Đã xóa khu vực thành công!");
      }
    }
  };

  const handleCloseViewModal = () => {
    setShowViewAreaModal(false);
    setSelectedArea(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateAreaModal(false);
    setSelectedArea(null);
    setUpdateAreaData({
      name: "",
      floor: "",
      startRoom: "",
      endRoom: "",
      description: "",
      status: ""
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateAreaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const updatedAreas = areas.map(area => 
      area.id === selectedArea.id 
        ? { ...area, ...updateAreaData, floor: parseInt(updateAreaData.floor) }
        : area
    );
    setAreas(updatedAreas);
    saveAreasToLocalStorage(updatedAreas);
    handleCloseUpdateModal();
    alert("✅ Đã cập nhật khu vực thành công!");
  };

  const handleAddArea = () => {
    setShowAddAreaPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddAreaPopup(false);
    setNewArea({
      name: "",
      floor: "",
      startRoom: "",
      endRoom: "",
      description: "",
      status: "Hoạt động"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArea(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitArea = (e) => {
    e.preventDefault();
    if (newArea.name && newArea.floor && newArea.startRoom && newArea.endRoom) {
      const areaToAdd = {
        ...newArea,
        id: Date.now(),
        floor: parseInt(newArea.floor),
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      const updatedAreas = [...areas, areaToAdd];
      setAreas(updatedAreas);
      
      // Lưu vào LocalStorage
      saveAreasToLocalStorage(updatedAreas);
      
      handleClosePopup();
      
      // Thông báo thành công
      alert("✅ Đã thêm khu vực thành công!");
    } else {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    }
  };

  // Filter areas based on active tab and search term
  const filteredAreas = areas.filter(area => {
    // Tab filtering
    let tabFilter;
    if (activeTab === "all") {
      tabFilter = true;
    } else if (activeTab === "active") {
      tabFilter = area.status === "Hoạt động";
    } else if (activeTab === "maintenance") {
      tabFilter = area.status === "Bảo trì";
    } else if (activeTab === "inactive") {
      tabFilter = area.status === "Tạm ngưng";
    }
    
    if (!tabFilter) return false;
    
    // Search filtering
    if (!searchTerm) return true;
    
    return (
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.startRoom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.endRoom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Tính toán pagination
  const totalPages = Math.ceil(filteredAreas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAreas = filteredAreas.slice(startIndex, endIndex);

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
              Quản lý khu vực
            </h1>
            <span>Trang chủ</span>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Quản lý khu vực
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
              Tất cả
            </button>
            <button
              onClick={() => {
                setActiveTab("active");
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "active" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "active" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "active") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "active") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Hoạt động
            </button>
            <button
              onClick={() => {
                setActiveTab("maintenance");
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "maintenance" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "maintenance" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "maintenance") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "maintenance") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Bảo trì
            </button>
            <button
              onClick={() => {
                setActiveTab("inactive");
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "inactive" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "inactive" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "inactive") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "inactive") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Tạm ngưng
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
              placeholder="Tìm khu vực"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "32%",
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
            {/* Add Area Button */}
            <button
              onClick={() => setShowAddAreaPopup(true)}
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
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#e04516")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF5B27")}
            >
              <HiOutlinePlus style={{ width: "20px", height: "20px" }} />
              Thêm khu vực
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: "0 0 auto" }}>
        <AreaTable
          areas={currentAreas}
          onActionClick={handleActionClick}
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

      {/* Add Area Popup */}
      {showAddAreaPopup && (
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
                Thêm khu vực mới
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
            <form onSubmit={handleSubmitArea}>
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
                  Tên khu vực *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newArea.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập tên khu vực"
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
                  Tầng *
                </label>
                <input
                  type="number"
                  name="floor"
                  value={newArea.floor}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập số tầng"
                  min="1"
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

              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Phòng bắt đầu *
                  </label>
                  <input
                    type="text"
                    name="startRoom"
                    value={newArea.startRoom}
                    onChange={handleInputChange}
                    required
                    placeholder="VD: A101"
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
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Phòng kết thúc *
                  </label>
                  <input
                    type="text"
                    name="endRoom"
                    value={newArea.endRoom}
                    onChange={handleInputChange}
                    required
                    placeholder="VD: A120"
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
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={newArea.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Nhập mô tả khu vực"
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
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={newArea.status}
                  onChange={handleInputChange}
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
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Tạm ngưng">Tạm ngưng</option>
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
                  Thêm khu vực
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Area Modal */}
      {showUpdateAreaModal && selectedArea && (
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
                Cập nhật khu vực
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
                  Tên khu vực *
                </label>
                <input
                  type="text"
                  name="name"
                  value={updateAreaData.name}
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
                  Tầng *
                </label>
                <input
                  type="number"
                  name="floor"
                  value={updateAreaData.floor}
                  onChange={handleUpdateChange}
                  required
                  min="1"
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

              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Phòng bắt đầu *
                  </label>
                  <input
                    type="text"
                    name="startRoom"
                    value={updateAreaData.startRoom}
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
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Phòng kết thúc *
                  </label>
                  <input
                    type="text"
                    name="endRoom"
                    value={updateAreaData.endRoom}
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
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={updateAreaData.description}
                  onChange={handleUpdateChange}
                  rows="3"
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
                  value={updateAreaData.status}
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
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Tạm ngưng">Tạm ngưng</option>
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

      {/* View Area Modal */}
      {showViewAreaModal && selectedArea && (
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
                Chi tiết khu vực
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

            {/* Area Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Area Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px"
              }}>
                <HiOutlineLocationMarker style={{ width: "24px", height: "24px", color: "#FF5B27" }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                    {selectedArea.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                    Tầng {selectedArea.floor}
                  </p>
                </div>
              </div>

              {/* Area Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Phòng bắt đầu
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedArea.startRoom}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Phòng kết thúc
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedArea.endRoom}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Ngày tạo
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedArea.createdDate ? new Date(selectedArea.createdDate).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
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
                          selectedArea.status === "Hoạt động" ? "#dcfce7" :
                          selectedArea.status === "Bảo trì" ? "#fef3c7" : "#fee2e2",
                        color: 
                          selectedArea.status === "Hoạt động" ? "#15803d" :
                          selectedArea.status === "Bảo trì" ? "#d97706" : "#dc2626",
                      }}
                    >
                      {selectedArea.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Description - Full width */}
              <div>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                  Mô tả
                </label>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0", lineHeight: "1.5" }}>
                  {selectedArea.description || "Không có mô tả"}
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
    </div>
  );
};

export default Areas;

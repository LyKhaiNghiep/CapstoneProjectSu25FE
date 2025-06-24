import React, { useState } from 'react';
import { HiOutlineSearch, HiOutlinePlus } from "react-icons/hi";
import Pagination from "../components/Pagination";
import TrashBinTable from "../components/TrashBinTable";

const TrashBinList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "active", "full", "maintenance"
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBin, setEditingBin] = useState(null);
  const [trashBins, setTrashBins] = useState([
    {
      id: 1,
      name: 'Thùng rác T1-01',
      area: 'Tầng 1 - Hành lang chính',
      location: 'Hành lang chính',
      floor: 'Tầng 1',
      image: 'https://i.pinimg.com/736x/0b/1a/b5/0b1ab5ad2297af7731196ecd5fc0f16b.jpg',
      status: 'Hoạt động'
    },
    {
      id: 2,
      name: 'Thùng rác T1-02',
      area: 'Tầng 1 - Phòng vệ sinh nam',
      location: 'Phòng vệ sinh nam',
      floor: 'Tầng 1',
      image: 'https://i.pinimg.com/736x/05/3e/4c/053e4cc264e69595e79bf599e7219516.jpg',
      status: 'Hoạt động'
    },
    {
      id: 3,
      name: 'Thùng rác T2-01',
      area: 'Tầng 2 - Hành lang phía bắc',
      location: 'Hành lang phía bắc',
      floor: 'Tầng 2',
      image: 'https://i.pinimg.com/736x/0b/1a/b5/0b1ab5ad2297af7731196ecd5fc0f16b.jpg',
      status: 'Hoạt động'
    },
    {
      id: 4,
      name: 'Thùng rác T2-02',
      area: 'Tầng 2 - Phòng vệ sinh nữ',
      location: 'Phòng vệ sinh nữ',
      floor: 'Tầng 2',
      image: 'https://i.pinimg.com/736x/05/3e/4c/053e4cc264e69595e79bf599e7219516.jpg',
      status: 'Bảo trì'
    },
    {
      id: 5,
      name: 'Thùng rác T3-01',
      area: 'Tầng 3 - Khu vực nghỉ',
      location: 'Khu vực nghỉ',
      floor: 'Tầng 3',
      image: 'https://i.pinimg.com/736x/0b/1a/b5/0b1ab5ad2297af7731196ecd5fc0f16b.jpg',
      status: 'Hoạt động'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoạt động':
        return 'bg-green-100 text-green-800';
      
      case 'Bảo trì':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter trash bins based on active tab and search term
  const filteredTrashBins = trashBins.filter(bin => {
    // Tab filtering
    let tabFilter;
    if (activeTab === "all") {
      tabFilter = true;
    } else if (activeTab === "active") {
      tabFilter = bin.status === "Hoạt động";
    
    } else if (activeTab === "maintenance") {
      tabFilter = bin.status === "Bảo trì";
    }
    
    if (!tabFilter) return false;
    
    // Search filtering
    const matchesSearch = !searchTerm || 
      bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter (keep this for backward compatibility)
    const matchesStatus = statusFilter === "" || bin.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTrashBins.length / itemsPerPage);
  const currentTrashBins = filteredTrashBins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleActionClick = ({ action, bin }) => {
    switch (action) {
      case 'view':
        setSelectedBin(bin);
        setShowDetailPopup(true);
        break;
      case 'edit':
        setEditingBin({ ...bin });
        setShowEditModal(true);
        break;
      default:
        break;
    }
  };

  const handleSaveStatus = () => {
    if (editingBin) {
      setTrashBins(prev => 
        prev.map(bin => 
          bin.id === editingBin.id 
            ? { ...bin, status: editingBin.status }
            : bin
        )
      );
      setShowEditModal(false);
      setEditingBin(null);
    }
  };

  const getStatusBadge = (status) => {
    let badgeStyle = {
      padding: "4px 12px",
      borderRadius: "16px",
      fontSize: "12px",
      fontWeight: "500",
    };

    switch (status) {
      case "Hoạt động":
        return (
          <span style={{ ...badgeStyle, backgroundColor: "#dcfce7", color: "#166534" }}>
            {status}
          </span>
        );
      
      case "Bảo trì":
        return (
          <span style={{ ...badgeStyle, backgroundColor: "#fef3c7", color: "#d97706" }}>
            {status}
          </span>
        );
      default:
        return <span style={badgeStyle}>{status}</span>;
    }
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
              Danh sách thùng rác
            </h1>
            <span>Trang chủ</span>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Danh sách thùng rác
            </span>
          </nav>
        </div>

        {/* Tabs
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
              Tất cả thùng rác
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
              Đang hoạt động
            </button>
            <button
              onClick={() => {
                setActiveTab("full");
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "full" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "full" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "full") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "full") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Thùng đầy
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
              Đang bảo trì
            </button>
          </div>
        </div> */}

        {/* Search and Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          {/* Search Box */}
          <div style={{ position: "relative", flex: "1", maxWidth: "400px" }}>
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
              placeholder="Tìm kiếm thùng rác..."
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

          {/* Filters and Add Button */}
          <div style={{ display: "flex", gap: "12px", marginLeft: "24px", alignItems: "center" }}>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                backgroundColor: "white"
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              
              <option value="Bảo trì">Bảo trì</option>
            </select>

            <button
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
              Thêm thùng rác
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ flex: "0 0 auto" }}>
        <TrashBinTable 
          trashBins={currentTrashBins}
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

      {/* Detail Popup */}
      {showDetailPopup && selectedBin && (
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
          onClick={() => setShowDetailPopup(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>
                Chi tiết thùng rác
              </h2>
              <button
                onClick={() => setShowDetailPopup(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <img
                  src={selectedBin.image}
                  alt={selectedBin.name}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  style={{ 
                    display: 'none',
                    width: "200px",
                    height: "200px", 
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: '#9ca3af',
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Không có hình ảnh
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", alignItems: "center" }}>
                <strong style={{ color: "#374151" }}>ID:</strong>
                <span style={{ color: "#6b7280" }}>{selectedBin.id}</span>

                <strong style={{ color: "#374151" }}>Tên thùng rác:</strong>
                <span style={{ color: "#6b7280" }}>{selectedBin.name}</span>

                <strong style={{ color: "#374151" }}>Địa điểm:</strong>
                <span style={{ color: "#6b7280" }}>{selectedBin.location}</span>

                <strong style={{ color: "#374151" }}>Tầng:</strong>
                <span style={{ color: "#6b7280" }}>{selectedBin.floor}</span>

                <strong style={{ color: "#374151" }}>Khu vực:</strong>
                <span style={{ color: "#6b7280" }}>{selectedBin.area}</span>

                <strong style={{ color: "#374151" }}>Trạng thái:</strong>
                <div>
                  {getStatusBadge(selectedBin.status)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px", gap: "12px" }}>
              <button
                onClick={() => setShowDetailPopup(false)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#f9fafb"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {showEditModal && editingBin && (
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
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 }}>
                Sửa trạng thái thùng rác
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ marginBottom: "12px" }}>
                <strong style={{ color: "#374151", display: "block", marginBottom: "4px" }}>
                  Thùng rác: {editingBin.name}
                </strong>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>
                  {editingBin.location} - {editingBin.floor}
                </span>
              </div>

              <div>
                <label style={{ color: "#374151", fontWeight: "500", display: "block", marginBottom: "8px" }}>
                  Trạng thái:
                </label>
                <select
                  value={editingBin.status}
                  onChange={(e) => setEditingBin({ ...editingBin, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "white",
                  }}
                >
                  <option value="Hoạt động">Hoạt động</option>
                  
                  <option value="Bảo trì">Bảo trì</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#f9fafb"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
              >
                Hủy
              </button>
              <button
                onClick={handleSaveStatus}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "#FF5B27",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#E04B1F"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#FF5B27"}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrashBinList; 
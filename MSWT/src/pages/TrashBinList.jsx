import React, { useState } from 'react';
import { HiOutlineSearch, HiOutlinePlus } from "react-icons/hi";
import Pagination from "../components/Pagination";

const TrashBinList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState("");
  const [trashBins] = useState([
    {
      id: 1,
      name: 'Thùng rác T1-01',
      area: 'Tầng 1 - Hành lang chính',
      image: '/images/trash-bin-1.jpg',
      status: 'Hoạt động'
    },
    {
      id: 2,
      name: 'Thùng rác T1-02',
      area: 'Tầng 1 - Phòng vệ sinh nam',
      image: '/images/trash-bin-2.jpg',
      status: 'Đầy'
    },
    {
      id: 3,
      name: 'Thùng rác T2-01',
      area: 'Tầng 2 - Hành lang phía bắc',
      image: '/images/trash-bin-3.jpg',
      status: 'Hoạt động'
    },
    {
      id: 4,
      name: 'Thùng rác T2-02',
      area: 'Tầng 2 - Phòng vệ sinh nữ',
      image: '/images/trash-bin-4.jpg',
      status: 'Bảo trì'
    },
    {
      id: 5,
      name: 'Thùng rác T3-01',
      area: 'Tầng 3 - Khu vực nghỉ',
      image: '/images/trash-bin-5.jpg',
      status: 'Hoạt động'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoạt động':
        return 'bg-green-100 text-green-800';
      case 'Đầy':
        return 'bg-red-100 text-red-800';
      case 'Bảo trì':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTrashBins = trashBins.filter(bin => {
    const matchesSearch = bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bin.area.toLowerCase().includes(searchTerm.toLowerCase());
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
      case "Đầy":
        return (
          <span style={{ ...badgeStyle, backgroundColor: "#fee2e2", color: "#dc2626" }}>
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
              <option value="Đầy">Đầy</option>
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
      <div style={{ flex: "1", overflow: "auto", minHeight: 0, padding: "0 32px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <tr>
                <th style={{ 
                  padding: "12px 24px", 
                  textAlign: "left", 
                  fontSize: "12px", 
                  fontWeight: "500", 
                  color: "#6b7280", 
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Tên thùng rác
                </th>
                <th style={{ 
                  padding: "12px 24px", 
                  textAlign: "left", 
                  fontSize: "12px", 
                  fontWeight: "500", 
                  color: "#6b7280", 
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Khu vực
                </th>
                <th style={{ 
                  padding: "12px 24px", 
                  textAlign: "left", 
                  fontSize: "12px", 
                  fontWeight: "500", 
                  color: "#6b7280", 
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Hình ảnh
                </th>
                <th style={{ 
                  padding: "12px 24px", 
                  textAlign: "left", 
                  fontSize: "12px", 
                  fontWeight: "500", 
                  color: "#6b7280", 
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Trạng thái
                </th>
                <th style={{ 
                  padding: "12px 24px", 
                  textAlign: "left", 
                  fontSize: "12px", 
                  fontWeight: "500", 
                  color: "#6b7280", 
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "white" }}>
              {currentTrashBins.map((bin, index) => (
                <tr 
                  key={bin.id} 
                  style={{ 
                    borderBottom: index === currentTrashBins.length - 1 ? "none" : "1px solid #f3f4f6",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = "#f9fafb"}
                  onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = "white"}
                >
                  <td style={{ padding: "16px 24px" }}>
                    <div>
                      <div style={{ fontWeight: "500", color: "#111827", marginBottom: "4px" }}>
                        {bin.name}
                      </div>
                      <div style={{ fontSize: "14px", color: "#6b7280" }}>
                        ID: {bin.id}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ color: "#111827" }}>{bin.area}</div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ 
                      width: "48px", 
                      height: "48px", 
                      backgroundColor: "#f3f4f6", 
                      borderRadius: "8px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center" 
                    }}>
                      <img
                        src={bin.image}
                        alt={bin.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    {getStatusBadge(bin.status)}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button 
                        style={{ 
                          color: "#3b82f6", 
                          fontSize: "14px", 
                          fontWeight: "500", 
                          background: "none", 
                          border: "none", 
                          cursor: "pointer",
                          transition: "color 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#1d4ed8"}
                        onMouseLeave={(e) => e.target.style.color = "#3b82f6"}
                      >
                        Xem
                      </button>
                      <button 
                        style={{ 
                          color: "#10b981", 
                          fontSize: "14px", 
                          fontWeight: "500", 
                          background: "none", 
                          border: "none", 
                          cursor: "pointer",
                          transition: "color 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#059669"}
                        onMouseLeave={(e) => e.target.style.color = "#10b981"}
                      >
                        Sửa
                      </button>
                      <button 
                        style={{ 
                          color: "#ef4444", 
                          fontSize: "14px", 
                          fontWeight: "500", 
                          background: "none", 
                          border: "none", 
                          cursor: "pointer",
                          transition: "color 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#dc2626"}
                        onMouseLeave={(e) => e.target.style.color = "#ef4444"}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div style={{ flex: "0 0 auto", padding: "16px 32px" }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TrashBinList; 
import { useState } from "react";
import { HiOutlineDotsVertical, HiOutlineEye, HiOutlinePencil } from "react-icons/hi";

const TrashBinTable = ({ trashBins, onActionClick }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Debug log to check trash bins data
  console.log('TrashBinTable received trashBins:', trashBins);
  console.log('TrashBinTable trashBins length:', trashBins?.length);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "hoạt động":
        return { backgroundColor: "#dcfce7", color: "#15803d" };
      
      case "bảo trì":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  const handleDropdownToggle = (binId) => {
    setOpenDropdown(openDropdown === binId ? null : binId);
  };

  const handleActionSelect = (action, bin) => {
    onActionClick({ action, bin });
    setOpenDropdown(null);
  };

  return (
    <div
      style={{
        marginLeft: "32px",
        marginRight: "32px",
        marginTop: "0px",
        marginBottom: "12px",
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #f0f0f0",
        overflow: "auto",
        maxHeight: "400px",
        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 10 }} >
          <tr style={{ backgroundColor: "#FEF6F4" }}>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Tên thùng rác
            </th>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Địa điểm
            </th>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Tầng
            </th>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Hình ảnh
            </th>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Trạng thái
            </th>
            <th
              style={{
                padding: "18px 24px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {trashBins.map((bin, index) => (
            <tr
              key={bin.id}
              style={{
                borderTop: index > 0 ? "1px solid #f0f0f0" : "none",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#fafafa")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {/* Name Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#111827",
                }}
              >
                <div>
                  <div style={{ fontWeight: "500", color: "#111827", marginBottom: "4px" }}>
                    {bin.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    ID: {bin.id}
                  </div>
                </div>
              </td>

              {/* Location Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {bin.location || "Chưa cập nhật"}
              </td>

              {/* Floor Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {bin.floor || "Chưa cập nhật"}
              </td>

                            {/* Image Column */}
              <td
                style={{
                  padding: "16px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  backgroundColor: "#f3f4f6", 
                  borderRadius: "8px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  margin: "0 auto"
                }}>
                  <img
                    src={bin.image}
                    alt={bin.name}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    style={{ 
                      display: 'none', 
                      fontSize: '12px', 
                      color: '#9ca3af',
                      textAlign: 'center'
                    }}
                  >
                    No Image
                  </div>
                </div>
              </td>

              {/* Status Column */}
              <td style={{ padding: "16px 24px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "9999px",
                    ...getStatusColor(bin.status),
                  }}
                >
                  {bin.status}
                </span>
              </td>

              {/* Action Column */}
              <td
                style={{
                  padding: "16px 24px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => handleDropdownToggle(bin.id)}
                  style={{
                    color: "#6b7280",
                    background: "transparent",
                    border: "none",
                    padding: "8px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#374151";
                    e.target.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#6b7280";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <HiOutlineDotsVertical
                    style={{ width: "20px", height: "20px" }}
                  />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === bin.id && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0%",
                      right: "8px",
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      zIndex: 10,
                      minWidth: "140px",
                    }}
                  >
                    <button
                      onClick={() => handleActionSelect('view', bin)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        backgroundColor: "transparent",
                        textAlign: "left",
                        fontSize: "14px",
                        color: "#374151",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "8px 8px 0 0",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      <HiOutlineEye style={{ width: "16px", height: "16px" }} />
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleActionSelect('edit', bin)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        backgroundColor: "transparent",
                        textAlign: "left",
                        fontSize: "14px",
                        color: "#374151",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "0 0 8px 8px",
                        borderTop: "1px solid #f3f4f6",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      <HiOutlinePencil style={{ width: "16px", height: "16px" }} />
                      Sửa
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
          }}
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};

export default TrashBinTable; 
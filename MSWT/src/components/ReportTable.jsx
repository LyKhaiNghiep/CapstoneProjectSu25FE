import { useState } from "react";
import { HiOutlineDotsVertical, HiOutlineEye, HiOutlinePencil } from "react-icons/hi";

const ReportTable = ({ reports, onActionClick }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "đã duyệt":
        return { backgroundColor: "#dcfce7", color: "#15803d" };
      case "đang duyệt":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case "hoàn thành":
        return { backgroundColor: "#ddd6fe", color: "#7c3aed" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  const handleDropdownToggle = (reportId) => {
    setOpenDropdown(openDropdown === reportId ? null : reportId);
  };

  const handleActionSelect = (action, report) => {
    onActionClick({ action, report });
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
        overflow: "hidden",
        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
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
              Báo cáo
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
               Mức độ ưu tiên
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
              Mô tả
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
                padding: "16px 24px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Thời gian
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
          {reports.map((report, index) => (
            <tr
              key={report.id}
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
                             {/* Report Type Column */}
               <td
                 style={{
                   padding: "16px 24px",
                   fontSize: "14px",
                   fontWeight: "500",
                   color: "#111827",
                 }}
               >
                 {report.reportType}
               </td>

               {/* Priority Column */}
               <td
                 style={{
                   padding: "16px 24px",
                   fontSize: "14px",
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
                       report.priority === "Cao" ? "#fee2e2" :
                       report.priority === "Trung bình" ? "#fef3c7" : "#dcfce7",
                     color: 
                       report.priority === "Cao" ? "#dc2626" :
                       report.priority === "Trung bình" ? "#d97706" : "#15803d",
                   }}
                 >
                   {report.priority || "Trung bình"}
                 </span>
               </td>

              {/* Description Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  color: "#6b7280",
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {report.description || "Không có mô tả"}
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
                    ...getStatusColor(report.status),
                  }}
                >
                  {report.status}
                </span>
              </td>

              {/* Time Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>
                    {report.createdDate ? new Date(report.createdDate).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {report.timeCreated || "00:00"}
                  </div>
                </div>
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
                  onClick={() => handleDropdownToggle(report.id)}
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
                {openDropdown === report.id && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "50%",
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
                      onClick={() => handleActionSelect('view', report)}
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
                      onClick={() => handleActionSelect('update', report)}
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
                      Cập nhật
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

export default ReportTable; 
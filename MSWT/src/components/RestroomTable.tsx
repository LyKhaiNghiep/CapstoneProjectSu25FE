import { Restroom } from "@/config/models/restroom.model";
import { useState } from "react";
import {
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlinePencil,
  HiChevronUp,
  HiChevronDown,
} from "react-icons/hi";

interface IAction {
  action: string;
  restroom: Restroom;
}

interface IProps {
  restrooms: Restroom[];
  onActionClick: (action: IAction) => void;
  sortState: string;
  onSortClick: () => void;
}

const RestroomTable = ({
  restrooms,
  onActionClick,
  sortState,
  onSortClick,
}: IProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Debug log to check restrooms data
  console.log("RestroomTable received restrooms:", restrooms);
  console.log("RestroomTable restrooms length:", restrooms?.length);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hoạt động":
        return { backgroundColor: "#dcfce7", color: "#15803d" };
      case "bảo trì":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  const handleDropdownToggle = (restroomId: string) => {
    setOpenDropdown(openDropdown === restroomId ? null : restroomId);
  };

  const handleActionSelect = (action: string, restroom: Restroom) => {
    onActionClick({ action, restroom } as IAction);
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
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
                onClick={onSortClick}
              >
                Phòng
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1px",
                  }}
                >
                  <HiChevronUp
                    style={{
                      width: "12px",
                      height: "12px",
                      color: sortState === "asc" ? "#374151" : "#d1d5db",
                    }}
                  />
                  <HiChevronDown
                    style={{
                      width: "12px",
                      height: "12px",
                      color: sortState === "desc" ? "#374151" : "#d1d5db",
                    }}
                  />
                </div>
              </div>
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
              Khu vực
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
              Chi tiết
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
          {restrooms?.map((restroom, index) => (
            <tr
              key={restroom.restroomId}
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
              {/* Room Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#111827",
                }}
              >
                {restroom.restroomNumber}
              </td>

              {/* Area Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {restroom.area?.areaName}
              </td>

              {/* Details Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  color: "#6b7280",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {restroom.description}
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
                    ...getStatusColor(restroom.status),
                  }}
                >
                  {restroom.status}
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
                  onClick={() => handleDropdownToggle(restroom.restroomId)}
                  style={{
                    color: "#6b7280",
                    background: "transparent",
                    border: "none",
                    padding: "8px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e: any) => {
                    e.target.style.color = "#374151";
                    e.target.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e: any) => {
                    e.target.style.color = "#6b7280";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <HiOutlineDotsVertical
                    style={{ width: "20px", height: "20px" }}
                  />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === restroom.restroomId && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "50%",
                      right: "8px",
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      zIndex: 10,
                      minWidth: "140px",
                    }}
                  >
                    <button
                      onClick={() => handleActionSelect("view", restroom)}
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
                      onMouseEnter={(e: any) =>
                        (e.target.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e: any) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      <HiOutlineEye style={{ width: "16px", height: "16px" }} />
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleActionSelect("update", restroom)}
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
                      onMouseEnter={(e: any) =>
                        (e.target.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e: any) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      <HiOutlinePencil
                        style={{ width: "16px", height: "16px" }}
                      />
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

export default RestroomTable;

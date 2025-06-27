import { Area } from "@/config/models/restroom.model";
import { useState } from "react";
import {
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";

interface IProps {
  areas: Area[];
  onActionClick: (action: IAction) => void;
}

interface IAction {
  action: string;
  area: Area;
}

const AreaTable = ({
  areas,
  onActionClick,
}: IProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  console.log("areas", areas);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return { backgroundColor: "#dcfce7", color: "#15803d" };
      case "Bảo trì":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case "Tạm ngưng":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  const handleDropdownToggle = (areaId: string) => {
    setOpenDropdown(openDropdown === areaId ? null : areaId);
  };

  const handleActionSelect = (action: string, area: Area) => {
    onActionClick({ action, area });
    setOpenDropdown(null);
  };

  return (
    <div
      style={{
        marginLeft: "32px",
        marginRight: "32px",
        marginTop: "0px",
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #f0f0f0",
        overflow: "auto",
        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
          <tr
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            <th
              style={{
                padding: "16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Tên khu vực
            </th>
            <th
              style={{
                padding: "16px",
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
                padding: "16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Phòng bắt đầu
            </th>
            <th
              style={{
                padding: "16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Phòng kết thúc
            </th>
            <th
              style={{
                padding: "16px",
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
                padding: "16px",
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
                padding: "16px",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody style={{ borderTop: "2px solid transparent" }}>
          {areas.map((area, index) => (
            <tr
              key={area.id}
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
              {/* Area Name Column */}
              <td
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#111827",
                }}
              >
                {area.areaName}
              </td>

              {/* Floor Column */}
              <td
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Tầng {area.floor?.floorNumber}
              </td>

              {/* Start Room Column */}
              <td
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {area.roomBegin}
              </td>

              {/* End Room Column */}
              <td
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {area.roomEnd}
              </td>

              {/* Description Column */}
              <td
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  color: "#6b7280",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {area.description || "Không có mô tả"}
              </td>

              {/* Status Column */}
              <td style={{ padding: "16px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "9999px",
                    ...getStatusColor(area.status),
                  }}
                >
                  {area.status}
                </span>
              </td>

              {/* Action Column */}
              <td
                style={{
                  padding: "16px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => handleDropdownToggle(area.areaId)}
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
                {openDropdown === area.areaId && (
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
                      onClick={() => handleActionSelect("view", area)}
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
                      onClick={() => handleActionSelect("edit", area)}
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
                      Sửa
                    </button>
                    <button
                      onClick={() => handleActionSelect("delete", area)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        backgroundColor: "transparent",
                        textAlign: "left",
                        fontSize: "14px",
                        color: "#dc2626",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "0 0 8px 8px",
                        borderTop: "1px solid #f3f4f6",
                      }}
                      onMouseEnter={(e: any) =>
                        (e.target.style.backgroundColor = "#fef2f2")
                      }
                      onMouseLeave={(e: any) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      <HiOutlineTrash
                        style={{ width: "16px", height: "16px" }}
                      />
                      Xóa
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

export default AreaTable;

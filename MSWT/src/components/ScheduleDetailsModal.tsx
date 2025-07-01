import { HiOutlineX, HiOutlineClock, HiOutlineUser, HiOutlineClipboardList } from "react-icons/hi";
import { Schedule } from "@/config/models/schedule.model";
import { useScheduleDetails } from "../hooks/useScheduleDetails";

interface IProps {
  schedule: Schedule | null;
  isVisible: boolean;
  onClose: () => void;
}

const ScheduleDetailsModal = ({ schedule, isVisible, onClose }: IProps) => {
  const { scheduleDetails, isLoading, error } = useScheduleDetails(
    schedule?.scheduleId
  );

  if (!isVisible || !schedule) return null;

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return { backgroundColor: "#f3f4f6", color: "#374151" };
    switch (status.toLowerCase()) {
      case "completed":
      case "hoàn thành":
        return { backgroundColor: "#dcfce7", color: "#15803d" };
      case "in-progress":
      case "đang thực hiện":
        return { backgroundColor: "#dbeafe", color: "#1d4ed8" };
      case "pending":
      case "chờ thực hiện":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case "cancelled":
      case "hủy bỏ":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };



  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "800px",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
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
            Chi tiết lịch trình
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: "8px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: "#6b7280",
            }}
            onMouseEnter={(e: any) => {
              e.target.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e: any) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <HiOutlineX style={{ width: "24px", height: "24px" }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {/* Schedule Basic Info from schedule details */}
          {scheduleDetails.length > 0 && scheduleDetails[0].schedule && (
            <div
              style={{
                marginBottom: "24px",
                padding: "20px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: "16px",
                }}
              >
                Thông tin lịch trình
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                
                <div>
                  <strong>Tên lịch trình:</strong> {scheduleDetails[0].schedule.scheduleName || "N/A"}
                </div>
                <div>
                  <strong>Khu vực:</strong>{" "}
                  <span style={{ fontWeight: "500", color: "#059669" }}>
                    {scheduleDetails[0].schedule.areaName || scheduleDetails[0].schedule.areaId || "N/A"}
                  </span>
                </div>
                <div>
                  <strong>Nhà vệ sinh:</strong>{" "}
                  <span style={{ fontWeight: "500", color: "#0369a1" }}>
                    {scheduleDetails[0].schedule.restroomNumber || scheduleDetails[0].schedule.restroomId || "N/A"}
                  </span>
                </div>
                <div>
                  <strong>Thùng rác:</strong>{" "}
                  <span style={{ fontWeight: "500", color: "#7c2d12" }}>
                    {scheduleDetails[0].schedule.trashBinName || scheduleDetails[0].schedule.trashBinId || "N/A"}
                  </span>
                </div>
                <div>
                  <strong>Ca làm việc:</strong>{" "}
                  <span style={{ fontWeight: "500", color: "#7c3aed" }}>
                    {scheduleDetails[0].schedule.shiftName || `Ca ${scheduleDetails[0].schedule.shiftId}` || "N/A"}
                  </span>
                </div>
                <div>
                  <strong>Loại:</strong>{" "}
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      ...getStatusColor(scheduleDetails[0].schedule.scheduleType),
                    }}
                  >
                    {scheduleDetails[0].schedule.scheduleType || "N/A"}
                  </span>
                </div>
                <div>
                  <strong>Thời gian:</strong>{" "}
                  {formatDateTime(scheduleDetails[0].schedule.startDate)} -{" "}
                  {formatDateTime(scheduleDetails[0].schedule.endDate)}
                </div>
                <div>
                  <strong>Phân công:</strong>{" "}
                  <span style={{ fontWeight: "500", color: "#dc2626" }}>
                    {scheduleDetails[0].schedule.assignmentName || scheduleDetails[0].schedule.assignmentId || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Details */}
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <HiOutlineClipboardList style={{ width: "20px", height: "20px" }} />
              Chi tiết công việc
            </h3>

            {isLoading && (
              <div style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                Đang tải chi tiết...
              </div>
            )}

            {error && (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "#dc2626",
                  backgroundColor: "#fee2e2",
                  borderRadius: "8px",
                }}
              >
                Lỗi khi tải chi tiết: {error.message}
              </div>
            )}

            {!isLoading && !error && scheduleDetails.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "#6b7280",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                }}
              >
                Không có chi tiết công việc nào
              </div>
            )}

            {!isLoading && !error && scheduleDetails.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {scheduleDetails.map((detail, index) => (
                  <div
                    key={detail.scheduleDetailId}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "16px",
                      backgroundColor: "white",
                    }}
                  >
                                        <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#111827",
                            marginBottom: "8px",
                          }}
                        >
                          Chi tiết công việc #{index + 1}
                        </h4>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            marginBottom: "12px",
                            lineHeight: "1.5",
                          }}
                        >
                          <strong>Mô tả:</strong> {detail.description || "Không có mô tả"}
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            marginBottom: "12px",
                            lineHeight: "1.5",
                          }}
                        >
                          <strong>ID:</strong> {detail.scheduleDetailId}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            ...getStatusColor(detail.status),
                            textAlign: "center",
                          }}
                        >
                          {detail.status || "N/A"}
                        </span>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: "#fef3c7",
                            color: "#d97706",
                            textAlign: "center",
                          }}
                        >
                          ⭐ {detail.rating || "0"}/5
                        </span>
                      </div>
                    </div>

                                        <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <HiOutlineUser style={{ width: "16px", height: "16px" }} />
                        <strong>Nhân viên:</strong>{" "}
                        <span style={{ fontWeight: "500", color: "#059669" }}>
                          {detail.workerName || detail.workerId || "Chưa phân công"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <HiOutlineUser style={{ width: "16px", height: "16px" }} />
                        <strong>Giám sát:</strong>{" "}
                        <span style={{ fontWeight: "500", color: "#dc2626" }}>
                          {detail.supervisorName || detail.supervisorId || "Không có"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <HiOutlineClock style={{ width: "16px", height: "16px" }} />
                        <strong>Ngày thực hiện:</strong>{" "}
                        {detail.date ? new Date(detail.date).toLocaleDateString("vi-VN") : "N/A"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <strong>Lịch trình ID:</strong>{" "}
                        {detail.scheduleId || "N/A"}
                      </div>
                    </div>

                    {/* Thời gian thực hiện chi tiết */}
                    {(detail.startTime || detail.endTime) && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "12px",
                          backgroundColor: "#f0f9ff",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#0369a1",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <HiOutlineClock style={{ width: "16px", height: "16px" }} />
                          <strong>Thời gian thực hiện:</strong>{" "}
                          {detail.startTime ? formatDateTime(detail.startTime) : "Chưa bắt đầu"} - {detail.endTime ? formatDateTime(detail.endTime) : "Chưa kết thúc"}
                        </div>
                      </div>
                    )}

                                         {detail.evidenceImage && (
                       <div
                         style={{
                           marginTop: "12px",
                           padding: "12px",
                           backgroundColor: "#f9fafb",
                           borderRadius: "6px",
                           fontSize: "14px",
                           color: "#374151",
                         }}
                       >
                         <strong>Hình ảnh chứng minh:</strong>
                         <img 
                           src={detail.evidenceImage} 
                           alt="Evidence" 
                           style={{ 
                             maxWidth: "100%", 
                             marginTop: "8px",
                             borderRadius: "4px"
                           }}
                         />
                       </div>
                     )}

                     {detail.isBackup && (
                       <div
                         style={{
                           marginTop: "12px",
                           fontSize: "14px",
                           color: "#d97706",
                           backgroundColor: "#fef3c7",
                           padding: "12px",
                           borderRadius: "6px",
                         }}
                       >
                         <strong>🔄 Backup:</strong> Đây là công việc thay thế
                         {detail.backupForUserId && (
                           <div style={{ marginTop: "4px", fontSize: "12px" }}>
                             Thay thế cho: <span style={{ fontWeight: "500" }}>
                               {detail.backupForUserName || detail.backupForUserId}
                             </span>
                           </div>
                         )}
                       </div>
                     )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "16px 24px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "white",
              color: "#374151",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
            onMouseEnter={(e: any) => {
              e.target.style.backgroundColor = "#f9fafb";
            }}
            onMouseLeave={(e: any) => {
              e.target.style.backgroundColor = "white";
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailsModal; 
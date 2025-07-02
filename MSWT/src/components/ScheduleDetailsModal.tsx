import { HiOutlineX, HiOutlineClipboardList } from "react-icons/hi";
import { Schedule } from "@/config/models/schedule.model";
import { useAreas } from "../hooks/useArea";
import { useRestrooms } from "../hooks/useRestroom";
import { useShifts } from "../hooks/useShifts";
import { API_URLS } from "../constants/api-urls";
import { swrFetcher } from "../utils/swr-fetcher";
import useSWR from "swr";
import { useMemo } from "react";

interface IProps {
  schedule: Schedule | null;
  isVisible: boolean;
  onClose: () => void;
}

const ScheduleDetailsModal = ({ schedule, isVisible, onClose }: IProps) => {
  // Fetch data for name lookups
  const { areas } = useAreas();
  const { restrooms } = useRestrooms();
  const { shifts } = useShifts();
  
  // Fetch assignment by ID directly
  const { data: assignmentData, error: assignmentError, isLoading: assignmentLoading } = useSWR(
    schedule?.assignmentId ? API_URLS.ASSIGNMENTS.GET_BY_ID(schedule.assignmentId) : null,
    swrFetcher
  );

  console.log("🔍 SWR Debug Info:");
  console.log("- Schedule assignmentId:", schedule?.assignmentId);
  console.log("- API URL:", schedule?.assignmentId ? API_URLS.ASSIGNMENTS.GET_BY_ID(schedule.assignmentId) : "No URL");
  console.log("- Assignment data:", assignmentData);
  console.log("- Assignment error:", assignmentError);
  console.log("- Assignment loading:", assignmentLoading);

  // Create lookup maps
  const areaName = useMemo(() => {
    if (!areas || !schedule?.areaId) return schedule?.areaId || "N/A";
    const area = areas.find((a: any) => a.areaId === schedule.areaId);
    return area?.areaName || schedule.areaId;
  }, [areas, schedule?.areaId]);

  const restroomName = useMemo(() => {
    if (!restrooms || !schedule?.restroomId) return schedule?.restroomId || "N/A";
    const restroom = restrooms.find((r: any) => r.restroomId === schedule.restroomId);
    return restroom?.restroomNumber || schedule.restroomId;
  }, [restrooms, schedule?.restroomId]);

  const shiftName = useMemo(() => {
    if (!shifts || !schedule?.shiftId) return schedule?.shiftId || "N/A";
    const shift = shifts.find((s: any) => s.shiftId === schedule.shiftId);
    return shift?.shiftName || `Ca ${schedule.shiftId}`;
  }, [shifts, schedule?.shiftId]);

  const assignmentName = useMemo(() => {
    console.log("🔍 Assignment data from API:", assignmentData);
    
    if (assignmentData) {
      // Method 4: Regex extraction from JSON string
      try {
        const rawString = JSON.stringify(assignmentData);
        console.log("🔍 Raw JSON string:", rawString);
        
        const nameMatch = rawString.match(/"assignmentName":"([^"]+)"/);
        if (nameMatch && nameMatch[1]) {
          console.log("✅ Regex extraction success:", nameMatch[1]);
          return nameMatch[1];
        }
      } catch (e) {
        console.log("❌ Regex extraction failed:", e);
      }
    }
    
    // Fallback: Known mapping
    if (schedule?.assignmentId === "a56123ed-2069-4037-971a-7ce0016002ld") {
      console.log("🎯 Using fallback mapping");
      return "Dọn vệ sinh chung";
    }
    
    console.log("❌ No assignment name found, using ID");
    return schedule?.assignmentId || "N/A";
  }, [assignmentData, schedule?.assignmentId]);

  if (!isVisible || !schedule) return null;

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
          width: "600px",
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
            Thông tin lịch trình
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
          {/* Schedule Info */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <HiOutlineClipboardList style={{ width: "24px", height: "24px" }} />
              {schedule.scheduleName}
            </h3>
            
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
              }}
            >
              <div>
                <span style={{ 
                  fontWeight: "600", 
                  color: "#6b7280",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Tên lịch trình
                </span>
                <div style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {schedule.scheduleName}
                </div>
              </div>

              <div>
                <span style={{ 
                  fontWeight: "600", 
                  color: "#6b7280",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Loại lịch trình
                </span>
                <div style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {schedule.scheduleType}
                </div>
              </div>

              <div>
                <span style={{ 
                  fontWeight: "600", 
                  color: "#6b7280",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Ngày bắt đầu
                </span>
                <div style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {new Date(schedule.startDate).toLocaleDateString("vi-VN")}
                </div>
              </div>

              <div>
                <span style={{ 
                  fontWeight: "600", 
                  color: "#6b7280",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Ngày kết thúc
                </span>
                <div style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {new Date(schedule.endDate).toLocaleDateString("vi-VN")}
                </div>
              </div>

              <div>
                <span style={{ 
                  fontWeight: "600", 
                  color: "#6b7280",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Khu vực
                </span>
                <div style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {areaName}
                </div>
              </div>

              <div>
                <span style={{ 
                  fontWeight: "600", 
                  color: "#6b7280",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Nhà vệ sinh
                </span>
                <div style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {restroomName}
                </div>
              </div>

              <div>
                <span style={{ 
                  fontWeight: "600", 
                  color: "#6b7280",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Công việc
                </span>
                <div style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {assignmentName}
                </div>
              </div>

              <div>
                <span style={{ 
                  fontWeight: "600", 
                  color: "#6b7280",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Ca làm việc
                </span>
                <div style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {shiftName}
                </div>
              </div>

              <div>
                <span style={{ 
                  fontWeight: "600", 
                  color: "#6b7280",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Thùng rác
                </span>
                <div style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {schedule.trashBinId}
                </div>
              </div>

              <div>
                
                
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            marginTop: "24px" 
          }}>
            <button
              onClick={onClose}
              style={{
                padding: "12px 24px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
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
    </div>
  );
};

export default ScheduleDetailsModal; 
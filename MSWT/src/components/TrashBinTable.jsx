import { useState } from "react";
import { HiOutlineDotsVertical, HiOutlineEye, HiOutlinePencil } from "react-icons/hi";
import { useAreas } from "../hooks/useArea";
import { useRestrooms } from "../hooks/useRestroom";

const TrashBinTable = ({ trashBins, onActionClick }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { areas } = useAreas();
  const { restrooms } = useRestrooms();

  // Debug log to check trash bins data
  console.log('TrashBinTable received trashBins:', trashBins);
  console.log('TrashBinTable trashBins length:', trashBins?.length);
  console.log('Sample trash bin with area data:', trashBins?.[0]);
  console.log('Areas data:', areas);
  console.log('Restrooms data:', restrooms);

  // Function to get area name by areaId
  const getAreaInfo = (areaId) => {
    if (!areaId || areaId === "string") {
      return { areaName: "Không có khu vực", floorNumber: null };
    }
    
    const area = areas?.find(a => a.areaId === areaId);
    return {
      areaName: area?.areaName || `Area: ${areaId.slice(-8)}`,
      floorNumber: area?.floorNumber
    };
  };

  // Function to get restroom number by restroomId
  const getRestroomNumber = (restroomId) => {
    if (!restroomId || restroomId === "string") {
      return "Không liên kết";
    }
    
    const restroom = restrooms?.find(r => r.restroomId === restroomId);
    return restroom?.restroomNumber || `WC-${restroomId.slice(-6)}`;
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case "hoạt động":
      case "danghoatdong":
      case "hoatdong":
        return { backgroundColor: "#dcfce7", color: "#15803d" };
      case "bảo trì":
      case "baotri":
      case "dangbaotri":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case "hỏng":
      case "hong":
      case "dahong":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  const getStatusDisplay = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case "danghoatdong":
      case "hoatdong":
        return "Đang hoạt động";
      case "dangbaotri":
      case "baotri":
        return "Đang bảo trì";
      case "dahong":
      case "hong":
        return "Đã hỏng";
      default:
        return status || "Không xác định";
    }
  };

  const handleDropdownToggle = (binId) => {
    console.log('🔄 Toggling dropdown for bin:', binId, 'Current open:', openDropdown);
    setOpenDropdown(openDropdown === binId ? null : binId);
  };

  const handleActionSelect = (action, bin) => {
    console.log('🎯 TrashBinTable handleActionSelect called:', { action, binId: bin.trashBinId || bin.id });
    try {
      if (onActionClick && typeof onActionClick === 'function') {
        onActionClick({ action, bin });
        console.log('✅ onActionClick called successfully');
      } else {
        console.warn('⚠️ onActionClick is not a function:', onActionClick);
      }
    } catch (error) {
      console.error('❌ Error in handleActionSelect:', error);
    } finally {
      setOpenDropdown(null);
    }
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
        maxHeight: "500px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 10 }} >
          <tr style={{ backgroundColor: "#FEF6F4" }}>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                minWidth: "180px"
              }}
            >
              Thông tin thùng rác
            </th>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                minWidth: "200px"
              }}
            >
              Vị trí
            </th>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                minWidth: "150px"
              }}
            >
              Khu vực
            </th>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                minWidth: "120px"
              }}
            >
              Restroom
            </th>
            <th
              style={{
                padding: "16px 24px",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                minWidth: "100px"
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
                minWidth: "130px"
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
                width: "80px"
              }}
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {trashBins.map((bin, index) => (
            <tr
              key={bin.trashBinId || bin.id}
              style={{
                borderTop: index > 0 ? "1px solid #f0f0f0" : "none",
                transition: "all 0.2s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                // Only apply hover if dropdown is not open for this row
                if (openDropdown !== (bin.trashBinId || bin.id)) {
                  e.currentTarget.style.backgroundColor = "#fafafa";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                // Only remove hover if dropdown is not open for this row
                if (openDropdown !== (bin.trashBinId || bin.id)) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {/* Thông tin thùng rác Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#111827",
                }}
              >
                <div>
                  <div style={{ fontWeight: "600", color: "#111827", marginBottom: "6px" }}>
                    Thùng #{bin.trashBinId?.slice(-8) || "N/A"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280", fontFamily: "monospace", backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "4px", display: "inline-block" }}>
                    ID: {bin.trashBinId || bin.id}
                  </div>
                </div>
              </td>

              {/* Vị trí Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                <div>
                  <div style={{ fontWeight: "500", marginBottom: "2px", color: "#374151" }}>
                    {bin.location || "Chưa có vị trí"}
                  </div>
                </div>
              </td>

              {/* Khu vực Column */}
              <td
                style={{
                  padding: "16px 24px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                <div>
                  <div style={{ fontWeight: "500", marginBottom: "2px", color: "#374151" }}>
                    {getAreaInfo(bin.areaId)?.areaName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                    {getAreaInfo(bin.areaId)?.floorNumber !== undefined 
                      ? (getAreaInfo(bin.areaId).floorNumber === 0 ? "Tầng trệt" : `Tầng ${getAreaInfo(bin.areaId).floorNumber}`)
                      : (bin.areaId && bin.areaId !== "string" ? "Đang tải thông tin tầng..." : "")
                    }
                  </div>
                </div>
              </td>

              {/* Restroom Column */}
              <td
                style={{
                  padding: "16px 24px",
                  textAlign: "center",
                }}
              >
                {bin.restroomId && bin.restroomId !== "string" ? (
                  <div style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px 12px",
                    backgroundColor: "#f0f9ff",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#0369a1",
                    maxWidth: "120px"
                  }}>
                    {getRestroomNumber(bin.restroomId)}
                  </div>
                ) : (
                  <div style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px 12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#6b7280"
                  }}>
                    Không liên kết
                  </div>
                )}
              </td>

              {/* Image Column */}
              <td
                style={{
                  padding: "16px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ 
                  width: "50px", 
                  height: "50px", 
                  backgroundColor: "#f9fafb", 
                  borderRadius: "6px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  margin: "0 auto",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb"
                }}>
                  {bin.image && bin.image !== "string" ? (
                    <img
                      src={`data:image/jpeg;base64,${bin.image}`}
                      alt="Trash bin"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    style={{ 
                      display: (bin.image && bin.image !== "string") ? 'none' : 'flex',
                      fontSize: '12px',
                      color: '#9ca3af',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    Không có
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
                  {getStatusDisplay(bin.status)}
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('📊 Dropdown toggle clicked for bin:', bin.trashBinId || bin.id);
                    handleDropdownToggle(bin.trashBinId || bin.id);
                  }}
                  style={{
                    color: "#6b7280",
                    background: "transparent",
                    border: "none",
                    padding: "8px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                    zIndex: 100,
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
                    style={{ width: "20px", height: "20px", pointerEvents: "none" }}
                  />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === (bin.trashBinId || bin.id) && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      right: "8px",
                      marginBottom: "8px",
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      zIndex: 1000,
                      minWidth: "140px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔍 View button clicked for bin:', bin.trashBinId || bin.id);
                        handleActionSelect('view', bin);
                      }}
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
                      <HiOutlineEye style={{ width: "16px", height: "16px", pointerEvents: "none" }} />
                      Xem chi tiết
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('✏️ Edit button clicked for bin:', bin.trashBinId || bin.id);
                        handleActionSelect('edit', bin);
                      }}
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
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      <HiOutlinePencil style={{ width: "16px", height: "16px", pointerEvents: "none" }} />
                      Sửa
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🧪 TEST: Button is clickable for bin:', bin.trashBinId || bin.id);
                        alert('Test successful! Buttons are working.');
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 16px",
                        border: "none",
                        backgroundColor: "#f0f9ff",
                        textAlign: "left",
                        fontSize: "12px",
                        color: "#0369a1",
                        cursor: "pointer",
                        borderTop: "1px solid #f3f4f6",
                        borderRadius: "0 0 8px 8px",
                      }}
                    >
                      🧪 Test Click
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
            zIndex: 999,
            backgroundColor: "transparent",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚫 Closing dropdown from overlay click');
            setOpenDropdown(null);
          }}
        />
      )}
    </div>
  );
};

export default TrashBinTable; 
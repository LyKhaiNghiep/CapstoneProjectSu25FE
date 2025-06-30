import {
  Floor,
  ICreateFloorRequest,
  IUpdateFloorRequest,
} from "@/config/models/floor.model";
import { Restroom } from "@/config/models/restroom.model";
import { useState } from "react";
import { HiOutlinePlus, HiOutlineSearch, HiX } from "react-icons/hi";
import FloorTable from "../components/FloorTable";
import Notification from "../components/Notification";
import Pagination from "../components/Pagination";
import { useFloors } from "../hooks/useFloor";

const Floors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddFloorPopup, setShowAddFloorPopup] = useState(false);
  const [showViewFloorModal, setShowViewFloorModal] = useState(false);
  const [showUpdateFloorModal, setShowUpdateFloorModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [sortState, setSortState] = useState("default");
  const [updateFloorData, setUpdateFloorData] = useState<IUpdateFloorRequest>({
    floorNumber: 0,
    numberOfBin: 0,
    numberOfRestroom: 0,
    status: "Hoạt động",
  });
  const [newFloor, setNewFloor] = useState<ICreateFloorRequest>({
    floorNumber: 0,
    numberOfBin: 0,
    numberOfRestroom: 0,
    status: "Hoạt động",
  });
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
  });

  const itemsPerPage = 5;

  const { floors, createAsync, updateAsync, deleteAsync } = useFloors();

  if (floors.length === 0) return null;

  const handleActionClick = async ({
    action,
    floor,
  }: {
    action: "view" | "update" | "delete";
    floor: Floor;
  }) => {
    console.log("🚀 Floors - handleActionClick called:", { action, floor });
    if (action === "view") {
      setSelectedFloor(floor);
      setShowViewFloorModal(true);
    } else if (action === "update") {
      setSelectedFloor(floor);
      setUpdateFloorData({
        floorNumber: floor.floorNumber,
        numberOfBin: floor.numberOfBin,
        numberOfRestroom: floor.numberOfRestroom,
        status: floor.status,
      });
      setShowUpdateFloorModal(true);
    } else if (action === "delete") {
      if (window.confirm("Bạn có chắc muốn xóa tầng này?")) {
        await deleteAsync(floor.floorId);
        alert("✅ Đã xóa tầng thành công!");
      }
    }
  };

  // Filtering and sorting logic
  const filteredFloors = floors?.filter((floor: Floor) =>
    floor?.floorNumber
      ?.toString()
      .toLowerCase()
      ?.includes(searchTerm?.toLowerCase())
  );

  const sortedFloors = [...filteredFloors]?.sort((a, b) => {
    if (sortState === "default") {
    } else if (sortState === "asc") {
      return a.floorNumber
        ?.toString()
        .toLowerCase()
        .localeCompare(b.floorNumber?.toString().toLowerCase());
    } else if (sortState === "desc") {
      return b.floorNumber
        ?.toString()
        .toLowerCase()
        .localeCompare(a.floorNumber?.toString().toLowerCase());
    }
    return 0;
  });

  const handleSortClick = () => {
    if (sortState === "default") {
      setSortState("asc");
    } else if (sortState === "asc") {
      setSortState("desc");
    } else {
      setSortState("default");
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(sortedFloors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFloors = sortedFloors.slice(startIndex, endIndex);

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const showNotificationMessage = (type: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      message,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const handleCloseViewModal = () => {
    setShowViewFloorModal(false);
    setSelectedFloor(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateFloorModal(false);
    setSelectedFloor(null);
    setUpdateFloorData({
      floorNumber: 0,
      numberOfBin: 0,
      numberOfRestroom: 0,
      status: "Hoạt động",
    });
  };

  const handleClosePopup = () => {
    setShowAddFloorPopup(false);
    setNewFloor({
      floorNumber: 0,
      numberOfBin: 0,
      numberOfRestroom: 0,
      status: "Hoạt động",
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewFloor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateChange = (e: any) => {
    const { name, value } = e.target;
    setUpdateFloorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitFloor = async (e: any) => {
    e.preventDefault();
    if (!newFloor.floorNumber || !newFloor.status) {
      showNotificationMessage(
        "error",
        "Vui lòng điền đầy đủ thông tin bắt buộc!"
      );
      return;
    }

    await createAsync(newFloor);

    handleClosePopup();
    showNotificationMessage("success", "Đã thêm tầng thành công!");
  };

  const handleSubmitUpdate = async (e: any) => {
    e.preventDefault();
    if (!updateFloorData.status) {
      showNotificationMessage(
        "error",
        "Vui lòng điền đầy đủ thông tin bắt buộc!"
      );
      return;
    }

    await updateAsync(selectedFloor?.floorId!, updateFloorData);

    handleCloseUpdateModal();
    showNotificationMessage("success", "Đã cập nhật tầng thành công!");
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

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
              Quản lý tầng
            </h1>
            <span>Trang chủ</span>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Quản lý tầng
            </span>
          </nav>
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
              placeholder="Tìm tầng"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "40%",
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
            <button
              onClick={() => setShowAddFloorPopup(true)}
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
              onMouseEnter={(e: any) =>
                (e.target.style.backgroundColor = "#E04B1F")
              }
              onMouseLeave={(e: any) =>
                (e.target.style.backgroundColor = "#FF5B27")
              }
            >
              <HiOutlinePlus style={{ width: "16px", height: "16px" }} />
              Thêm tầng
            </button>
          </div>
        </div>
      </div>

      {/* Floor Table Container */}
      <div style={{ flex: "1", overflow: "visible", minHeight: 0 }}>
        <FloorTable
          floors={currentFloors}
          onActionClick={handleActionClick}
          sortState={sortState}
          onSortClick={handleSortClick}
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

      {/* Add Floor Popup */}
      {showAddFloorPopup && (
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
              width: "600px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
                Thêm tầng mới
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
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            <form onSubmit={handleSubmitFloor}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Số tầng *
                </label>
                <input
                  type="number"
                  name="floorNumber"
                  value={newFloor.floorNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số tầng"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Số nhà vệ sinh *
                </label>
                <input
                  type="number"
                  name="numberOfRestroom"
                  value={newFloor.numberOfRestroom}
                  onChange={handleInputChange}
                  placeholder="Nhập số nhà vệ sinh"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Số thùng rác *
                </label>
                <input
                  type="number"
                  name="numberOfBin"
                  value={newFloor.numberOfBin}
                  onChange={handleInputChange}
                  placeholder="Nhập số thùng rác"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Trạng thái *
                </label>
                <select
                  name="status"
                  value={newFloor.status}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "white",
                  }}
                  required
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Bảo trì">Bảo trì</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={handleClosePopup}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#FF5B27",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Thêm tầng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Floor Modal */}
      {showViewFloorModal && selectedFloor && (
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
              width: "600px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
                Thông tin tầng
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
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Tên tầng
              </label>
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                }}
              >
                {selectedFloor.floorNumber}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Nhà vệ sinh ({selectedFloor.restrooms?.length || 0})
              </label>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {selectedFloor?.restrooms &&
                selectedFloor?.restrooms?.length > 0 ? (
                  selectedFloor?.restrooms?.map(
                    (restroom: Restroom, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "6px",
                          marginBottom: "4px",
                          fontSize: "14px",
                          color: "#374151",
                        }}
                      >
                        {restroom.restroomNumber}
                      </div>
                    )
                  )
                ) : (
                  <div
                    style={{
                      padding: "12px",
                      color: "#6b7280",
                      fontStyle: "italic",
                    }}
                  >
                    Chưa có nhà vệ sinh nào
                  </div>
                )}
              </div>
            </div>

            {/* <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Thùng rác ({selectedFloor.trashCans?.length || 0})
              </label>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {selectedFloor.trashCans?.length > 0 ? (
                  selectedFloor.trashCans.map((trashCan, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "6px",
                        marginBottom: "4px",
                        fontSize: "14px",
                        color: "#374151",
                      }}
                    >
                      {trashCan}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "12px",
                      color: "#6b7280",
                      fontStyle: "italic",
                    }}
                  >
                    Chưa có thùng rác nào
                  </div>
                )}
              </div>
            </div> */}

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Trạng thái
              </label>
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                }}
              >
                {selectedFloor.status}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleCloseViewModal}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Floor Modal */}
      {showUpdateFloorModal && selectedFloor && (
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
              width: "600px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
                Thêm tầng mới
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
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            <form onSubmit={handleSubmitUpdate}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Số tầng *
                </label>
                <input
                  type="number"
                  name="floorNumber"
                  value={updateFloorData.floorNumber}
                  onChange={handleUpdateChange}
                  placeholder="Nhập số tầng"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Số nhà vệ sinh *
                </label>
                <input
                  type="number"
                  name="numberOfRestroom"
                  value={updateFloorData.numberOfRestroom}
                  onChange={handleUpdateChange}
                  placeholder="Nhập số nhà vệ sinh"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Số thùng rác *
                </label>
                <input
                  type="number"
                  name="numberOfBin"
                  value={updateFloorData.numberOfBin}
                  onChange={handleUpdateChange}
                  placeholder="Nhập số thùng rác"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Trạng thái *
                </label>
                <select
                  name="status"
                  value={updateFloorData.status}
                  onChange={handleUpdateChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "white",
                  }}
                  required
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Bảo trì">Bảo trì</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseUpdateModal}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#FF5B27",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Floors;

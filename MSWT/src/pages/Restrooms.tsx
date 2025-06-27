import { Restroom } from "../config/models/restroom.model";
import { useRestrooms } from "../hooks/useRestroom";
import { useState } from "react";
import { HiOutlinePlus, HiOutlineSearch, HiX } from "react-icons/hi";
import Notification from "../components/Notification";
import Pagination from "../components/Pagination";
import RestroomTable from "../components/RestroomTable";

const Restrooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddRestroomPopup, setShowAddRestroomPopup] = useState(false);
  const [showViewRestroomModal, setShowViewRestroomModal] = useState(false);
  const [showUpdateRestroomModal, setShowUpdateRestroomModal] = useState(false);
  const [selectedRestroom, setSelectedRestroom] = useState<Restroom | null>(
    null
  );
  const [sortState, setSortState] = useState("default"); // "asc", "desc", or "default"
  const [updateRestroomData, setUpdateRestroomData] = useState<Restroom>();
  const [newRestroom, setNewRestroom] = useState({
    floorNumber: "",
    areaName: "",
    restroomNumber: "",
    description: "",
    status: "Hoạt động",
  });
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
  });

  const { restrooms } = useRestrooms();
  const itemsPerPage = 5;

  // Sample data for dropdowns
  const sampleAreas = [
    { id: "1", name: "Khu A" },
    { id: "2", name: "Khu B" },
    { id: "3", name: "Khu C" },
    { id: "4", name: "Khu D" },
  ];

  const sampleFloors = [
    { id: "1", name: "Tầng 1" },
    { id: "2", name: "Tầng 2" },
    { id: "3", name: "Tầng 3" },
    { id: "4", name: "Tầng 4" },
    { id: "5", name: "Tầng 5" },
  ];

  const sampleStatuses = [
    { id: "1", name: "Hoạt động" },
    { id: "2", name: "Bảo trì" },
  ];

  const handleActionClick = ({
    action,
    restroom,
  }: {
    action: string;
    restroom: Restroom;
  }) => {
    if (action === "view") {
      setSelectedRestroom(restroom);
      setShowViewRestroomModal(true);
    } else if (action === "update") {
      setSelectedRestroom(restroom);
      setUpdateRestroomData(restroom);
      setShowUpdateRestroomModal(true);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewRestroomModal(false);
    setSelectedRestroom(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateRestroomModal(false);
    setSelectedRestroom(null);
    setUpdateRestroomData({} as Restroom);
  };

  const handleUpdateChange = (e: any) => {
    const { name, value } = e.target;
    setUpdateRestroomData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitUpdate = (e: any) => {
    e.preventDefault();
    // TODO: will add update logic here
    // const updatedRestrooms = restrooms.map((restroom: Restroom) =>
    //   restroom.restroomId === selectedRestroom?.restroomId
    //     ? {
    //         ...restroom,
    //         ...updateRestroomData,
    //         room: `Nhà vệ sinh ${updateRestroomData?.restroomNumber}`,
    //         area: updateRestroomData?.areaId,
    //         details: updateRestroomData?.description || restroom.description,
    //       }
    //     : restroom
    // );
    handleCloseUpdateModal();
    showNotificationMessage("success", "Đã cập nhật nhà vệ sinh thành công!");
  };

  const handleAddRestroom = () => {
    setShowAddRestroomPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddRestroomPopup(false);
    setNewRestroom({
      floorNumber: "",
      areaName: "",
      restroomNumber: "",
      description: "",
      status: "Hoạt động",
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewRestroom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRestroom = (e: any) => {
    e.preventDefault();
    if (
      newRestroom.floorNumber &&
      newRestroom.areaName &&
      newRestroom.restroomNumber &&
      newRestroom.status
    ) {
      // TODO: will add restroom logic here
      // const restroomToAdd = {
      //   ...newRestroom,
      //   id: Date.now().toString(),
      //   room: `Nhà vệ sinh ${newRestroom.restroomNumber}`,
      //   area: newRestroom.areaName,
      //   details:
      //     newRestroom.description ||
      //     `Nhà vệ sinh ${newRestroom.restroomNumber} tại ${newRestroom.areaName}`,
      //   createdDate: new Date().toISOString().split("T")[0],
      // };

      handleClosePopup();
      showNotificationMessage("success", "Đã thêm nhà vệ sinh thành công!");
    } else {
      showNotificationMessage(
        "error",
        "Vui lòng điền đầy đủ thông tin bắt buộc!"
      );
    }
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

  const filteredRestrooms = restrooms?.filter(
    (restroom) =>
      restroom?.restroomNumber
        ?.toLowerCase()
        .includes(searchTerm?.toLowerCase()) ||
      restroom?.areaId?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      restroom?.description?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Sort filtered restrooms based on sort state
  const sortedRestrooms = [...filteredRestrooms]?.sort((a: any, b: any) => {
    if (sortState === "default") {
      // Sort by creation date (newest first)
      return new Date(b.createdAt!);
    } else if (sortState === "asc") {
      // Sort by room name A-Z
      return a.restroomNumber
        .toLowerCase()
        .localeCompare(b.restroomNumber?.toLowerCase());
    } else if (sortState === "desc") {
      // Sort by room name Z-A
      return b.restroomNumber
        .toLowerCase()
        .localeCompare(a.restroomNumber?.toLowerCase());
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
  const totalPages = Math.ceil(sortedRestrooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRestrooms = sortedRestrooms.slice(startIndex, endIndex);

  // Reset to page 1 when searching
  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
              Danh sách nhà vệ sinh
            </h1>
            <span>Trang chủ</span>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Danh sách nhà vệ sinh
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
              placeholder="Tìm nhà vệ sinh"
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
            {/* Add Restroom Button */}
            <button
              onClick={handleAddRestroom}
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
              Thêm nhà vệ sinh
            </button>
          </div>
        </div>
      </div>

      {/* Restroom Table Container */}
      <div style={{ flex: "1", overflow: "auto", minHeight: 0 }}>
        <RestroomTable
          restrooms={currentRestrooms}
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

      {/* Add Restroom Popup */}
      {showAddRestroomPopup && (
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
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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
                Thêm nhà vệ sinh mới
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
                onMouseEnter={(e: any) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e: any) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitRestroom}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Tầng *
                </label>
                <select
                  name="floorNumber"
                  value={newRestroom.floorNumber}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="">Chọn tầng</option>
                  {sampleFloors.map((floor) => (
                    <option key={floor.id} value={floor.name}>
                      {floor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Khu vực *
                </label>
                <select
                  name="areaName"
                  value={newRestroom.areaName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="">Chọn khu vực</option>
                  {sampleAreas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Số phòng *
                </label>
                <input
                  type="text"
                  name="restroomNumber"
                  value={newRestroom.restroomNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập số phòng"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Trạng thái *
                </label>
                <select
                  name="status"
                  value={newRestroom.status}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  {sampleStatuses.map((status) => (
                    <option key={status.id} value={status.name}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={newRestroom.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Nhập mô tả chi tiết..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    resize: "vertical",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={handleClosePopup}
                  style={{
                    padding: "12px 20px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e: any) =>
                    (e.target.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e: any) =>
                    (e.target.style.backgroundColor = "white")
                  }
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "#FF5B27",
                    color: "white",
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
                  Thêm nhà vệ sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Restroom Modal */}
      {showViewRestroomModal && selectedRestroom && (
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
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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
                Chi tiết nhà vệ sinh
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
                onMouseEnter={(e: any) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e: any) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Restroom Info */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Restroom Details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Tên phòng
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {selectedRestroom.restroomNumber}
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Khu vực
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {selectedRestroom.area?.areaName}
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Tầng
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {selectedRestroom.area?.floor?.floorNumber}
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Số phòng
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {selectedRestroom.restroomNumber}
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Ngày tạo
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {selectedRestroom.createdAt
                      ? new Date(selectedRestroom.createdAt).toLocaleDateString(
                          "vi-VN"
                        )
                      : "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                    }}
                  >
                    Trạng thái
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "4px 0 0 0",
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
                          selectedRestroom.status === "Hoạt động"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          selectedRestroom.status === "Hoạt động"
                            ? "#15803d"
                            : "#dc2626",
                      }}
                    >
                      {selectedRestroom.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#6b7280",
                  }}
                >
                  Mô tả chi tiết
                </label>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#111827",
                    margin: "4px 0 0 0",
                    lineHeight: "1.6",
                  }}
                >
                  {selectedRestroom.description || "Chưa có mô tả"}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "24px",
              }}
            >
              <button
                onClick={handleCloseViewModal}
                style={{
                  padding: "12px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: "white",
                  color: "#374151",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e: any) =>
                  (e.target.style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e: any) =>
                  (e.target.style.backgroundColor = "white")
                }
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Restroom Modal */}
      {showUpdateRestroomModal && selectedRestroom && (
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
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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
                Cập nhật nhà vệ sinh
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
                onMouseEnter={(e: any) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e: any) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitUpdate}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Tầng *
                </label>
                <select
                  name="floorNumber"
                  value={updateRestroomData?.floorId}
                  onChange={handleUpdateChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="">Chọn tầng</option>
                  {sampleFloors.map((floor) => (
                    <option key={floor.id} value={floor.name}>
                      {floor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Khu vực *
                </label>
                <select
                  name="areaName"
                  value={updateRestroomData?.areaId}
                  onChange={handleUpdateChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="">Chọn khu vực</option>
                  {sampleAreas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Số phòng *
                </label>
                <input
                  type="text"
                  name="restroomNumber"
                  value={updateRestroomData?.restroomNumber}
                  onChange={handleUpdateChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Trạng thái *
                </label>
                <select
                  name="status"
                  value={updateRestroomData?.status}
                  onChange={handleUpdateChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  {sampleStatuses.map((status) => (
                    <option key={status.id} value={status.name}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={updateRestroomData?.description}
                  onChange={handleUpdateChange}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    resize: "vertical",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseUpdateModal}
                  style={{
                    padding: "12px 20px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e: any) =>
                    (e.target.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e: any) =>
                    (e.target.style.backgroundColor = "white")
                  }
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "#FF5B27",
                    color: "white",
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

export default Restrooms;

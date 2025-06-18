import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Notification from "../components/Notification";
import styles from "./AddRestroom.module.css";

const AddRestroom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restroomNumber: "",
    areaName: "",
    floorNumber: "",
    status: "",
    description: "",
  });
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for dropdowns - later will be fetched from API
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showNotification = (type, message) => {
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

  const handleSave = async () => {
    // Validate form data
    if (
      !formData.restroomNumber ||
      !formData.areaName ||
      !formData.floorNumber ||
      !formData.status
    ) {
      showNotification("error", "Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Adding new restroom:", formData);

      // Show success notification
      showNotification("success", "Thêm nhà vệ sinh mới thành công!");

      // Navigate back after a short delay to show the notification
      setTimeout(() => {
        navigate("/restrooms");
      }, 1500);
    } catch (error) {
      console.error("Error adding restroom:", error);
      showNotification(
        "error",
        "Có lỗi xảy ra khi thêm nhà vệ sinh. Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button
          onClick={() => navigate("/restrooms")}
          className={styles.breadcrumbButton}
        >
          Nhà vệ sinh
        </button>
        <span className={styles.breadcrumbSeparator}>›</span>
        <span className={styles.breadcrumbCurrent}>Thêm mới nhà vệ sinh</span>
      </div>

      {/* Page Title */}
      <h1 className={styles.pageTitle}>Thêm Nhà Vệ Sinh</h1>

      {/* Add Form Card */}
      <div className={styles.addCard}>
        {/* Số phòng nhà vệ sinh */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>
            Số phòng <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.restroomNumber}
            onChange={(e) =>
              handleInputChange("restroomNumber", e.target.value)
            }
            className={styles.fieldInput}
            placeholder="203"
          />
        </div>

        {/* Khu vực */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>
            Khu vực <span className={styles.required}>*</span>
          </label>
          <select
            value={formData.areaName}
            onChange={(e) => handleInputChange("areaName", e.target.value)}
            className={styles.fieldSelect}
          >
            <option value="">Chọn khu vực</option>
            {sampleAreas.map((area) => (
              <option key={area.id} value={area.name}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tầng */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>
            Tầng <span className={styles.required}>*</span>
          </label>
          <select
            value={formData.floorNumber}
            onChange={(e) => handleInputChange("floorNumber", e.target.value)}
            className={styles.fieldSelect}
          >
            <option value="">Chọn tầng</option>
            {sampleFloors.map((floor) => (
              <option key={floor.id} value={floor.name}>
                {floor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Trạng thái */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>
            Trạng thái <span className={styles.required}>*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className={styles.fieldSelect}
          >
            <option value="">Chọn trạng thái</option>
            {sampleStatuses.map((status) => (
              <option key={status.id} value={status.name}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mô tả */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className={styles.fieldTextarea}
            rows={4}
            placeholder="Nhập mô tả chi tiết..."
          />
        </div>

        {/* Action Button */}
        <div className={styles.buttonContainer}>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`${styles.addButton} ${
              isLoading ? styles.addButtonLoading : ""
            }`}
          >
            {isLoading ? "Đang thêm..." : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRestroom;

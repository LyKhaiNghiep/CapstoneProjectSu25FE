import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Notification from "../components/Notification";
import styles from "./EditRestroom.module.css";

const EditRestroom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restroomData, setRestroomData] = useState(null);
  const [formData, setFormData] = useState({
    floorNumber: "",
    areaName: "",
    restroomNumber: "",
    description: "",
    status: "",
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

  // Sample data - should match the data from RestroomDetails page
  const sampleRestrooms = [
    {
      id: "1",
      details: "Có 2 thùng rác trong phòng, 1 thùng ngoài",
      status: "Hoạt động",
      floorNumber: "Tầng 1",
      areaName: "Khu A",
      restroomNumber: "01",
      description:
        "Nhà vệ sinh có 2 thùng rác trong phòng và 1 thùng rác ngoài. Đảm bảo vệ sinh sạch sẽ các thùng rác.",
    },
    {
      id: "2",
      status: "Bảo trì",
      floorNumber: "1",
      areaName: "B",
      restroomNumber: "02",
      description:
        "Nhà vệ sinh với thùng rác được đặt kế bên chậu cây, gần hành lang. Hiện đang trong quá trình bảo trì định kỳ.",
    },
  ];

  useEffect(() => {
    // Find restroom data by ID
    const restroom = sampleRestrooms.find((r) => r.id === id);
    if (restroom) {
      setRestroomData(restroom);
      setFormData({
        floorNumber: restroom.floorNumber,
        areaName: restroom.areaName,
        restroomNumber: restroom.restroomNumber,
        description: restroom.description,
        status: restroom.status,
      });
    }
  }, [id]);

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
      !formData.floorNumber ||
      !formData.areaName ||
      !formData.restroomNumber ||
      !formData.status
    ) {
      showNotification("error", "Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving restroom data:", formData);

      // Show success notification
      showNotification("success", "Cập nhật thông tin nhà vệ sinh thành công!");

      // Navigate back after a short delay to show the notification
      setTimeout(() => {
        navigate("/restrooms");
      }, 1500);
    } catch (error) {
      console.error("Error saving restroom data:", error);
      showNotification(
        "error",
        "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/restrooms");
  };

  if (!restroomData) {
    return (
      <div className={styles.notFound}>
        <div>Không tìm thấy thông tin nhà vệ sinh</div>
      </div>
    );
  }

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
        <span className={styles.breadcrumbCurrent}>Cập nhật nhà vệ sinh</span>
      </div>

      {/* Page Title */}
      <h1 className={styles.pageTitle}>Cập nhật nhà vệ sinh</h1>

      {/* Edit Form Card */}
      <div className={styles.editCard}>
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

        {/* Số phòng */}
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
            placeholder="Nhập ID nhà vệ sinh"
          />
        </div>

        {/* Status */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>
            Status <span className={styles.required}>*</span>
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

        {/* Description */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className={styles.fieldTextarea}
            rows={4}
            placeholder="Nhập mô tả chi tiết..."
          />
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`${styles.saveButton} ${
              isLoading ? styles.saveButtonLoading : ""
            }`}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className={styles.cancelButton}
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRestroom;

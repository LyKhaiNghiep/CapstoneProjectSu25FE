import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./RestroomDetails.module.css";

const RestroomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restroomData, setRestroomData] = useState(null);

  // Sample data - should match the data from Restrooms page
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
    const restroom = sampleRestrooms.find((t) => t.id === id);
    setRestroomData(restroom);
  }, [id]);

  if (!restroomData) {
    return (
      <div className={styles.notFound}>
        <div>Không tìm thấy thông tin nhà vệ sinh</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button
          onClick={() => navigate("/restrooms")}
          className={styles.breadcrumbButton}
        >
          Nhà vệ sinh
        </button>
        <span className={styles.breadcrumbSeparator}>›</span>
        <span className={styles.breadcrumbCurrent}>Thông tin chi tiết</span>
      </div>

      {/* Page Title */}
      <h1 className={styles.pageTitle}>Thông tin nhà vệ sinh</h1>

      {/* Details Card */}
      <div className={styles.detailsCard}>
        {/* tầng của NVS */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>Tầng</label>
          <div className={styles.fieldValue}>{restroomData.floorNumber}</div>
        </div>

        {/* Khu vực */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>Khu vực</label>
          <div className={styles.fieldValue}>{restroomData.areaName}</div>
        </div>

        {/* Số phòng NVS */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>Số phòng</label>
          <div className={styles.fieldValue}>{restroomData.restroomNumber}</div>
        </div>

        {/* Trạng thái */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>Trạng thái</label>
          <div className={styles.fieldValue}>
            <span
              className={`${styles.statusBadge} ${
                restroomData.status === "Hoạt động"
                  ? styles.statusActive
                  : styles.statusMaintenance
              }`}
            >
              {restroomData.status}
            </span>
          </div>
        </div>

        {/* Mô tả */}
        <div className={styles.fieldContainer}>
          <label className={styles.fieldLabel}>Mô tả</label>
          <div className={styles.fieldValueLarge}>
            {restroomData.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestroomDetails;

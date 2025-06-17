import { HiDotsVertical } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RestroomTable.module.css";

const RestroomTable = ({ data = [] }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef([]);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown !== null &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleMenuAction = (action, item) => {
    console.log(`${action} for item:`, item);
    setOpenDropdown(null);

    if (action === "Xem chi tiết") {
      navigate(`/restrooms/${item.id}`);
    } else if (action === "Chỉnh sửa") {
      navigate(`/restrooms/${item.id}/edit`);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.tableHeaderCell}>Phòng</th>
            <th className={styles.tableHeaderCell}>Khu vực</th>
            <th className={styles.tableHeaderCell}>Chi tiết</th>
            <th className={styles.tableHeaderCell}>Trạng thái</th>
            <th className={styles.tableHeaderCell}></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className={styles.tableCell}>{item.room}</td>
              <td className={styles.tableCell}>{item.area}</td>
              <td className={styles.tableCell}>{item.details}</td>
              <td className={styles.statusCell}>
                <span
                  className={`${styles.statusBadge} ${
                    item.status === "Hoạt động"
                      ? styles.statusActive
                      : styles.statusMaintenance
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className={styles.actionCell}>
                <div
                  ref={(el) => (dropdownRefs.current[index] = el)}
                  className={styles.dropdownContainer}
                >
                  <button
                    onClick={() => handleDropdownToggle(index)}
                    className={styles.actionButton}
                  >
                    <HiDotsVertical className={styles.actionIcon} />
                  </button>

                  {openDropdown === index && (
                    <div className={styles.dropdown}>
                      <button
                        onClick={() => handleMenuAction("Xem chi tiết", item)}
                        className={`${styles.dropdownItem} ${styles.dropdownItemFirst}`}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleMenuAction("Chỉnh sửa", item)}
                        className={`${styles.dropdownItem} ${styles.dropdownItemLast}`}
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestroomTable;

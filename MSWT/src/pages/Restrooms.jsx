import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import RestroomTable from "../components/RestroomTable";
import Pagination from "../components/Pagination";
import styles from "./Restrooms.module.css";

const Restrooms = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Sample data
  const restroomData = [
    {
      id: "1",
      room: "Nhà vệ sinh 01",
      area: "Khu A",
      details: "Có 2 thùng rác trong phòng, 1 thùng ngoài",
      status: "Hoạt động",
    },
    {
      id: "2",
      room: "Nhà vệ sinh 02",
      area: "Khu B",
      details: "Thùng rác kế bên chậu cây, gần hành lang",
      status: "Bảo trì",
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddRestroom = () => {
    navigate("/restrooms/add");
  };

  const addButton = (
    <button className={styles.addButton} onClick={handleAddRestroom}>
      Thêm phòng
    </button>
  );

  return (
    <div className={styles.container}>
      <TopBar
        title="Nhà Vệ Sinh"
        breadcrumbs={["Nhà vệ sinh"]}
        actionButton={addButton}
      />

      <div className={styles.content}>
        <RestroomTable data={restroomData} />
        <Pagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Restrooms;

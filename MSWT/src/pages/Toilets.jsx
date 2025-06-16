import { useState } from "react";
import TopBar from "../components/TopBar";
import ToiletTable from "../components/ToiletTable";
import Pagination from "../components/Pagination";

const Toilets = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data matching your Figma design
  const toiletData = [
    {
      room: "Nhà vệ sinh 01",
      area: "Khu A",
      details: "Có 2 thùng rác trong phòng, 1 thùng ngoài",
      status: "Hoạt động",
    },
    {
      room: "Nhà vệ sinh 02",
      area: "Khu B",
      details: "Thùng rác kế bên chậu cây, gần hành lang",
      status: "Bảo trì",
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const addButton = (
    <button
      style={{
        backgroundColor: "#FF5B27",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
      }}
    >
      Thêm phòng
    </button>
  );

  return (
    <div
      style={{
        backgroundColor: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar
        title="Nhà Vệ Sinh"
        breadcrumbs={["Nhà vệ sinh"]}
        actionButton={addButton}
      />

      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <ToiletTable data={toiletData} />
        <Pagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Toilets;

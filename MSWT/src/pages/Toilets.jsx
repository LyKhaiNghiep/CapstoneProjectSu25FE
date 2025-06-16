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
      area: "Khu vực A",
      details: "Có 2 thùng rác trong phòng, 1 thùng ngoài",
      status: "Hoạt động",
    },
    {
      room: "Nhà vệ sinh 2",
      area: "Khu B",
      details: "Thùng rác kê bên cháu cầy, gận hành lang",
      status: "Bảo trì",
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddRoom = () => {
    console.log("Add room clicked");
    // Add your logic here
  };

  const handleActionClick = (toilet) => {
    console.log("Action clicked for:", toilet);
    // Add your logic here
  };

  const addRoomButton = (
    <button
      onClick={handleAddRoom}
      className="bg-[#FF5B27] hover:bg-[#E04F1F] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
    >
      Thêm phòng
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Top Bar */}
      <TopBar
        title="Nhà Vệ Sinh"
        breadcrumbs={["Nhà vệ sinh"]}
        actionButton={addRoomButton}
      />

      {/* Main Content with proper spacing */}
      <div className="flex-1 bg-gray-100">
        {/* Table */}
        <ToiletTable toilets={toiletData} onActionClick={handleActionClick} />

        {/* Pagination with consistent margins */}
        <div className="mx-8 pb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Toilets;

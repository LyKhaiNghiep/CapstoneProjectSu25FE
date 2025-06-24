// import React from "react"; // Removed unused import

const Restrooms = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <nav className="text-gray-500 text-sm mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Danh sách nhà vệ sinh
          </h1>
          <span>Trang chủ</span>
          <span className="mx-2">›</span>
          <span className="text-gray-700 font-medium">
            Danh sách nhà vệ sinh
          </span>
        </nav>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quản lý nhà vệ sinh
        </h2>
        <p className="text-gray-600">
          Nội dung trang quản lý nhà vệ sinh sẽ được phát triển tại đây.
        </p>
      </div>
    </div>
  );
};

export default Restrooms; 
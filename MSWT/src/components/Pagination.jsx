import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const Pagination = ({ currentPage = 1, totalPages = 3, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        paddingTop: "16px",
        paddingBottom: "16px",
      }}
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #FFDED4",
          backgroundColor: "#FFDED4",
          color: currentPage === 1 ? "#9ca3af" : "#374151",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        <HiOutlineChevronLeft style={{ width: "16px", height: "16px" }} />
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            border: "1px solid #FF5B27",
            backgroundColor: page === currentPage ? "#FF5B27" : "#FFDED4",
            color: page === currentPage ? "white" : "#374151",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #FFDED4",
          backgroundColor: "#FFDED4",
          color: currentPage === totalPages ? "#9ca3af" : "#374151",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        <HiOutlineChevronRight style={{ width: "16px", height: "16px" }} />
      </button>
    </div>
  );
};

export default Pagination;

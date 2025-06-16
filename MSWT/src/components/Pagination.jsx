import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const Pagination = ({ currentPage = 1, totalPages = 3, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-3 py-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          p-3 rounded-full border transition-colors bg-[#FFDED4]
          ${
            currentPage === 1
              ? "border-[#FFDED4] text-white cursor-not-allowed"
              : "border-[#FFDED4] text-white hover:bg-gray-50"
          }
        `}
      >
        <HiOutlineChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-12 h-12 rounded-full border transition-colors font-medium text-sm
            ${
              page === currentPage
                ? "bg-[#FF5B27] text-white border-[#FF5B27]"
                : "border-[#FF5B27] text-white hover:bg-gray-50 bg-[#FFDED4]"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          p-3 rounded-full border transition-colors bg-[#FFDED4]
          ${
            currentPage === totalPages
              ? "border-[#FFDED4] text-white cursor-not-allowed"
              : "border-[#FFDED4] text-white hover:bg-gray-50"
          }
        `}
      >
        <HiOutlineChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;

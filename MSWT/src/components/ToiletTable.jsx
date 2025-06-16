import { HiOutlineDotsVertical } from "react-icons/hi";

const ToiletTable = ({ toilets, onActionClick }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "hoạt động":
        return { backgroundColor: "#dcfce7", color: "#15803d" };
      case "bảo trì":
        return { backgroundColor: "#fed7aa", color: "#c2410c" };
      case "hỏng":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <div
      style={{
        marginLeft: "32px",
        marginRight: "32px",
        marginTop: "32px",
        marginBottom: "24px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#FFDED4" }}>
            <th
              style={{
                padding: "20px 32px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "600",
                color: "black",
              }}
            >
              Phòng
            </th>
            <th
              style={{
                padding: "20px 32px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "600",
                color: "black",
              }}
            >
              Khu vực
            </th>
            <th
              style={{
                padding: "20px 32px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "600",
                color: "black",
              }}
            >
              Chi tiết
            </th>
            <th
              style={{
                padding: "20px 32px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "600",
                color: "black",
              }}
            >
              Trạng thái
            </th>
            <th
              style={{
                padding: "20px 32px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "600",
                color: "black",
                width: "80px",
              }}
            ></th>
          </tr>
        </thead>
        <tbody>
          {toilets.map((toilet, index) => (
            <tr
              key={index}
              style={{
                borderTop: index > 0 ? "1px solid #e5e7eb" : "none",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9fafb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <td
                style={{
                  padding: "20px 32px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "black",
                }}
              >
                {toilet.room}
              </td>
              <td
                style={{
                  padding: "20px 32px",
                  fontSize: "14px",
                  color: "black",
                }}
              >
                {toilet.area}
              </td>
              <td
                style={{
                  padding: "20px 32px",
                  fontSize: "14px",
                  color: "black",
                  maxWidth: "300px",
                }}
              >
                {toilet.details}
              </td>
              <td style={{ padding: "20px 32px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "9999px",
                    ...getStatusColor(toilet.status),
                  }}
                >
                  {toilet.status}
                </span>
              </td>
              <td
                style={{
                  padding: "20px 32px",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => onActionClick(toilet)}
                  style={{
                    color: "#6b7280",
                    background: "transparent",
                    border: "none",
                    padding: "8px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#374151";
                    e.target.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#6b7280";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <HiOutlineDotsVertical
                    style={{ width: "20px", height: "20px" }}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToiletTable;

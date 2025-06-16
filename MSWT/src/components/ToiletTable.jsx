import { HiDotsVertical } from "react-icons/hi";

const ToiletTable = ({ data = [] }) => {
  return (
    <div
      style={{
        backgroundColor: "transparent",
        width: "100%",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#FFDED4" }}>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "500",
                color: "black",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Phòng
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "500",
                color: "black",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Khu vực
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "500",
                color: "black",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Chi tiết
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "500",
                color: "black",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Trạng thái
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "500",
                color: "black",
                borderBottom: "1px solid #e5e7eb",
              }}
            ></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  color: "black",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {item.room}
              </td>
              <td
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  color: "black",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {item.area}
              </td>
              <td
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  color: "black",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {item.details}
              </td>
              <td
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor:
                      item.status === "Hoạt động" ? "#dcfce7" : "#fef3c7",
                    color: item.status === "Hoạt động" ? "#166534" : "#92400e",
                  }}
                >
                  {item.status}
                </span>
              </td>
              <td
                style={{
                  padding: "16px",
                  textAlign: "center",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HiDotsVertical
                    style={{ width: "16px", height: "16px", color: "#6b7280" }}
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

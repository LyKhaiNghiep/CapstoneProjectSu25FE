import { HiOutlineHome, HiOutlineChevronRight } from "react-icons/hi";

const TopBar = ({ title, breadcrumbs = [], actionButton }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        width: "100%",
      }}
    >
      <div
        style={{
          marginLeft: "20px",
          marginRight: "20px",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "black",
            margin: 0,
            marginBottom: "12px",
          }}
        >
          {title}
        </h1>

        {/* Breadcrumb and Button on same level */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Breadcrumbs */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "black",
            }}
          >
            <HiOutlineHome style={{ width: "14px", height: "14px" }} />
            <span>Trang chủ</span>
            {breadcrumbs.map((crumb, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <HiOutlineChevronRight
                  style={{ width: "14px", height: "14px" }}
                />
                <span>{crumb}</span>
              </div>
            ))}
          </nav>

          {/* Action Button */}
          {actionButton && <div>{actionButton}</div>}
        </div>
      </div>
    </div>
  );
};

export default TopBar;

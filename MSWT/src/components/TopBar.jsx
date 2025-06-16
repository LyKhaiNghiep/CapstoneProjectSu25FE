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
          marginLeft: "32px",
          marginRight: "32px",
          paddingTop: "32px",
          paddingBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left side - Title and Breadcrumbs */}
          <div>
            {/* Breadcrumbs */}
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "black",
                marginBottom: "12px",
              }}
            >
              <HiOutlineHome style={{ width: "16px", height: "16px" }} />
              <span>Trang chủ</span>
              {breadcrumbs.map((crumb, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <HiOutlineChevronRight
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>{crumb}</span>
                </div>
              ))}
            </nav>

            {/* Page Title */}
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                color: "black",
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Right side - Action Button */}
          {actionButton && <div>{actionButton}</div>}
        </div>
      </div>
    </div>
  );
};

export default TopBar;

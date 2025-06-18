import { useState, useEffect } from "react";
import { HiOutlineSearch, HiOutlinePlus, HiX } from "react-icons/hi";
import UserTable from "../components/UserTable";
import Pagination from "../components/Pagination";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateUserData, setUpdateUserData] = useState({
    name: "",
    position: "",
    status: ""
  });
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    position: "",
    phone: "",
    address: "",
    status: "Đang làm việc",
    avatar: "",
    avatarFile: null
  });

  const itemsPerPage = 5; // Số user hiển thị mỗi trang

  // Sample user data matching the image - Dữ liệu mặc định
  const defaultUsers = [
    {
      id: 1,
      name: "Thịnh",
      email: "thinh@company.com",
      position: "Công nhân",
      phone: "08123455986",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      status: "Đang làm việc",
      avatar: "https://i.pinimg.com/736x/65/d6/c4/65d6c4b0cc9e85a631cf2905a881b7f0.jpg",
      createdDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Nghiệp",
      email: "nghiep@company.com",
      position: "Giám sát viên",
      phone: "01257896658",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      status: "Nghỉ phép",
      avatar: "https://i.pinimg.com/originals/88/0d/57/880d5790254f68ce92fe285cd255bb4d.gif",
      createdDate: "2024-02-10"
    },
    {
      id: 3,
      name: "Khang",
      email: "khang@company.com",
      position: "Công nhân",
      phone: "01023554445",
      address: "789 Đường DEF, Quận 3, TP.HCM",
      status: "Nghỉ việc",
      avatar: "https://i.pinimg.com/originals/74/e3/0f/74e30f31b38afa752f79f7ff0315ce37.gif",
      createdDate: "2024-01-20"
    },
    {
      id: 4,
      name: "Minh",
      email: "minh@company.com",
      position: "Công nhân",
      phone: "09876543210",
      address: "321 Đường GHI, Quận 4, TP.HCM",
      status: "Đang làm việc",
      avatar: "https://i.pinimg.com/originals/2c/b5/b7/2cb5b7bfa9506a980435078b0d41379d.gif",
      createdDate: "2024-03-05"
    },
    {
      id: 5,
      name: "Lan",
      email: "lan@company.com",
      position: "Quản lý",
      phone: "01588999777",
      address: "654 Đường JKL, Quận 5, TP.HCM",
      status: "Đang làm việc",
      avatar: "https://i.pinimg.com/originals/97/16/5e/97165e191052892894cb886b4a8c0971.gif",
      createdDate: "2024-02-28"
    },
    {
      id: 6,
      name: "Hạnh",
      email: "hanh@company.com",
      position: "Công nhân",
      phone: "0987654321",
      address: "111 Đường MNO, Quận 6, TP.HCM",
      status: "Đang làm việc",
      avatar: "https://i.pinimg.com/736x/65/d6/c4/65d6c4b0cc9e85a631cf2905a881b7f0.jpg",
      createdDate: "2024-03-10"
    },
    {
      id: 7,
      name: "Tuấn",
      email: "tuan@company.com",
      position: "Giám sát viên",
      phone: "0123456789",
      address: "222 Đường PQR, Quận 7, TP.HCM",
      status: "Nghỉ phép",
      avatar: "https://i.pinimg.com/originals/88/0d/57/880d5790254f68ce92fe285cd255bb4d.gif",
      createdDate: "2024-03-15"
    },
    {
      id: 8,
      name: "Mai",
      email: "mai@company.com",
      position: "Công nhân",
      phone: "0369852147",
      address: "333 Đường STU, Quận 8, TP.HCM",
      status: "Đang làm việc",
      avatar: "https://i.pinimg.com/originals/97/16/5e/97165e191052892894cb886b4a8c0971.gif",
      createdDate: "2024-03-20"
    },
    {
      id: 9,
      name: "Hoàng",
      email: "hoang@company.com",
      position: "Quản lý",
      phone: "0741852963",
      address: "444 Đường VWX, Quận 9, TP.HCM",
      status: "Đang làm việc",
      avatar: "https://i.pinimg.com/originals/74/e3/0f/74e30f31b38afa752f79f7ff0315ce37.gif",
      createdDate: "2024-03-25"
    },
    {
      id: 10,
      name: "Linh",
      email: "linh@company.com",
      position: "Công nhân",
      phone: "0159753486",
      address: "555 Đường YZ, Quận 10, TP.HCM",
      status: "Nghỉ việc",
      avatar: "https://i.pinimg.com/originals/2c/b5/b7/2cb5b7bfa9506a980435078b0d41379d.gif",
      createdDate: "2024-03-30"
    }
  ];

  const [users, setUsers] = useState([]);

  // LocalStorage functions
  const saveUsersToLocalStorage = (usersData) => {
    try {
      localStorage.setItem('userManagement_users', JSON.stringify(usersData));
      console.log('✅ Đã lưu dữ liệu vào LocalStorage');
    } catch (error) {
      console.error('❌ Lỗi khi lưu vào LocalStorage:', error);
    }
  };

  const loadUsersFromLocalStorage = () => {
    try {
      const savedUsers = localStorage.getItem('userManagement_users');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        console.log('✅ Đã tải dữ liệu từ LocalStorage:', parsedUsers.length, 'users');
        return parsedUsers;
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải từ LocalStorage:', error);
    }
    return null;
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    const savedUsers = loadUsersFromLocalStorage();
    if (savedUsers && savedUsers.length > 0) {
      // Migrate old data - add missing fields if they don't exist
      const migratedUsers = savedUsers.map(user => ({
        ...user,
        email: user.email || `${user.name.toLowerCase()}@company.com`,
        address: user.address || "Chưa cập nhật địa chỉ",
        createdDate: user.createdDate || "2024-01-01"
      }));
      setUsers(migratedUsers);
      // Save migrated data back to localStorage
      if (JSON.stringify(migratedUsers) !== JSON.stringify(savedUsers)) {
        saveUsersToLocalStorage(migratedUsers);
      }
    } else {
      // Nếu chưa có dữ liệu trong LocalStorage, sử dụng dữ liệu mặc định và lưu vào LocalStorage
      setUsers(defaultUsers);
      saveUsersToLocalStorage(defaultUsers);
    }
  }, []);

  const handleActionClick = ({ action, user }) => {
    if (action === 'view') {
      setSelectedUser(user);
      setShowViewUserModal(true);
    } else if (action === 'update') {
      setSelectedUser(user);
      setUpdateUserData({
        name: user.name,
        position: user.position,
        status: user.status
      });
      setShowUpdateUserModal(true);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewUserModal(false);
    setSelectedUser(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateUserModal(false);
    setSelectedUser(null);
    setUpdateUserData({
      name: "",
      position: "",
      status: ""
    });
  };

  const handleUpdateStatusChange = (e) => {
    setUpdateUserData(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, status: updateUserData.status }
        : user
    );
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
    handleCloseUpdateModal();
    alert("✅ Đã cập nhật trạng thái thành công!");
  };

  const handleAddUser = () => {
    setShowAddUserPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddUserPopup(false);
    setNewUser({
      name: "",
      username: "",
      password: "",
      email: "",
      position: "",
      phone: "",
      address: "",
      status: "Đang làm việc",
      avatar: "",
      avatarFile: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setNewUser(prev => ({
        ...prev,
        avatarFile: file,
        avatar: file ? URL.createObjectURL(file) : ""
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (newUser.name && newUser.username && newUser.password && newUser.email && newUser.position && newUser.phone && newUser.address) {
      const userToAdd = {
        ...newUser,
        id: Date.now(), // Sử dụng timestamp để đảm bảo ID unique
        avatar: newUser.avatar || "https://i.pinimg.com/736x/65/d6/c4/65d6c4b0cc9e85a631cf2905a881b7f0.jpg",
        createdDate: new Date().toISOString().split('T')[0] // Thêm ngày tạo hiện tại
      };
      // Remove avatarFile from the user object since it's just for preview
      delete userToAdd.avatarFile;
      
      const updatedUsers = [...users, userToAdd];
      setUsers(updatedUsers);
      
      // Lưu vào LocalStorage
      saveUsersToLocalStorage(updatedUsers);
      
      handleClosePopup();
      
      // Thông báo thành công
      alert("✅ Đã thêm nhân viên thành công !");
    } else {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    }
  };

  

  // Clear LocalStorage function (for demo/testing)
  const clearLocalStorage = () => {
    if (window.confirm('🗑️ Bạn có chắc muốn xóa tất cả dữ liệu đã lưu và reset về dữ liệu mới?')) {
      try {
        localStorage.removeItem('userManagement_users');
        setUsers(defaultUsers);
        saveUsersToLocalStorage(defaultUsers);
        setCurrentPage(1); // Reset về trang 1
        alert('✅ Đã xóa dữ liệu LocalStorage và reset về dữ liệu mặc định (10 users)!');
      } catch (error) {
        console.error('❌ Lỗi khi xóa LocalStorage:', error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  // Tính toán pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Debug pagination
  console.log('=== PAGINATION DEBUG ===');
  console.log('Current page:', currentPage);
  console.log('Items per page:', itemsPerPage);
  console.log('Total users:', filteredUsers.length);
  console.log('Total pages:', totalPages);
  console.log('Start index:', startIndex);
  console.log('End index:', endIndex);
  console.log('Current users for this page:', currentUsers);
  console.log('========================');

  // Reset về trang 1 khi search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 32px", flex: "0 0 auto" }}>
        <div style={{ marginBottom: "16px" }}>
          <nav style={{ color: "#6b7280", fontSize: "14px" }}>
          <h1
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          Danh sách người dùng
        </h1>
            <span>Trang chủ</span>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Danh sách người dùng
            </span>
          </nav>
        </div>

        {/* Search and Add Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          {/* Search Box */}
          <div style={{ position: "relative",  flex: "1" }}>
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            >
              <HiOutlineSearch style={{ width: "20px", height: "20px" }} />
            </div>
            <input
              type="text"
              placeholder="Tìm người dùng"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "40%",
                padding: "12px 16px 12px 48px",
                border: "1px solid #d1d5db",
                borderRadius: "50px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", marginLeft: "24px" }}>
          

            {/* Add User Button */}
            <button
              onClick={handleAddUser}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#FF5B27",
                color: "white",
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#E04B1F")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF5B27")}
            >
              <HiOutlinePlus style={{ width: "16px", height: "16px" }} />
              Thêm người dùng
            </button>
          </div>
        </div>

        
      </div>

      {/* User Table Container */}
      <div style={{ flex: "1", overflow: "auto", minHeight: 0 }}>
        <UserTable users={currentUsers} onActionClick={handleActionClick} />
      </div>

      {/* Pagination */}
      <div style={{ flex: "0 0 auto", padding: "16px 32px" }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add User Popup */}
      {showAddUserPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleClosePopup}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Thêm nhân viên mới
              </h2>
              <button
                onClick={handleClosePopup}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  color: "#6b7280",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitUser}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Tài khoản *
                </label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Địa chỉ *
                </label>
                <textarea
                  name="address"
                  value={newUser.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    resize: "vertical",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Chức vụ *
                </label>
                <select
                  name="position"
                  value={newUser.position}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="">Chọn chức vụ</option>
                  <option value="Công nhân">Công nhân</option>
                  <option value="Giám sát viên">Giám sát viên</option>
                  <option value="Quản lý">Quản lý</option>
                </select>
              </div>

              {/* <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={newUser.status}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="Đang làm việc">Đang làm việc</option>
                  <option value="Nghỉ phép">Nghỉ phép</option>
                  <option value="Nghỉ việc">Nghỉ việc</option>
                </select>
              </div> */}

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Hình ảnh đại diện
                </label>
                <input
                  type="file"
                  name="avatar"
                  onChange={handleInputChange}
                  accept="image/*"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
                {newUser.avatar && (
                  <div style={{ marginTop: "12px", textAlign: "center" }}>
                    <img
                      src={newUser.avatar}
                      alt="Preview"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e5e7eb",
                      }}
                    />
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                      Xem trước hình ảnh
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={handleClosePopup}
                  style={{
                    padding: "12px 20px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "#FF5B27",
                    color: "white",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#E04B1F")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF5B27")}
                >
                  Thêm nhân viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewUserModal && selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseViewModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Chi tiết nhân viên
              </h2>
              <button
                onClick={handleCloseViewModal}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  color: "#6b7280",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* User Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Avatar */}
              <div style={{ textAlign: "center" }}>
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #e5e7eb",
                  }}
                />
              </div>

              {/* User Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Họ và Tên
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedUser.name}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Email
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedUser.email || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Chức vụ
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedUser.position}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Số điện thoại
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedUser.phone}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Ngày tạo
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                    {selectedUser.createdDate ? new Date(selectedUser.createdDate).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Trạng thái
                  </label>
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: "4px 0 0 0" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "9999px",
                        backgroundColor: 
                          selectedUser.status === "Đang làm việc" ? "#dcfce7" :
                          selectedUser.status === "Nghỉ phép" ? "#fef3c7" : "#fee2e2",
                        color: 
                          selectedUser.status === "Đang làm việc" ? "#15803d" :
                          selectedUser.status === "Nghỉ phép" ? "#d97706" : "#dc2626",
                      }}
                    >
                      {selectedUser.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Address - Full width */}
              <div>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                  Địa chỉ
                </label>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "4px 0 0 0" }}>
                  {selectedUser.address || "Chưa cập nhật địa chỉ"}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div style={{ textAlign: "right", marginTop: "24px" }}>
              <button
                onClick={handleCloseViewModal}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: "#6b7280",
                  color: "white",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#4b5563")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#6b7280")}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {showUpdateUserModal && selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseUpdateModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Cập nhật nhân viên
              </h2>
              <button
                onClick={handleCloseUpdateModal}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  color: "#6b7280",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                <HiX style={{ width: "24px", height: "24px" }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitUpdate}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Họ và Tên 
                </label>
                <input
                  type="text"
                  value={updateUserData.name}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f9fafb",
                    color: "#6b7280",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Chức vụ 
                </label>
                <input
                  type="text"
                  value={updateUserData.position}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f9fafb",
                    color: "#6b7280",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Trạng thái *
                </label>
                <select
                  value={updateUserData.status}
                  onChange={handleUpdateStatusChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="Đang làm việc">Đang làm việc</option>
                  <option value="Nghỉ phép">Nghỉ phép</option>
                  <option value="Nghỉ việc">Nghỉ việc</option>
                </select>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseUpdateModal}
                  style={{
                    padding: "12px 20px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "#FF5B27",
                    color: "white",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#E04B1F")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF5B27")}
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 
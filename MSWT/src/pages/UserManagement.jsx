import { useState, useEffect } from "react";
import { HiOutlineSearch, HiOutlinePlus, HiX } from "react-icons/hi";
import UserTable from "../components/UserTable";
import Pagination from "../components/Pagination";
import useUsers from "../hooks/useUsers";
import Notification from "../components/Notification";
import ApiTestDebug from "../components/ApiTestDebug";
import QuickApiTest from "../components/QuickApiTest";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); // "all", "worker", "supervisor", "manager"
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateUserData, setUpdateUserData] = useState({
    name: "",
    position: "",
    status: "",
    resignationReason: ""
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
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const itemsPerPage = 5; // Số user hiển thị mỗi trang

  // Use the custom hook for API calls
  const {
    users: apiUsers,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser: apiCreateUser,
    updateUser: apiUpdateUser,
    updateUserStatus: apiUpdateUserStatus,
    deleteUser: apiDeleteUser,
    searchUsers
  } = useUsers();

  // Use API users directly
  const [users, setUsers] = useState([]);

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    // Use API users directly
    if (apiUsers && apiUsers.length >= 0) {
      setUsers(apiUsers);
      console.log('✅ Đã tải dữ liệu từ API:', apiUsers.length, 'users');
    }
  }, [apiUsers]);

  const handleActionClick = ({ action, user }) => {
    if (action === 'view') {
      setSelectedUser(user);
      setShowViewUserModal(true);
    } else if (action === 'update') {
      setSelectedUser(user);
      setUpdateUserData({
        name: user.name,
        position: user.position,
        status: user.status,
        resignationReason: user.resignationReason || ""
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
      status: "",
      resignationReason: ""
    });
  };

  const handleUpdateStatusChange = (e) => {
    setUpdateUserData(prev => ({
      ...prev,
      status: e.target.value,
      resignationReason: e.target.value === "Nghỉ việc" ? prev.resignationReason : ""
    }));
  };

  const handleResignationReasonChange = (e) => {
    setUpdateUserData(prev => ({
      ...prev,
      resignationReason: e.target.value
    }));
  };

  const mapStatusToRole = (status) => {
    const statusToRoleMap = {
      'Đang làm việc': 'Nhân viên vệ sinh',
      'Nghỉ việc': 'Nghỉ việc', 
      'Tạm nghỉ': 'Tạm nghỉ'
    };
    return statusToRoleMap[status] || status;
  };

  const mapStatusToRoleId = (status) => {
    const statusToRoleIdMap = {
      'Đang làm việc': 'RL04', // Worker roleId
      'Nhân viên vệ sinh': 'RL04',
      'Giám sát viên vệ sinh': 'RL03', // Supervisor roleId  
      'Quản lý cấp cao': 'RL01', // Manager roleId
      'Quản trị hệ thống': 'RL02' // Admin roleId
    };
    return statusToRoleIdMap[status] || 'RL04'; // Default to worker
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      // Thử nhiều format khác nhau để tìm đúng API format
      const formats = [
        // Format 1: role string theo documentation  
        { role: mapStatusToRole(updateUserData.status) },
        // Format 2: roleId (có thể API cần roleId)
        { roleId: mapStatusToRoleId(updateUserData.status) },
        // Format 3: status field
        { status: updateUserData.status },
        // Format 4: role với roleId value
        { role: mapStatusToRoleId(updateUserData.status) }
      ];

      console.log('🔍 User ID:', selectedUser.id);
      console.log('🔍 Available formats to try:', formats);

      let success = false;
      let lastError = null;

      // Thử từng format cho đến khi thành công
      for (let i = 0; i < formats.length; i++) {
        try {
          console.log(`🔍 Trying format ${i + 1}:`, formats[i]);
          await apiUpdateUserStatus(selectedUser.id, formats[i]);
          console.log(`✅ Format ${i + 1} worked!`);
          success = true;
          break;
        } catch (error) {
          console.log(`❌ Format ${i + 1} failed:`, error.response?.data || error.message);
          lastError = error;
          continue;
        }
      }

      if (success) {
        showNotification("✅ Đã cập nhật trạng thái thành công!");
        handleCloseUpdateModal();
      } else {
        throw lastError;
      }
      
    } catch (error) {
      console.error('Error updating user status - all formats failed:', error);
      console.error('Error details:', error.response?.data);
      showNotification("❌ Có lỗi xảy ra khi cập nhật! Kiểm tra console để debug.", "error");
    }
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

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (newUser.name && newUser.username && newUser.password && newUser.email && newUser.position && newUser.phone && newUser.address) {
      try {
        const userToAdd = {
          ...newUser,
          avatar: newUser.avatar || "https://i.pinimg.com/736x/65/d6/c4/65d6c4b0cc9e85a631cf2905a881b7f0.jpg",
          createdDate: new Date().toISOString().split('T')[0]
        };
        // Remove avatarFile from the user object since it's just for preview
        delete userToAdd.avatarFile;
        
        // Create user via API
        const createdUser = await apiCreateUser(userToAdd);
        showNotification("✅ Đã thêm nhân viên thành công!");
        console.log('Created user via API:', createdUser);
        
        handleClosePopup();
      } catch (error) {
        console.error('Error creating user:', error);
        showNotification("❌ Có lỗi xảy ra khi thêm nhân viên!", "error");
      }
    } else {
      showNotification("❌ Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
    }
  };

  // Filter users based on active tab and search term
  const filteredUsers = (users || []).filter(user => {
    // Tab filtering
    let tabFilter;
    if (activeTab === "all") {
      tabFilter = true;
    } else if (activeTab === "worker") {
      tabFilter = user.position === "Nhân viên vệ sinh";
    } else if (activeTab === "supervisor") {
      tabFilter = user.position === "Giám sát viên vệ sinh";
    } else if (activeTab === "manager") {
      tabFilter = user.position === "Quản lý cấp cao  ";
    } else if (activeTab === "admin") {
      tabFilter = user.position === "Quản trị hệ thống";
    }
    
    if (!tabFilter) return false;
    
    // Search filtering
    if (!searchTerm) return true;
    
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    );
  });

  // Update users when apiUsers changes
  useEffect(() => {
    if (apiUsers) {
      setUsers(apiUsers);
      console.log('✅ Đã tải dữ liệu từ API:', apiUsers.length, 'users');
    }
  }, [apiUsers]);

  // Load initial data
  useEffect(() => {
    const loadUsers = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error('Failed to load users:', error);
        showNotification("❌ Có lỗi khi tải danh sách người dùng", "error");
      }
    };
    loadUsers();
  }, []);

  // Tính toán pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset về trang 1 khi search
  const handleSearchChange = async (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    setCurrentPage(1);

    // If search term is empty, fetch all users
    if (!searchValue.trim()) {
      try {
        await fetchUsers();
      } catch (error) {
        console.log('API search failed, using local filter');
      }
      return;
    }

    // Try API search first
    try {
      await searchUsers({ 
        search: searchValue,
        role: activeTab !== 'all' ? activeTab : undefined 
      });
    } catch (error) {
      console.log('API search failed, using local filter');
      // Fallback to local search - this will be handled by filteredUsers below
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: "", type: "" })}
        />
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #FF5B27",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto"
            }}></div>
            <p style={{ marginTop: "10px", textAlign: "center" }}>Đang tải...</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: "#fee2e2",
          border: "1px solid #fecaca",
          color: "#dc2626",
          padding: "12px",
          margin: "16px 32px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span>⚠️ {error}</span>
          <button 
            onClick={() => fetchUsers()}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Thử lại
          </button>
        </div>
      )}
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

        {/* Tabs */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
            <button
              onClick={async () => {
                setActiveTab("all");
                setCurrentPage(1);
                try {
                  await fetchUsers();
                } catch (error) {
                  console.log('Failed to fetch users for tab change');
                }
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "all" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "all" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "all") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "all") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Tất cả
            </button>
            <button
              onClick={async () => {
                setActiveTab("worker");
                setCurrentPage(1);
                try {
                  await searchUsers({ role: "worker" });
                } catch (error) {
                  console.log('Failed to filter workers');
                }
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "worker" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "worker" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "worker") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "worker") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Nhân viên vệ sinh
            </button>
            <button
              onClick={async () => {
                setActiveTab("supervisor");
                setCurrentPage(1);
                try {
                  await searchUsers({ role: "supervisor" });
                } catch (error) {
                  console.log('Failed to filter supervisors');
                }
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "supervisor" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "supervisor" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "supervisor") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "supervisor") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Giám sát viên vệ sinh
            </button>
            <button
              onClick={async () => {
                setActiveTab("manager");
                setCurrentPage(1);
                try {
                  await searchUsers({ role: "manager" });
                } catch (error) {
                  console.log('Failed to filter managers');
                }
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "manager" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "manager" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "manager") {
                  e.target.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "manager") {
                  e.target.style.color = "#6b7280";
                }
              }}
            >
              Quản lý cấp cao 
            </button>
            <button
              onClick={async () => {
                setActiveTab("admin");
                setCurrentPage(1);
                try {
                  await searchUsers({ role: "admin" });
                } catch (error) {
                  console.log('Failed to filter admins');
                }
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === "admin" ? "2px solid #FF5B27" : "2px solid transparent",
                color: activeTab === "admin" ? "#FF5B27" : "#6b7280",
                transition: "all 0.2s",
              }}
            >
              Quản trị hệ thống
            </button>
          </div>
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
                width: "32%",
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
      <div style={{ flex: "0 0 auto" }}>
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
                  <option value="Nhân viên vệ sinh">Nhân viên vệ sinh</option>
                  <option value="Giám sát viên vệ sinh">Giám sát viên vệ sinh</option>
                  <option value="Quản lý cấp cao">Quản lý cấp cao</option>
                  <option value="Quản trị hệ thống">Quản trị hệ thống</option>
                </select>
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
                  <option value="Đang kích hoạt">Đang kích hoạt</option>
                  <option value="Đang trống lịch">Đang trống lịch</option>
                  <option value="Nghỉ phép">Nghỉ phép</option>
                  <option value="Nghỉ việc">Nghỉ việc</option>
                </select>
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
                          selectedUser.status === "Đang kích hoạt" ? "#dbeafe" :
                          selectedUser.status === "Đang trống lịch" ? "#ede9fe" :
                          selectedUser.status === "Nghỉ phép" ? "#fef3c7" : "#fee2e2",
                        color: 
                          selectedUser.status === "Đang làm việc" ? "#15803d" :
                          selectedUser.status === "Đang kích hoạt" ? "#1d4ed8" :
                          selectedUser.status === "Đang trống lịch" ? "#7c3aed" :
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

              {/* Resignation Reason - Only show when status is "Nghỉ việc" */}
              {selectedUser.status === "Nghỉ việc" && selectedUser.resignationReason && (
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    Lý do nghỉ việc
                  </label>
                  <p style={{ 
                    fontSize: "16px", 
                    fontWeight: "600", 
                    color: "#111827", 
                    margin: "4px 0 0 0",
                    lineHeight: "1.5",
                    padding: "8px",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "6px"
                  }}>
                    {selectedUser.resignationReason}
                  </p>
                </div>
              )}
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

              <div style={{ marginBottom: updateUserData.status === "Nghỉ việc" ? "16px" : "24px" }}>
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
                  <option value="Đang kích hoạt">Đang kích hoạt</option>
                  <option value="Đang trống lịch">Đang trống lịch</option>
                  <option value="Nghỉ phép">Nghỉ phép</option>
                  <option value="Nghỉ việc">Nghỉ việc</option>
                </select>
              </div>

              {/* Resignation Reason Field - Only show when status is "Nghỉ việc" */}
              {updateUserData.status === "Nghỉ việc" && (
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
                    Lý do nghỉ việc *
                  </label>
                  <textarea
                    value={updateUserData.resignationReason}
                    onChange={handleResignationReasonChange}
                    required
                    rows="3"
                    placeholder="Nhập lý do nghỉ việc..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      backgroundColor: "white",
                      resize: "vertical",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>
              )}

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
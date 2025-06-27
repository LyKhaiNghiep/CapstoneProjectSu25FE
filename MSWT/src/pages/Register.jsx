import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    roleId: 'c2a66975-420d-4961-9edd-d5bdff89be58' // Default to Worker
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const roleOptions = [
    { value: 'c2a66975-420d-4961-9edd-d5bdff89be58', label: 'Nhân viên vệ sinh (Worker)' },
    { value: '7dcd71ae-17c3-4e84-bb9f-dd96fa401976', label: 'Giám sát viên và sinh (Supervisor)' },
    { value: '5b7a2bcd-9f5e-4f0e-8e47-2a15bcf85e37', label: 'Quản lý cấp cao (Manager)' },
    { value: '0ecdd2e4-d5dc-48b4-8006-03e6b4868e75', label: 'Quản trị hệ thống (Leader)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return false;
    }
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('📝 Attempting registration...', { ...formData, password: '***' });
      
      const result = await register(formData);
      
      if (result.success) {
        setSuccess('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...');
        console.log('✅ Registration successful');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError('Đã có lỗi xảy ra trong quá trình đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
      }}
    >
      {/* Registration Form Container */}
      <div 
        className="w-full max-w-md mx-auto"
        style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-xl font-medium"
            style={{ color: '#374151' }}
          >
            Đăng ký tài khoản MSWT
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>
            Tạo tài khoản để quản lý vệ sinh và bảo trì
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Tên đăng nhập *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nhập tên đăng nhập"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '12px',
                outline: 'none',
                color: '#374151',
                fontSize: '14px'
              }}
              required
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Họ và tên *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '12px',
                outline: 'none',
                color: '#374151',
                fontSize: '14px'
              }}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ email"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '12px',
                outline: 'none',
                color: '#374151',
                fontSize: '14px'
              }}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '12px',
                outline: 'none',
                color: '#374151',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '12px',
                outline: 'none',
                color: '#374151',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Chức vụ
            </label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '12px',
                outline: 'none',
                color: '#374151',
                fontSize: '14px'
              }}
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Mật khẩu *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '12px',
                outline: 'none',
                color: '#374151',
                fontSize: '14px'
              }}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Xác nhận mật khẩu *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Nhập lại mật khẩu"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '12px',
                outline: 'none',
                color: '#374151',
                fontSize: '14px'
              }}
              required
            />
          </div>

          {/* Success Message */}
          {success && (
            <div 
              className="text-center p-3"
              style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}
            >
              <p style={{ color: '#166534', fontSize: '14px' }}>{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div 
              className="text-center p-3"
              style={{
                backgroundColor: '#FEF2F2',
                borderRadius: '8px',
                border: '1px solid #FECACA'
              }}
            >
              <p style={{ color: '#DC2626', fontSize: '14px' }}>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: isLoading ? '#D1D5DB' : 'linear-gradient(to right, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              marginTop: '20px'
            }}
          >
            {isLoading ? '🔄 Đang đăng ký...' : '📝 Đăng ký'}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              style={{
                color: '#667eea',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {/* Backend Info */}
        <div 
          className="mt-6 pt-4 text-center"
          style={{
            borderTop: '1px solid #F3F4F6'
          }}
        >
          <p style={{ color: '#6B7280', fontSize: '12px' }}>
            🌐 Backend API: {import.meta.env.VITE_API_URL || 'Default'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

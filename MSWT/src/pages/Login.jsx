import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate login process
    setTimeout(() => {
      const result = login(formData.username, formData.password);
      
      if (result.success) {
        navigate('/user-management'); // Navigate to user management after login
      } else {
        setError(result.error);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 25%, #f8b500 50%, #f0932b 75%, #6c5ce7 100%)'
      }}
    >
      {/* White Popup Container */}
      <div 
        className="w-full max-w-sm mx-auto"
        style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '50px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop : '100px',
          marginLeft : '400px',
          marginRight : '400px',
          marginBottom : '100px',
        }}
      >
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-xl font-medium"
            style={{ color: '#374151' }}
          >
            Đăng nhập
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Field */}
          <div>
            <label 
              className="block text-sm mb-2"
              style={{ color: '#6B7280' }}
            >
              Tài khoản
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
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
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label 
              className="block text-sm mb-2"
              style={{ color: '#6B7280' }}
            >
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
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
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center">
              <p style={{ color: '#EF4444', fontSize: '14px' }}>{error}</p>
            </div>
          )}

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => alert('Chức năng quên mật khẩu sẽ được triển khai sau')}
              style={{
                color: '#F97316',
                fontSize: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              Quên mật khẩu
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: isLoading ? '#D1D5DB' : 'linear-gradient(to right, #FB923C, #F472B6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Demo Info */}
        <div 
          className="mt-6 pt-4 text-center"
          style={{
            borderTop: '1px solid #F3F4F6'
          }}
        >
          <p style={{ color: '#6B7280', fontSize: '12px' }}>
            Demo: 
            <span 
              style={{
                fontFamily: 'monospace',
                backgroundColor: '#F3F4F6',
                padding: '2px 6px',
                borderRadius: '4px',
                margin: '0 4px'
              }}
            >
              admin1
            </span> 
            / 
            <span 
              style={{
                fontFamily: 'monospace',
                backgroundColor: '#F3F4F6',
                padding: '2px 6px',
                borderRadius: '4px',
                margin: '0 4px'
              }}
            >
              1
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

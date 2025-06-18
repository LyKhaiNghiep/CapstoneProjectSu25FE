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
        navigate('/restrooms'); // Navigate to default page after login
      } else {
        setError(result.error);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
    }}>
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm mx-4" style={{
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Đăng nhập</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">
              Tài khoản
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all text-gray-800 placeholder-gray-400"
              placeholder=""
              required
              style={{
                fontSize: '16px',
                lineHeight: '1.5'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all text-gray-800 placeholder-gray-400"
              placeholder=""
              required
              style={{
                fontSize: '16px',
                lineHeight: '1.5'
              }}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm text-center">
              {error}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-700 transition-colors font-medium"
              onClick={() => alert('Chức năng quên mật khẩu sẽ được triển khai sau')}
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b9d 100%)',
              fontSize: '16px',
              marginTop: '32px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px rgba(255, 107, 157, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 157, 0.3)';
              }
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Đang đăng nhập...
              </div>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Tài khoản demo: <span className="font-semibold text-gray-700">admin1</span> / Mật khẩu: <span className="font-semibold text-gray-700">1</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

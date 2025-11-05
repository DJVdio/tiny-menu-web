import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import { UserRole } from '../types';
import './Login.css';

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!selectedRole) {
      alert('请选择身份');
      return;
    }

    const user = mockUsers.find((u) => u.role === selectedRole);
    if (user) {
      // 存储用户信息到 localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));

      // 根据角色跳转到对应页面
      if (selectedRole === 'customer') {
        navigate('/customer');
      } else {
        navigate('/chef');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🍳 小小菜单</h1>
        <p className="login-subtitle">欢迎回来</p>

        <div className="role-selection">
          <div
            className={`role-card ${selectedRole === 'customer' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('customer')}
          >
            <div className="role-icon">👩‍🦰</div>
            <div className="role-name">客户</div>
            <div className="role-desc">浏览和选择喜欢的菜品</div>
          </div>

          <div
            className={`role-card ${selectedRole === 'chef' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('chef')}
          >
            <div className="role-icon">👨‍🍳</div>
            <div className="role-name">厨师</div>
            <div className="role-desc">查看订单并确认菜品</div>
          </div>
        </div>

        <button className="login-button" onClick={handleLogin}>
          登录
        </button>
      </div>
    </div>
  );
};

export default Login;

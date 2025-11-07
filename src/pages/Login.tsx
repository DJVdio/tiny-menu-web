import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // 验证输入
    if (!username.trim()) {
      alert('请输入用户名');
      return;
    }
    if (!password) {
      alert('请输入密码');
      return;
    }

    // Mock用户: admin / 123456
    if (username === 'admin' && password === '123456') {
      const mockUser: User = {
        id: 'mock-admin',
        username: 'admin',
        password: '123456',
        boundCustomerIds: [],
      };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      // 跳转到角色选择页面
      navigate('/role-selection');
      return;
    }

    // 获取用户列表
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    // 查找用户
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
      alert('用户名或密码错误');
      return;
    }

    // 存储用户信息到 localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));

    // 跳转到角色选择页面
    navigate('/role-selection');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🍳 小小菜单</h1>
        <p className="login-subtitle">欢迎回来</p>

        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          登录
        </button>

        <div className="mock-account-hint">
          测试账号: admin / 123456
        </div>

        <div className="register-link">
          还没有账户? <a href="/register">立即注册</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

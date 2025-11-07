import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import './Register.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    // 验证输入
    if (!username.trim()) {
      alert('请输入用户名');
      return;
    }
    if (!password) {
      alert('请输入密码');
      return;
    }
    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    // 获取现有用户列表
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    // 检查用户名是否已存在
    if (users.some((u) => u.username === username)) {
      alert('该用户名已存在');
      return;
    }

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      boundCustomerIds: [],
    };

    // 保存用户
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // 提示注册成功
    alert('注册完成！请登录');

    // 跳转到登录页面
    navigate('/');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">🍳 小小菜单</h1>
        <p className="register-subtitle">创建账户</p>

        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入密码"
          />
        </div>

        <button className="register-button" onClick={handleRegister}>
          注册
        </button>

        <div className="login-link">
          已有账户? <a href="/">立即登录</a>
        </div>
      </div>
    </div>
  );
};

export default Register;

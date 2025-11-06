import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole, User } from '../types';
import './RoleSelection.css';

const RoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 从路由状态获取用户信息
    const stateUser = location.state?.user;
    if (!stateUser) {
      navigate('/');
      return;
    }
    setUser(stateUser);
  }, [location, navigate]);

  const handleConfirm = () => {
    if (!selectedRole) {
      alert('请选择身份');
      return;
    }

    if (!user) {
      return;
    }

    // 更新用户角色
    const updatedUser = { ...user, role: selectedRole };

    // 更新localStorage中的用户列表
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }

    // 设置当前登录用户
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // 根据角色跳转到对应页面
    if (selectedRole === 'customer') {
      navigate('/customer');
    } else {
      navigate('/chef');
    }
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h1 className="role-selection-title">选择你的身份</h1>
        <p className="role-selection-subtitle">你是厨师还是顾客?</p>

        <div className="role-options">
          <div
            className={`role-option ${selectedRole === 'customer' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('customer')}
          >
            <div className="role-icon">👩‍🦰</div>
            <div className="role-name">顾客</div>
            <div className="role-desc">浏览和选择喜欢的菜品</div>
          </div>

          <div
            className={`role-option ${selectedRole === 'chef' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('chef')}
          >
            <div className="role-icon">👨‍🍳</div>
            <div className="role-name">厨师</div>
            <div className="role-desc">查看订单并确认菜品</div>
          </div>
        </div>

        <button className="confirm-button" onClick={handleConfirm}>
          确认
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;

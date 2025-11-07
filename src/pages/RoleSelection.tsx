import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'customer' | 'chef') => {
    if (role === 'customer') {
      navigate('/customer');
    } else {
      navigate('/chef');
    }
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h1 className="role-selection-title">🍳 小小菜单</h1>
        <p className="role-selection-subtitle">选择您的身份</p>

        <div className="role-options">
          <div
            className="role-option customer-option"
            onClick={() => handleRoleSelect('customer')}
          >
            <div className="role-icon">🍽️</div>
            <h2 className="role-name">顾客</h2>
            <p className="role-description">浏览今日推荐，选择喜欢的菜品</p>
          </div>

          <div
            className="role-option chef-option"
            onClick={() => handleRoleSelect('chef')}
          >
            <div className="role-icon">👨‍🍳</div>
            <h2 className="role-name">厨师</h2>
            <p className="role-description">查看顾客点单，选择制作菜品</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

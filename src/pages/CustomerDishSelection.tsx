import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDishes, todayRecommendations } from '../data/mockData';
import { Dish, CustomerSelection, User, BindingRequest } from '../types';
import './CustomerDishSelection.css';

const CustomerDishSelection: React.FC = () => {
  const navigate = useNavigate();
  const [recommendedDishes, setRecommendedDishes] = useState<Dish[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showBindingModal, setShowBindingModal] = useState(false);
  const [chefList, setChefList] = useState<User[]>([]);
  const [selectedChefId, setSelectedChefId] = useState('');
  const [boundChef, setBoundChef] = useState<User | null>(null);

  useEffect(() => {
    // 检查登录状态
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      navigate('/');
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    // 加载已绑定的厨师
    if (user.boundChefId) {
      const usersStr = localStorage.getItem('users');
      const users: User[] = usersStr ? JSON.parse(usersStr) : [];
      const chef = users.find((u) => u.id === user.boundChefId);
      if (chef) {
        setBoundChef(chef);
      }
    }

    // 加载今日推荐菜品
    const recommended = mockDishes.filter((dish) =>
      todayRecommendations.includes(dish.id)
    );
    setRecommendedDishes(recommended);

    // 加载已选择的菜品
    const savedSelections = localStorage.getItem('customerSelections');
    if (savedSelections) {
      const selections: CustomerSelection[] = JSON.parse(savedSelections);
      const userSelections = selections.filter((s) => s.customerId === user.id);
      setSelectedDishes(userSelections.map((s) => s.dishId));
    }
  }, [navigate]);

  const toggleDishSelection = (dishId: string) => {
    if (!currentUser) return;

    let newSelections: string[];
    if (selectedDishes.includes(dishId)) {
      newSelections = selectedDishes.filter((id) => id !== dishId);
    } else {
      newSelections = [...selectedDishes, dishId];
    }
    setSelectedDishes(newSelections);

    // 保存到 localStorage
    const savedSelections = localStorage.getItem('customerSelections');
    let allSelections: CustomerSelection[] = savedSelections
      ? JSON.parse(savedSelections)
      : [];

    // 移除当前用户的旧选择
    allSelections = allSelections.filter((s) => s.customerId !== currentUser.id);

    // 添加当前用户的新选择
    const userSelections: CustomerSelection[] = newSelections.map((id) => ({
      customerId: currentUser.id,
      dishId: id,
      selectedAt: new Date().toISOString(),
    }));

    allSelections = [...allSelections, ...userSelections];
    localStorage.setItem('customerSelections', JSON.stringify(allSelections));
  };

  const openBindingModal = () => {
    // 加载所有用户作为可绑定的厨师列表（除了自己）
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const chefs = users.filter((u) => u.id !== currentUser?.id);
    setChefList(chefs);
    setShowBindingModal(true);
  };

  const sendBindingRequest = () => {
    if (!selectedChefId || !currentUser) {
      alert('请选择一位厨师');
      return;
    }

    const chef = chefList.find((c) => c.id === selectedChefId);
    if (!chef) return;

    // 创建绑定申请
    const requestsStr = localStorage.getItem('bindingRequests');
    const requests: BindingRequest[] = requestsStr ? JSON.parse(requestsStr) : [];

    // 检查是否已经有待处理的申请
    const existingRequest = requests.find(
      (r) => r.customerId === currentUser.id && r.chefId === selectedChefId && r.status === 'pending'
    );

    if (existingRequest) {
      alert('已经向该厨师发送过绑定申请,请等待厨师处理');
      return;
    }

    const newRequest: BindingRequest = {
      id: Date.now().toString(),
      customerId: currentUser.id,
      customerName: currentUser.name,
      chefId: selectedChefId,
      chefName: chef.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    requests.push(newRequest);
    localStorage.setItem('bindingRequests', JSON.stringify(requests));

    alert('绑定申请已发送!');
    setShowBindingModal(false);
    setSelectedChefId('');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: '简单',
      medium: '中等',
      hard: '困难',
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#52c41a',
      medium: '#faad14',
      hard: '#f5222d',
    };
    return colors[difficulty as keyof typeof colors] || '#666';
  };

  return (
    <div className="customer-container">
      <header className="customer-header">
        <div className="header-content">
          <h1>🍳 今日推荐菜品</h1>
          <div className="user-info">
            <span className="user-name">{currentUser?.name} (顾客视图)</span>
            <button className="switch-role-btn" onClick={() => navigate('/chef')}>
              切换到厨师视图
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="customer-content">
        <div className="binding-section">
          {boundChef ? (
            <div className="bound-chef-info">
              <span>已绑定厨师: {boundChef.name}</span>
            </div>
          ) : (
            <button className="bind-chef-btn" onClick={openBindingModal}>
              绑定厨师
            </button>
          )}
        </div>

        <div className="selection-info">
          <p>已选择 {selectedDishes.length} 道菜</p>
          <p className="info-hint">点击菜品卡片进行选择或取消</p>
        </div>

        <div className="dishes-grid">
          {recommendedDishes.map((dish) => {
            const isSelected = selectedDishes.includes(dish.id);
            return (
              <div
                key={dish.id}
                className={`dish-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleDishSelection(dish.id)}
              >
                {isSelected && (
                  <div className="selected-badge">
                    <span>✓</span>
                  </div>
                )}
                <div className="dish-image-container">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="dish-image"
                  />
                </div>
                <div className="dish-info">
                  <h3 className="dish-name">{dish.name}</h3>
                  <p className="dish-description">{dish.description}</p>
                  <div className="dish-meta">
                    <span
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(dish.difficulty) }}
                    >
                      {getDifficultyLabel(dish.difficulty)}
                    </span>
                    <span className="cooking-time">⏱️ {dish.cookingTime}分钟</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 绑定厨师弹窗 */}
      {showBindingModal && (
        <div className="modal-overlay" onClick={() => setShowBindingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>选择厨师</h2>
            <button className="close-btn" onClick={() => setShowBindingModal(false)}>
              ✕
            </button>
            <div className="chef-list">
              {chefList.length === 0 ? (
                <p className="empty-message">暂无可绑定的厨师</p>
              ) : (
                chefList.map((chef) => (
                  <div
                    key={chef.id}
                    className={`chef-item ${selectedChefId === chef.id ? 'selected' : ''}`}
                    onClick={() => setSelectedChefId(chef.id)}
                  >
                    <span className="chef-icon">👨‍🍳</span>
                    <span className="chef-name">{chef.name}</span>
                  </div>
                ))
              )}
            </div>
            <button
              className="confirm-binding-btn"
              onClick={sendBindingRequest}
              disabled={!selectedChefId}
            >
              发送绑定申请
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDishSelection;

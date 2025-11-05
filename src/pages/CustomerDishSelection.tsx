import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDishes, todayRecommendations } from '../data/mockData';
import { Dish, CustomerSelection } from '../types';
import './CustomerDishSelection.css';

const CustomerDishSelection: React.FC = () => {
  const navigate = useNavigate();
  const [recommendedDishes, setRecommendedDishes] = useState<Dish[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // 检查登录状态
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      navigate('/');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'customer') {
      navigate('/');
      return;
    }
    setCurrentUser(user);

    // 加载今日推荐菜品
    const recommended = mockDishes.filter((dish) =>
      todayRecommendations.includes(dish.id)
    );
    setRecommendedDishes(recommended);

    // 加载已选择的菜品
    const savedSelections = localStorage.getItem('customerSelections');
    if (savedSelections) {
      const selections: CustomerSelection[] = JSON.parse(savedSelections);
      setSelectedDishes(selections.map((s) => s.dishId));
    }
  }, [navigate]);

  const toggleDishSelection = (dishId: string) => {
    let newSelections: string[];
    if (selectedDishes.includes(dishId)) {
      newSelections = selectedDishes.filter((id) => id !== dishId);
    } else {
      newSelections = [...selectedDishes, dishId];
    }
    setSelectedDishes(newSelections);

    // 保存到 localStorage
    const selections: CustomerSelection[] = newSelections.map((id) => ({
      dishId: id,
      selectedAt: new Date().toISOString(),
    }));
    localStorage.setItem('customerSelections', JSON.stringify(selections));
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
            <button className="logout-btn" onClick={handleLogout}>
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="customer-content">
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
    </div>
  );
};

export default CustomerDishSelection;

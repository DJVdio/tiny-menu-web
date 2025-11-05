import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDishes } from '../data/mockData';
import { Dish, CustomerSelection, ChefConfirmation } from '../types';
import './ChefDishSelection.css';

const ChefDishSelection: React.FC = () => {
  const navigate = useNavigate();
  const [customerSelectedDishes, setCustomerSelectedDishes] = useState<Dish[]>([]);
  const [chefConfirmedDishes, setChefConfirmedDishes] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedDishForRecipe, setSelectedDishForRecipe] = useState<Dish | null>(null);

  useEffect(() => {
    // 检查登录状态
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      navigate('/');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'chef') {
      navigate('/');
      return;
    }
    setCurrentUser(user);

    // 加载客户选择的菜品
    const customerSelectionsStr = localStorage.getItem('customerSelections');
    if (customerSelectionsStr) {
      const selections: CustomerSelection[] = JSON.parse(customerSelectionsStr);
      const dishes = mockDishes.filter((dish) =>
        selections.some((s) => s.dishId === dish.id)
      );
      setCustomerSelectedDishes(dishes);
    }

    // 加载厨师确认的菜品
    const chefConfirmationsStr = localStorage.getItem('chefConfirmations');
    if (chefConfirmationsStr) {
      const confirmations: ChefConfirmation[] = JSON.parse(chefConfirmationsStr);
      setChefConfirmedDishes(confirmations.map((c) => c.dishId));
    }
  }, [navigate]);

  const toggleChefConfirmation = (dishId: string) => {
    let newConfirmations: string[];
    if (chefConfirmedDishes.includes(dishId)) {
      newConfirmations = chefConfirmedDishes.filter((id) => id !== dishId);
    } else {
      newConfirmations = [...chefConfirmedDishes, dishId];
    }
    setChefConfirmedDishes(newConfirmations);

    // 保存到 localStorage
    const confirmations: ChefConfirmation[] = newConfirmations.map((id) => ({
      dishId: id,
      confirmedAt: new Date().toISOString(),
    }));
    localStorage.setItem('chefConfirmations', JSON.stringify(confirmations));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const showRecipe = (dish: Dish) => {
    setSelectedDishForRecipe(dish);
  };

  const closeRecipe = () => {
    setSelectedDishForRecipe(null);
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
    <div className="chef-container">
      <header className="chef-header">
        <div className="header-content">
          <h1>👨‍🍳 客户点单</h1>
          <div className="user-info">
            <span className="user-name">{currentUser?.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="chef-content">
        <div className="selection-info">
          <p>
            客户选择了 {customerSelectedDishes.length} 道菜，你已确认{' '}
            {chefConfirmedDishes.length} 道
          </p>
          <p className="info-hint">点击菜品卡片确认或取消，点击"查看菜谱"查看详细做法</p>
        </div>

        {customerSelectedDishes.length === 0 ? (
          <div className="empty-state">
            <p>😊 客户还没有选择任何菜品</p>
          </div>
        ) : (
          <div className="dishes-grid">
            {customerSelectedDishes.map((dish) => {
              const isConfirmed = chefConfirmedDishes.includes(dish.id);
              return (
                <div
                  key={dish.id}
                  className={`dish-card ${isConfirmed ? 'confirmed' : ''}`}
                >
                  {isConfirmed && (
                    <div className="confirmed-badge">
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
                    <div className="dish-actions">
                      <button
                        className="recipe-btn"
                        onClick={() => showRecipe(dish)}
                      >
                        查看菜谱
                      </button>
                      <button
                        className={`confirm-btn ${isConfirmed ? 'confirmed' : ''}`}
                        onClick={() => toggleChefConfirmation(dish.id)}
                      >
                        {isConfirmed ? '已确认' : '确认制作'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 菜谱弹窗 */}
      {selectedDishForRecipe && (
        <div className="recipe-modal" onClick={closeRecipe}>
          <div className="recipe-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeRecipe}>
              ✕
            </button>
            <h2>{selectedDishForRecipe.name}</h2>
            <div className="recipe-image-container">
              <img
                src={selectedDishForRecipe.imageUrl}
                alt={selectedDishForRecipe.name}
              />
            </div>
            <div className="recipe-details">
              <div className="recipe-section">
                <h3>📝 食材清单</h3>
                <ul className="ingredients-list">
                  {selectedDishForRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="recipe-section">
                <h3>👨‍🍳 制作步骤</h3>
                <ol className="steps-list">
                  {selectedDishForRecipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="recipe-meta">
                <span
                  className="difficulty-badge"
                  style={{
                    backgroundColor: getDifficultyColor(
                      selectedDishForRecipe.difficulty
                    ),
                  }}
                >
                  难度: {getDifficultyLabel(selectedDishForRecipe.difficulty)}
                </span>
                <span className="cooking-time">
                  ⏱️ 烹饪时间: {selectedDishForRecipe.cookingTime}分钟
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefDishSelection;

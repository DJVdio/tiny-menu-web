import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDishes } from '../data/mockData';
import { Dish, CustomerSelection, ChefConfirmation, User, BindingRequest } from '../types';
import './ChefDishSelection.css';

const ChefDishSelection: React.FC = () => {
  const navigate = useNavigate();
  const [customerSelectedDishes, setCustomerSelectedDishes] = useState<Dish[]>([]);
  const [chefConfirmedDishes, setChefConfirmedDishes] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDishForRecipe, setSelectedDishForRecipe] = useState<Dish | null>(null);
  const [bindingRequests, setBindingRequests] = useState<BindingRequest[]>([]);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const loadData = () => {
    // 检查登录状态
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      navigate('/');
      return;
    }
    const user: User = JSON.parse(userStr);
    if (user.role !== 'chef') {
      navigate('/');
      return;
    }
    setCurrentUser(user);

    // 加载绑定申请
    const requestsStr = localStorage.getItem('bindingRequests');
    if (requestsStr) {
      const allRequests: BindingRequest[] = JSON.parse(requestsStr);
      const myRequests = allRequests.filter((r) => r.chefId === user.id && r.status === 'pending');
      setBindingRequests(myRequests);
    }

    // 加载已绑定顾客的选择菜品
    const customerSelectionsStr = localStorage.getItem('customerSelections');
    if (customerSelectionsStr) {
      const selections: CustomerSelection[] = JSON.parse(customerSelectionsStr);
      // 只显示已绑定顾客的选择
      const boundCustomerIds = user.boundCustomerIds || [];
      const boundCustomerSelections = selections.filter((s) =>
        boundCustomerIds.includes(s.customerId)
      );
      const dishes = mockDishes.filter((dish) =>
        boundCustomerSelections.some((s) => s.dishId === dish.id)
      );
      setCustomerSelectedDishes(dishes);
    }

    // 加载厨师确认的菜品
    const chefConfirmationsStr = localStorage.getItem('chefConfirmations');
    if (chefConfirmationsStr) {
      const confirmations: ChefConfirmation[] = JSON.parse(chefConfirmationsStr);
      const myConfirmations = confirmations.filter((c) => c.chefId === user.id);
      setChefConfirmedDishes(myConfirmations.map((c) => c.dishId));
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const toggleChefConfirmation = (dishId: string) => {
    if (!currentUser) return;

    let newConfirmations: string[];
    if (chefConfirmedDishes.includes(dishId)) {
      newConfirmations = chefConfirmedDishes.filter((id) => id !== dishId);
    } else {
      newConfirmations = [...chefConfirmedDishes, dishId];
    }
    setChefConfirmedDishes(newConfirmations);

    // 保存到 localStorage
    const chefConfirmationsStr = localStorage.getItem('chefConfirmations');
    let allConfirmations: ChefConfirmation[] = chefConfirmationsStr
      ? JSON.parse(chefConfirmationsStr)
      : [];

    // 移除当前厨师的旧确认
    allConfirmations = allConfirmations.filter((c) => c.chefId !== currentUser.id);

    // 添加当前厨师的新确认
    const myConfirmations: ChefConfirmation[] = newConfirmations.map((id) => ({
      chefId: currentUser.id,
      customerId: currentUser.boundCustomerIds?.[0] || '',
      dishId: id,
      confirmedAt: new Date().toISOString(),
    }));

    allConfirmations = [...allConfirmations, ...myConfirmations];
    localStorage.setItem('chefConfirmations', JSON.stringify(allConfirmations));
  };

  const handleBindingRequest = (requestId: string, accept: boolean) => {
    if (!currentUser) return;

    // 更新绑定申请状态
    const requestsStr = localStorage.getItem('bindingRequests');
    if (!requestsStr) return;

    const requests: BindingRequest[] = JSON.parse(requestsStr);
    const requestIndex = requests.findIndex((r) => r.id === requestId);
    if (requestIndex === -1) return;

    const request = requests[requestIndex];
    request.status = accept ? 'accepted' : 'rejected';
    request.updatedAt = new Date().toISOString();
    requests[requestIndex] = request;
    localStorage.setItem('bindingRequests', JSON.stringify(requests));

    if (accept) {
      // 更新用户绑定关系
      const usersStr = localStorage.getItem('users');
      if (!usersStr) return;

      const users: User[] = JSON.parse(usersStr);

      // 更新厨师的绑定顾客列表
      const chefIndex = users.findIndex((u) => u.id === currentUser.id);
      if (chefIndex !== -1) {
        const boundCustomerIds = users[chefIndex].boundCustomerIds || [];
        if (!boundCustomerIds.includes(request.customerId)) {
          users[chefIndex].boundCustomerIds = [...boundCustomerIds, request.customerId];
        }
      }

      // 更新顾客的绑定厨师
      const customerIndex = users.findIndex((u) => u.id === request.customerId);
      if (customerIndex !== -1) {
        users[customerIndex].boundChefId = currentUser.id;
      }

      localStorage.setItem('users', JSON.stringify(users));

      // 更新当前用户信息
      const updatedUser = users[chefIndex];
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      alert('已接受绑定申请!');
    } else {
      alert('已拒绝绑定申请');
    }

    // 重新加载数据
    loadData();
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
            {bindingRequests.length > 0 && (
              <button
                className="requests-btn"
                onClick={() => setShowRequestsModal(true)}
              >
                绑定申请 ({bindingRequests.length})
              </button>
            )}
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

      {/* 绑定申请弹窗 */}
      {showRequestsModal && (
        <div className="modal-overlay" onClick={() => setShowRequestsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>绑定申请</h2>
            <button className="close-btn" onClick={() => setShowRequestsModal(false)}>
              ✕
            </button>
            <div className="requests-list">
              {bindingRequests.map((request) => (
                <div key={request.id} className="request-item">
                  <div className="request-info">
                    <span className="customer-icon">👩‍🦰</span>
                    <div className="request-details">
                      <p className="customer-name">{request.customerName}</p>
                      <p className="request-time">
                        {new Date(request.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button
                      className="accept-btn"
                      onClick={() => handleBindingRequest(request.id, true)}
                    >
                      接受
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleBindingRequest(request.id, false)}
                    >
                      拒绝
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefDishSelection;

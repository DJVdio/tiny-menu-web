// API 配置
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://tiny-menu-bcakend.zeabur.app';

export const API_ENDPOINTS = {
  // 认证相关
  login: '/api/auth/login',

  // 菜品相关
  dishes: '/api/dishes',
  todayRecommendations: '/api/dishes/today-recommendations',

  // 客户选择相关
  customerSelections: '/api/customer-selections',
  submitSelection: '/api/customer-selections/submit',

  // 厨师相关
  chefConfirmations: '/api/chef-confirmations',
  confirmDish: '/api/chef-confirmations/confirm',
};

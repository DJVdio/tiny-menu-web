// API 配置
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://tiny-menu-bcakend.zeabur.app';

/**
 * API 端点配置
 * 与后端 tiny-menu-api 的路由对应
 */
export const API_ENDPOINTS = {
  // ==================== 认证模块 ====================
  // POST /api/auth/register - 用户注册
  register: '/api/auth/register',
  // POST /api/auth/login - 用户登录
  login: '/api/auth/login',

  // ==================== 绑定关系管理 ====================
  // POST /api/bindings/request - 申请绑定厨师
  bindingRequest: '/api/bindings/request',
  // GET /api/bindings/pending - 查看待处理的绑定请求（厨师）
  pendingBindings: '/api/bindings/pending',
  // PUT /api/bindings/{id} - 同意或拒绝绑定请求（厨师）
  updateBinding: (id: number) => `/api/bindings/${id}`,
  // GET /api/bindings/my-bindings?as_chef=true/false - 查看我的绑定关系
  myBindings: '/api/bindings/my-bindings',
  // DELETE /api/bindings/{id} - 删除绑定关系
  deleteBinding: (id: number) => `/api/bindings/${id}`,

  // ==================== 菜品管理 ====================
  // GET /api/dishes - 获取所有菜品
  dishes: '/api/dishes',
  // GET /api/dishes/{id} - 获取菜品详情（含菜谱）
  dishDetail: (id: number) => `/api/dishes/${id}`,
  // POST /api/dishes - 创建菜品（仅厨师）
  createDish: '/api/dishes',
  // GET /api/dishes/recommendations/today - 获取今日推荐
  todayRecommendations: '/api/dishes/recommendations/today',
  // POST /api/dishes/recommendations/generate - 生成推荐（仅厨师）
  generateRecommendations: '/api/dishes/recommendations/generate',

  // ==================== 客户选菜 ====================
  // POST /api/customer-selections - 选择菜品
  createCustomerSelection: '/api/customer-selections',
  // GET /api/customer-selections/my-selections - 我的选择
  myCustomerSelections: '/api/customer-selections/my-selections',
  // GET /api/customer-selections/all - 所有客户选择（仅厨师）
  allCustomerSelections: '/api/customer-selections/all',
  // DELETE /api/customer-selections/{id} - 取消选择
  deleteCustomerSelection: (id: number) => `/api/customer-selections/${id}`,

  // ==================== 厨师选菜 ====================
  // POST /api/chef-selections - 选择制作菜品
  createChefSelection: '/api/chef-selections',
  // GET /api/chef-selections/my-selections - 我的选择
  myChefSelections: '/api/chef-selections/my-selections',
  // DELETE /api/chef-selections/{id} - 取消选择
  deleteChefSelection: (id: number) => `/api/chef-selections/${id}`,
};

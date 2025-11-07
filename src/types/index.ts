// 用户类型
// 注意：每个用户同时拥有厨师和顾客两个身份
export interface User {
  id: string;
  username: string;
  password: string;
  boundChefId?: string; // 作为顾客时绑定的厨师ID
  boundCustomerIds?: string[]; // 作为厨师时绑定的顾客ID列表
}

// 绑定申请状态
export type BindingRequestStatus = 'pending' | 'accepted' | 'rejected';

// 绑定申请
export interface BindingRequest {
  id: string;
  customerId: string;
  customerUsername: string;
  chefId: string;
  chefUsername: string;
  status: BindingRequestStatus;
  createdAt: string;
  updatedAt: string;
}

// 菜品类型
export interface Dish {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number; // 分钟
  difficulty: 'easy' | 'medium' | 'hard';
}

// 客户选择的菜品
export interface CustomerSelection {
  customerId: string;
  dishId: string;
  selectedAt: string;
}

// 厨师确认的菜品
export interface ChefConfirmation {
  chefId: string;
  customerId: string;
  dishId: string;
  confirmedAt: string;
}

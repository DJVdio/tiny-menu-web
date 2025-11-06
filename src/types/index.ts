// 用户角色类型
export type UserRole = 'chef' | 'customer';

// 用户类型
export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role?: UserRole; // 注册时可能还没有选择角色
  boundChefId?: string; // 顾客绑定的厨师ID
  boundCustomerIds?: string[]; // 厨师绑定的顾客ID列表
}

// 绑定申请状态
export type BindingRequestStatus = 'pending' | 'accepted' | 'rejected';

// 绑定申请
export interface BindingRequest {
  id: string;
  customerId: string;
  customerName: string;
  chefId: string;
  chefName: string;
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

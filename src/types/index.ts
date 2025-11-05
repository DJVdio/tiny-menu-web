// 用户角色类型
export type UserRole = 'chef' | 'customer';

// 用户类型
export interface User {
  id: string;
  name: string;
  role: UserRole;
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
  dishId: string;
  selectedAt: string;
}

// 厨师确认的菜品
export interface ChefConfirmation {
  dishId: string;
  confirmedAt: string;
}

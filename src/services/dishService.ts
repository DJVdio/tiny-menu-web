import { get } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Dish } from '../types';

// 获取所有菜品
export async function getAllDishes(): Promise<Dish[]> {
  return get<Dish[]>(API_ENDPOINTS.dishes);
}

// 获取今日推荐菜品
export async function getTodayRecommendations(): Promise<Dish[]> {
  return get<Dish[]>(API_ENDPOINTS.todayRecommendations);
}

import { get, post } from './api';
import { API_ENDPOINTS } from '../config/api';
import { ChefConfirmation } from '../types';

// 获取厨师确认记录
export async function getChefConfirmations(chefId: string): Promise<ChefConfirmation[]> {
  return get<ChefConfirmation[]>(`${API_ENDPOINTS.chefConfirmations}?chefId=${chefId}`);
}

// 确认菜品
export async function confirmDish(
  chefId: string,
  dishId: string
): Promise<{ success: boolean; message: string }> {
  return post(API_ENDPOINTS.confirmDish, {
    chefId,
    dishId,
  });
}

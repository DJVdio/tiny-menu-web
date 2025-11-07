import { get, post, del } from './api';
import { API_ENDPOINTS } from '../config/api';
import { ChefConfirmation } from '../types';

// 获取厨师的选菜记录
export async function getChefSelections(): Promise<ChefConfirmation[]> {
  return get<ChefConfirmation[]>(API_ENDPOINTS.myChefSelections);
}

// 获取所有客户的选择（厨师查看已绑定客户的选择）
export async function getAllCustomerSelections(): Promise<any[]> {
  return get<any[]>(API_ENDPOINTS.allCustomerSelections);
}

// 厨师选择制作菜品
export async function createChefSelection(
  customerSelectionId: number
): Promise<{ success: boolean; message: string }> {
  return post(API_ENDPOINTS.createChefSelection, {
    customer_selection_id: customerSelectionId,
  });
}

// 取消厨师选择
export async function deleteChefSelection(id: number): Promise<void> {
  return del(API_ENDPOINTS.deleteChefSelection(id));
}

import { get, post, del } from './api';
import { API_ENDPOINTS } from '../config/api';
import { CustomerSelection } from '../types';

// 获取我的选择记录
export async function getMyCustomerSelections(): Promise<CustomerSelection[]> {
  return get<CustomerSelection[]>(API_ENDPOINTS.myCustomerSelections);
}

// 提交客户选择（选择菜品）
export async function createCustomerSelection(
  dishId: number
): Promise<{ success: boolean; message: string }> {
  return post(API_ENDPOINTS.createCustomerSelection, {
    dish_id: dishId,
  });
}

// 取消客户选择
export async function deleteCustomerSelection(id: number): Promise<void> {
  return del(API_ENDPOINTS.deleteCustomerSelection(id));
}

import { get, post } from './api';
import { API_ENDPOINTS } from '../config/api';
import { CustomerSelection } from '../types';

// 获取客户选择记录
export async function getCustomerSelections(customerId: string): Promise<CustomerSelection[]> {
  return get<CustomerSelection[]>(`${API_ENDPOINTS.customerSelections}?customerId=${customerId}`);
}

// 提交客户选择
export async function submitCustomerSelection(
  customerId: string,
  dishIds: string[]
): Promise<{ success: boolean; message: string }> {
  return post(API_ENDPOINTS.submitSelection, {
    customerId,
    dishIds,
  });
}

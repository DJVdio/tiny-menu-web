import React from 'react';
import { RouteObject } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CustomerDishSelection from '../pages/CustomerDishSelection';
import ChefDishSelection from '../pages/ChefDishSelection';
import EnvTest from '../pages/EnvTest';

/**
 * 前端路由配置
 *
 * 路由结构：
 * - / - 登录页面
 * - /register - 注册页面
 * - /customer - 客户选菜页面
 * - /chef - 厨师选菜页面
 * - /env-test - 环境测试页面（开发用）
 */

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/customer',
    element: <CustomerDishSelection />,
  },
  {
    path: '/chef',
    element: <ChefDishSelection />,
  },
  {
    path: '/env-test',
    element: <EnvTest />,
  },
];

/**
 * 路由路径常量
 * 便于在代码中引用，避免硬编码路径
 */
export const ROUTES = {
  LOGIN: '/',
  REGISTER: '/register',
  CUSTOMER: '/customer',
  CHEF: '/chef',
  ENV_TEST: '/env-test',
} as const;

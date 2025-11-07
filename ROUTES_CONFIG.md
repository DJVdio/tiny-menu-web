# 路由配置文档

## 后端 API 配置

### Zeabur 部署信息

- **内网地址**: `tiny-menu-api.zeabur.internal:8080`
- **公网地址**: `https://tiny-menu-bcakend.zeabur.app`

### 环境变量配置

项目已配置两个环境文件：

#### `.env.development` - 开发环境
```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

如需在开发时连接 Zeabur 后端，修改为：
```env
REACT_APP_API_BASE_URL=https://tiny-menu-bcakend.zeabur.app
```

#### `.env.production` - 生产环境
```env
REACT_APP_API_BASE_URL=https://tiny-menu-bcakend.zeabur.app
```

---

## 前端路由

### 页面路由

| 路由路径 | 页面组件 | 说明 |
|---------|---------|------|
| `/` | Login | 登录页面 |
| `/register` | Register | 注册页面 |
| `/customer` | CustomerDishSelection | 客户选菜页面 |
| `/chef` | ChefDishSelection | 厨师选菜页面 |
| `/env-test` | EnvTest | 环境测试页面（开发用） |

### 使用方式

在代码中引用路由路径时，使用路由常量：

```typescript
import { ROUTES } from './routes';

// 导航到登录页
navigate(ROUTES.LOGIN);

// 导航到客户页面
navigate(ROUTES.CUSTOMER);
```

---

## 后端 API 端点

### 1. 认证模块 (`/api/auth`)

| 方法 | 端点 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| POST | `/api/auth/register` | 用户注册 | `{username, password}` | UserResponse |
| POST | `/api/auth/login` | 用户登录 | `{username, password}` | Token |

### 2. 绑定关系管理 (`/api/bindings`)

| 方法 | 端点 | 说明 | 参数/请求体 | 响应 |
|------|------|------|------------|------|
| POST | `/api/bindings/request` | 申请绑定厨师 | `{chef_username}` | BindingResponse |
| GET | `/api/bindings/pending` | 查看待处理的绑定请求（厨师） | - | BindingResponse[] |
| PUT | `/api/bindings/{id}` | 同意或拒绝绑定请求 | `{status: 'approved' \| 'rejected'}` | BindingResponse |
| GET | `/api/bindings/my-bindings` | 查看我的绑定关系 | `?as_chef=true/false` | BindingResponse[] |
| DELETE | `/api/bindings/{id}` | 删除绑定关系 | - | 204 No Content |

### 3. 菜品管理 (`/api/dishes`)

| 方法 | 端点 | 说明 | 参数/请求体 | 响应 |
|------|------|------|------------|------|
| GET | `/api/dishes` | 获取所有菜品 | - | Dish[] |
| GET | `/api/dishes/{id}` | 获取菜品详情（含菜谱） | - | Dish |
| POST | `/api/dishes` | 创建菜品（仅厨师） | DishCreate | Dish |
| GET | `/api/dishes/recommendations/today` | 获取今日推荐 | - | Dish[] |
| POST | `/api/dishes/recommendations/generate` | 生成推荐（仅厨师） | - | Success |

### 4. 客户选菜 (`/api/customer-selections`)

| 方法 | 端点 | 说明 | 参数/请求体 | 响应 |
|------|------|------|------------|------|
| POST | `/api/customer-selections` | 选择菜品 | `{dish_id}` | CustomerSelection |
| GET | `/api/customer-selections/my-selections` | 我的选择 | - | CustomerSelection[] |
| GET | `/api/customer-selections/all` | 所有客户选择（仅厨师） | - | CustomerSelection[] |
| DELETE | `/api/customer-selections/{id}` | 取消选择 | - | 204 No Content |

### 5. 厨师选菜 (`/api/chef-selections`)

| 方法 | 端点 | 说明 | 参数/请求体 | 响应 |
|------|------|------|------------|------|
| POST | `/api/chef-selections` | 选择制作菜品 | `{customer_selection_id}` | ChefSelection |
| GET | `/api/chef-selections/my-selections` | 我的选择 | - | ChefSelection[] |
| DELETE | `/api/chef-selections/{id}` | 取消选择 | - | 204 No Content |

---

## API 调用示例

### 使用配置的端点

```typescript
import { API_ENDPOINTS } from '../config/api';
import { get, post, put, del } from '../services/api';

// 用户登录
const loginData = await post(API_ENDPOINTS.login, { username, password });

// 获取今日推荐
const recommendations = await get(API_ENDPOINTS.todayRecommendations);

// 申请绑定厨师
const binding = await post(API_ENDPOINTS.bindingRequest, { chef_username: 'chef1' });

// 查看我的绑定（作为客户）
const myBindings = await get(`${API_ENDPOINTS.myBindings}?as_chef=false`);

// 获取菜品详情
const dish = await get(API_ENDPOINTS.dishDetail(123));

// 删除绑定
await del(API_ENDPOINTS.deleteBinding(456));
```

---

## 业务流程

### 1. 用户注册登录
1. 用户访问 `/register` 注册账号
2. 注册成功后跳转到 `/` 登录
3. 登录成功后根据角色跳转：
   - 客户 → `/customer`
   - 厨师 → `/chef`

### 2. 建立绑定关系
1. 客户在客户页面申请绑定厨师（输入厨师用户名）
2. 厨师在厨师页面查看待处理的绑定请求
3. 厨师同意或拒绝绑定请求

### 3. 客户选菜
1. 客户查看今日推荐菜品
2. 客户从推荐中选择喜欢的菜品
3. 客户可以查看和管理自己的选择

### 4. 厨师选菜
1. 厨师查看已绑定客户的选择
2. 厨师从中选择要制作的菜品
3. 厨师可以查看完整的菜谱

---

## 注意事项

### CORS 配置
后端已配置 CORS 允许所有来源（`allow_origins=["*"]`），生产环境建议改为具体域名。

### JWT 认证
- 登录后会返回 `access_token`
- 需要在后续请求中携带 token（通过 Authorization header）
- Token 有效期：30 分钟（可在后端配置）

### 环境切换
- 开发环境：`npm start` 自动使用 `.env.development`
- 生产构建：`npm run build` 自动使用 `.env.production`

### 端口说明
- 前端开发服务器：默认 `3000`
- 后端 API：
  - 本地开发：`8080`
  - Zeabur 部署：`443` (HTTPS)

---

## 部署到 Zeabur

### 前端部署
1. 确保 `.env.production` 配置正确
2. 运行 `npm run build` 构建
3. 在 Zeabur 上部署 build 目录

### 后端已部署
- 公网访问：`https://tiny-menu-bcakend.zeabur.app`
- 内网访问：`tiny-menu-api.zeabur.internal:8080`

### 测试连接
访问前端的 `/env-test` 页面可以测试与后端的连接状态。

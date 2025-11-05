# Zeabur 部署指南

## 🚀 快速部署

### 方式一：使用 Zeabur Dashboard（推荐）

1. **登录 Zeabur**
   - 访问 [https://zeabur.com](https://zeabur.com)
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "Create Project"
   - 选择连接 GitHub 仓库
   - 选择 `tiny-menu-web` 仓库

3. **Zeabur 自动配置**
   - Zeabur 会自动检测到 `zeabur.json` 配置文件
   - 自动识别为 Node.js 项目
   - 自动使用配置的构建和启动命令

4. **配置环境变量（可选）**
   - 在 Zeabur Dashboard 的项目设置中
   - 添加环境变量（如果需要覆盖默认配置）：
     ```
     NODE_ENV=production
     REACT_APP_API_BASE_URL=https://tiny-menu-bcakend.zeabur.app
     ```

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（约 2-3 分钟）
   - 获取生成的域名

---

## 📝 配置说明

### zeabur.json 配置文件

```json
{
  "build": {
    "command": "npm run build"
  },
  "start": {
    "command": "npm run serve"
  },
  "env": {
    "NODE_ENV": "production",
    "REACT_APP_API_BASE_URL": "https://tiny-menu-bcakend.zeabur.app"
  }
}
```

#### 配置解释：

- **build.command**: 构建命令，使用 `npm run build`
  - 实际执行：`env-cmd -f .env.production react-scripts build`
  - 自动使用生产环境配置

- **start.command**: 启动命令，使用 `npm run serve`
  - 使用 `serve` 包托管静态文件
  - 监听 3000 端口

- **env**: 环境变量
  - `NODE_ENV=production`: 设置为生产环境
  - `REACT_APP_API_BASE_URL`: 后端 API 地址

---

## 🔧 方式二：使用 Dockerfile 部署

如果 Zeabur 检测到 `Dockerfile`，它会优先使用 Docker 构建。

### Dockerfile 配置

```dockerfile
# 构建阶段
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 使用 Dockerfile 的好处：
- ✅ 更轻量（使用 nginx）
- ✅ 更好的性能
- ✅ 支持 React Router

如果你想使用 Dockerfile 部署，在 Zeabur 中：
1. 删除或重命名 `zeabur.json`（让 Zeabur 检测 Dockerfile）
2. Zeabur 会自动使用 Dockerfile 构建

---

## 🌐 环境变量配置

### 在 Zeabur Dashboard 中配置

1. 进入项目设置
2. 找到 "Environment Variables" 部分
3. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 生产环境标识 |
| `REACT_APP_API_BASE_URL` | `https://tiny-menu-bcakend.zeabur.app` | 后端 API 地址 |

> 注意：如果在 `zeabur.json` 中已经定义了环境变量，Dashboard 中的配置会覆盖它。

---

## 📦 构建流程

### Zeabur 部署时会执行以下步骤：

1. **克隆仓库**
   ```bash
   git clone <your-repo>
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **执行构建**
   ```bash
   npm run build
   # 实际执行: env-cmd -f .env.production react-scripts build
   ```

4. **启动服务**
   ```bash
   npm run serve
   # 实际执行: serve -s build -l 3000
   ```

---

## ✅ 部署检查清单

部署前请确认：

- [ ] 后端 API 已部署到 `https://tiny-menu-bcakend.zeabur.app`
- [ ] `.env.production` 文件中的 API 地址正确
- [ ] `package.json` 包含所有必要依赖
- [ ] `zeabur.json` 配置文件已提交到 Git
- [ ] 代码已推送到 GitHub

---

## 🧪 本地测试生产构建

在部署前，建议本地测试生产构建：

```bash
# 1. 构建生产版本
npm run build

# 2. 本地启动生产构建
npm run serve

# 3. 访问 http://localhost:3000 测试
```

---

## 🔍 常见问题

### Q1: 部署后 API 请求失败？
**A**: 检查环境变量 `REACT_APP_API_BASE_URL` 是否正确配置。

### Q2: 页面刷新后 404？
**A**: 如果使用 `serve`，它已经配置了 SPA 路由支持（`-s` 参数）。
如果使用 Dockerfile，确保 nginx.conf 配置了 `try_files`。

### Q3: 构建失败？
**A**: 检查：
- Node 版本是否兼容（推荐 18+）
- 所有依赖是否在 `package.json` 中
- 构建命令是否正确

### Q4: 环境变量没有生效？
**A**: React 应用的环境变量在构建时注入，修改环境变量后需要重新构建。

---

## 📊 部署后验证

部署成功后，访问以下路径验证：

1. **主页**: `https://your-domain.zeabur.app/`
2. **环境测试页**: `https://your-domain.zeabur.app/env-test`
   - 检查显示的 API 地址是否正确
   - 注意：生产环境不会显示右下角的环境徽章

3. **功能测试**:
   - 登录功能
   - 客户选择页面
   - 厨师确认页面

---

## 🔄 持续部署

配置完成后，Zeabur 会自动监听 Git 仓库的变更：

1. 推送代码到 GitHub
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. Zeabur 自动触发构建和部署

3. 几分钟后新版本上线

---

## 📚 相关文档

- [Zeabur 官方文档](https://zeabur.com/docs)
- [React 部署指南](https://create-react-app.dev/docs/deployment/)
- [项目环境配置说明](./ENV.md)

---

**更新日期**: 2025-11-06
**状态**: ✅ 配置完成，随时可部署

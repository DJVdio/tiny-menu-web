# 环境配置说明

## 环境变量文件

项目包含以下环境变量文件：

- `.env` - 默认配置（生产环境）
- `.env.development` - 本地开发环境配置
- `.env.production` - 生产环境配置
- `.env.local` - 本地覆盖配置（不提交到 Git）

## 可用的启动脚本

### 开发模式

```bash
# 使用默认环境（自动加载 .env.development）
npm start

# 明确指定开发环境
npm run start:dev

# 使用生产环境配置进行开发
npm run start:prod
```

### 构建模式

```bash
# 使用默认环境构建
npm run build

# 构建开发版本
npm run build:dev

# 构建生产版本
npm run build:prod
```

## 环境配置

### 本地开发

连接本地后端（端口 8080）：

```bash
npm run start:dev
```

### 连接生产后端

在本地开发时连接 Zeabur 上的生产后端：

```bash
npm run start:prod
```

### Zeabur 部署

Zeabur 会自动使用 `.env.production` 中的配置进行构建和部署。

环境变量会在构建时注入，API 地址为：
`https://tiny-menu-bcakend.zeabur.app`

## 自定义配置

如果需要自定义本地配置，创建 `.env.local` 文件：

```bash
# .env.local
REACT_APP_API_BASE_URL=http://your-custom-backend:8080
```

`.env.local` 文件会被 Git 忽略，不会被提交到代码库。

## 环境变量优先级

环境变量的加载优先级（从高到低）：

1. `.env.local`
2. `.env.development` / `.env.production`（取决于 NODE_ENV）
3. `.env`

## 注意事项

- 环境变量必须以 `REACT_APP_` 开头才能在前端代码中访问
- 修改环境变量后需要重启开发服务器
- 生产构建时环境变量会被编译到代码中，无法在运行时修改

# 构建阶段
FROM node:22 AS build
LABEL "language"="nodejs"
LABEL "framework"="create-react-app"

WORKDIR /src

# 更新 npm
RUN npm update -g npm

# 复制所有文件
COPY . .

# 安装依赖
RUN npm install

# 构建生产版本
RUN npm run build

# 输出阶段
FROM scratch AS output
COPY --from=build /src/build /

# 运行时阶段 - 使用 Caddy 静态服务器
FROM zeabur/caddy-static AS runtime

# 复制构建产物到 Caddy 的静态文件目录
COPY --from=output / /usr/share/caddy

# 暴露 3000 端口（匹配 Zeabur Container Port 配置）
EXPOSE 3000

# 设置 Caddy 监听 3000 端口
ENV CADDY_PORT=3000

# 创建自定义 Caddyfile
RUN printf ':3000 {\n    root * /usr/share/caddy\n    file_server\n    try_files {path} /index.html\n}\n' > /etc/caddy/Caddyfile

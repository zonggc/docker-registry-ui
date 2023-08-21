# docker-registry-ui

vite + vue + naive-ui \
一个简单的 docker 镜像查看库，暂时不支持 镜像删除

## 使用
### 修改 env 或创建 .env.development
```sh
VITE_API_BASE_URL = "<docker-registry> development url"
```

### 安装依赖
```sh
npm install
```

### 启动项目
```sh
npm run dev
```

### 打包
#### 修改 env 或创建 .env.production
```sh
VITE_API_BASE_URL = "<docker-registry> production url"
```

#### 构建
```sh
npm run build
```

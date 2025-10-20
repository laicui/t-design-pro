## 🔧 开发指南

## 📦 拉取代码

```bash
git clone https://github.com/laicui/t-design-pro
```

## 🔍 安装依赖

```bash
pnpm install
```

##

## 🚀 启动开发调试

```
pnpm run docs:dev
```

## 发布版本

1. 执行创建新版本并提交 TAG

```bash
pnpm release:publish
```

> 提交代码会自动触发 github action，自动构建 vitepress 文档

2. 执行脚本创建 release

```bash
pnpm release:create
```

> 发布 release，会触发 github action，自动构建发布 npm

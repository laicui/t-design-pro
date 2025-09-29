# 更新日志

本项目的所有重要更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。


## [1.8.0](https://github.com/laicui/t-design-pro/compare/v1.7.0...v1.8.0) (2025-09-29)


### ✨ 新功能

* 更新 tsconfig.json 配置，调整模块解析方式 ([f155d27](https://github.com/laicui/t-design-pro/commit/f155d2769147d124b5828cf1fb366f3e37e35f5f))
* 添加 pnpm-workspace.yaml 文件，配置 onlyBuiltDependencies ([3783a6b](https://github.com/laicui/t-design-pro/commit/3783a6bf7fcae3117d6467eefaee80d28893195b))
* 添加 tdesign-icons-vue-next 依赖，版本更新至 0.4.1 ([8c9e0b6](https://github.com/laicui/t-design-pro/commit/8c9e0b634e5f59ec5617ff93a8c271180e19d5de))

## [1.7.0](https://github.com/laicui/t-design-pro/compare/v1.6.0...v1.7.0) (2025-09-29)


### ✨ 新功能

* 添加 dayjs 依赖，更新至 1.11.18 版本 ([6af33f4](https://github.com/laicui/t-design-pro/commit/6af33f4c0cad36d3bb8d5a432ac66ff9b9952a48))

## [1.6.0](https://github.com/laicui/t-design-pro/compare/v1.5.1...v1.6.0) (2025-09-29)


### ♻️ 代码重构

* 重构表格选择功能 ([0244b9f](https://github.com/laicui/t-design-pro/commit/0244b9fcf2ad930d9390fafc7510cfd8da4b587c))


### ✨ 新功能

* 添加 CosUpload 组件，支持文件上传、图片排序和视频显示功能 ([cebe33b](https://github.com/laicui/t-design-pro/commit/cebe33b34f01392569a24cd0e3735a77e6077dba))
* **table-pro:** 支持表格多选及 select-change 事件通讯 ([bde4cb7](https://github.com/laicui/t-design-pro/commit/bde4cb741333b689e8b107c976d2458e84a9ccbd))

### [1.5.1](https://github.com/laicui/t-design-pro/compare/v1.5.0...v1.5.1) (2025-08-28)


### 💄 样式更新

* 代码格式化，移除多余空行 ([ae5010a](https://github.com/laicui/t-design-pro/commit/ae5010a431611e19248f8c378fbf3fa2aa42358a))


### 🔧 构建/工具

* 修正发布脚本命令格式 ([e2497e4](https://github.com/laicui/t-design-pro/commit/e2497e424250cc267a6a0e9dbc07e1915b560f89))

## [1.5.0](https://github.com/laicui/t-design-pro/compare/v1.4.2...v1.5.0) (2025-08-28)


### 🔧 构建/工具

* **release:** 1.4.2 ([931e5e0](https://github.com/laicui/t-design-pro/commit/931e5e06d4a5769f9b00f653b4a51f11bb9c4b38))


### ♻️ 代码重构

* 移除自定义标签创建脚本，恢复 standard-version 默认行为 ([e3a6083](https://github.com/laicui/t-design-pro/commit/e3a6083f95f84f20089d9838855c4ef083f4b4c1))


### ✨ 新功能

* 添加基于 CHANGELOG.md 的 Release Notes 生成脚本 ([91803b0](https://github.com/laicui/t-design-pro/commit/91803b050f3d6821187227267e423b1207e3e635))

## [1.2.0](https://github.com/laicui/t-design-pro/compare/v1.1.1...v1.2.0) (2025-08-28)


### ✨ 新功能

* 添加自动创建 GitHub Release 功能 ([f47f59a](https://github.com/laicui/t-design-pro/commit/f47f59a21af74d7cb48d23024d1573433433b587))

### [1.1.1](https://github.com/laicui/t-design-pro/compare/v1.1.0...v1.1.1) (2025-08-28)


### 🔧 构建/工具

* 移除 prebump 脚本，避免构建过程干扰版本发布 ([56afc57](https://github.com/laicui/t-design-pro/commit/56afc5712caf9e362738943060d370c2186e0eeb))

## [1.1.0](https://github.com/laicui/t-design-pro/compare/v1.0.26...v1.1.0) (2025-08-28)


### ♻️ 代码重构

* 简化发布流程，直接使用 standard-version ([6f1d688](https://github.com/laicui/t-design-pro/commit/6f1d688eff450d3f03d8666f4caa87bb7cf42afa))


### 📝 文档更新

* update CHANGELOG.md for v1.0.26 ([7dfa0a8](https://github.com/laicui/t-design-pro/commit/7dfa0a8f9c405b1c5d5bb0bcb6a3127b5d52b843))
* 修复 RELEASE.md 中 Keep a Changelog 链接格式 ([51305c9](https://github.com/laicui/t-design-pro/commit/51305c9e6004a553b5ae29835665f2d3e3daca15))
* 完善 standard-version 发布配置 ([70f7937](https://github.com/laicui/t-design-pro/commit/70f79375babfcd510070e64283acc607b002dbc7))


### ✨ 新功能

* 优化发布流程，添加一键发布命令 ([0c6f75c](https://github.com/laicui/t-design-pro/commit/0c6f75c7b17605159df6bb840af7405d2694ac7d))
* 添加 standard-version 自动化版本管理 ([7ef0b53](https://github.com/laicui/t-design-pro/commit/7ef0b53aa347669defaa98cf7a76c5f2397d6975))


### 🔧 构建/工具

* **release:** null ([0309482](https://github.com/laicui/t-design-pro/commit/0309482fcfb1b220b226031c84fda225c7563e13))
* 删除不再使用的 release.js 和 global.ts 文件 ([02ee660](https://github.com/laicui/t-design-pro/commit/02ee660785b2bc81afb2154b3a08bab09c817221))
* 更新版本号为 1.0.26 ([79b533b](https://github.com/laicui/t-design-pro/commit/79b533ba66d4748e33098e4a4da8e353c07d93f1))


### 🐛 Bug 修复

* 修复 publish.js 中 CHANGELOG.md 生成逻辑 ([8610946](https://github.com/laicui/t-design-pro/commit/8610946e92d19ed1ed582681542fec68af1f09a7))
* 修复 standard-version 配置，解决版本号变 null 的问题 ([96e982c](https://github.com/laicui/t-design-pro/commit/96e982c7853e2b20dbf667708eb9c2a85f69a81f))

## [1.0.26] - 2025-08-28

### ✨ 新功能

- 添加 TablePro 组件 size 属性支持 (2bae3fc) - @Ace _2025-08-28_

## [1.0.25] - 2025-08-28

- 版本更新

## [1.0.24] - 2025-08-28

- 版本更新

## [1.0.23] - 2025-08-28

- 版本更新

## [1.0.22] - 2025-08-27

- 版本更新

## [1.0.21] - 2025-08-27

- 版本更新

## [1.0.20] - 2025-08-26

- 版本更新

## [1.0.19] - 2025-08-26

- 版本更新

## [1.0.18] - 2025-08-05

- 版本更新

## [1.0.17] - 2025-08-05

- 版本更新

## [1.0.16] - 2024-12-19

### 新增

- TablePro 组件：增强版表格组件
- 集成搜索表单功能
- 支持分页、排序、筛选
- 支持列配置增强（隐藏列、枚举值渲染、搜索配置）
- 提供丰富的插槽系统
- 完整的 TypeScript 类型支持

### 特性

- 基于 TDesign Vue Next 构建
- 支持 Vue 3.5+
- 支持按需引入和 Tree Shaking
- 响应式设计，移动端友好
- 完整的文档和示例

### 技术栈

- Vue 3.5+
- TypeScript
- TDesign Vue Next 1.14+
- Vite 构建工具
- VitePress 文档系统

---

## 版本说明

- **新增**: 新功能
- **修改**: 对现有功能的更改
- **弃用**: 即将移除的功能
- **移除**: 已移除的功能
- **修复**: 问题修复
- **安全**: 安全相关的修复

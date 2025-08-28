# 发布流程说明

本项目使用 `standard-version` 进行自动化版本管理和 CHANGELOG 生成。

## 🚀 快速发布

```bash
# 自动版本发布（推荐）
# 根据 conventional commits 自动决定版本类型
pnpm run publish

# 查看发布效果（不实际发布）
pnpm run publish:dry
```

## 📦 指定版本类型

```bash
# 修订版本 (1.0.0 → 1.0.1)
pnpm run publish:patch

# 次版本 (1.0.0 → 1.1.0) 
pnpm run publish:minor

# 主版本 (1.0.0 → 2.0.0)
pnpm run publish:major
```

## 📝 提交规范

为了自动生成准确的 CHANGELOG，请遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

### 提交类型

- `feat:` - ✨ 新功能
- `fix:` - 🐛 Bug 修复
- `docs:` - 📝 文档更新
- `style:` - 💄 样式更新（不影响代码逻辑）
- `refactor:` - ♻️ 代码重构
- `perf:` - ⚡ 性能优化
- `test:` - ✅ 测试
- `chore:` - 🔧 构建/工具
- `ci:` - 👷 CI/CD

### 提交示例

```bash
# 新功能
git commit -m "feat: 添加 TablePro 组件 size 属性支持"

# Bug 修复
git commit -m "fix: 修复表格分页显示异常问题"

# 文档更新
git commit -m "docs: 更新 API 文档和使用示例"

# 重大变更（会触发主版本升级）
git commit -m "feat!: 重构 TablePro API，移除废弃属性"
```

## 🔄 发布流程

1. **开发完成** - 确保所有更改已提交
2. **运行测试** - `pnpm run test`（如果有）
3. **预览发布** - `pnpm run publish:dry`
4. **执行发布** - `pnpm run publish`
5. **检查结果** - 查看 GitHub Release 和 CHANGELOG.md

## 📋 CHANGELOG 生成规则

- **自动分类** - 根据提交类型自动分类到对应章节
- **包含链接** - 每个提交都有 GitHub 链接
- **作者信息** - 显示提交者和日期
- **版本对比** - 包含版本间的对比链接

## 🛠️ 高级用法

### 仅使用 standard-version

```bash
# 直接使用 standard-version（不包含推送）
pnpm run release

# 预发布版本
pnpm run release:alpha  # 1.0.0-alpha.0
pnpm run release:beta   # 1.0.0-beta.0
```

### 手动干预

如果需要手动调整版本号或 CHANGELOG：

1. 运行 `pnpm run publish:dry` 查看预期更改
2. 手动编辑 `CHANGELOG.md`（如需要）
3. 手动调整 `package.json` 中的版本号（如需要）
4. 提交更改并手动创建标签

## 🔧 配置文件

- `.versionrc.json` - standard-version 配置
- `release.js` - 自动化发布脚本
- `publish.js` - 旧版发布脚本（备用）

## 📚 相关文档

- [Standard Version](https://github.com/conventional-changelog/standard-version)
- [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)
- [Keep a Changelog](https://keepachangelog.com/zh-CN/)

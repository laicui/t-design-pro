# 发布流程说明

本项目使用 `standard-version` 进行自动化版本管理和 CHANGELOG 生成。

## 🚀 发布命令

```bash
# 查看发布效果（不实际发布）
pnpm run release:dry

# 自动版本发布（根据 conventional commits 自动决定版本类型）
pnpm run release

# 指定版本类型
pnpm run release:patch  # 1.0.0 → 1.0.1
pnpm run release:minor  # 1.0.0 → 1.1.0
pnpm run release:major  # 1.0.0 → 2.0.0

# 预发布版本
pnpm run release:alpha  # 1.0.0-alpha.0
pnpm run release:beta   # 1.0.0-beta.0
```

## 📝 提交规范

为了自动生成准确的 CHANGELOG，请遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

### 提交类型

- `feat:` - ✨ 新功能
- `fix:` - 🐛 Bug 修复
- `docs:` - 📝 文档更新
- `style:` - 💄 样式更新
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

# 重大变更（会触发主版本升级）
git commit -m "feat!: 重构 TablePro API，移除废弃属性"
```

## 🔄 标准发布流程

1. **开发完成** - 确保所有更改已提交并推送
2. **预览发布** - `pnpm run release:dry` 查看将要生成的版本和 CHANGELOG
3. **执行发布** - `pnpm run release` 自动生成版本、更新 CHANGELOG、创建 git tag
4. **推送发布** - `git push --follow-tags origin main` 推送代码和标签
5. **检查结果** - 查看 GitHub Release 和生成的 CHANGELOG.md

## 📋 CHANGELOG 生成规则

- **自动分类** - 根据提交类型自动分类到对应章节
- **包含链接** - 每个提交都有 GitHub 链接和版本对比链接
- **中文化** - 使用中文分类标题
- **自动版本** - 根据 conventional commits 自动决定版本升级类型

## �️ 配置文件

- `.versionrc.json` - standard-version 配置，包含中文化设置
- `CHANGELOG.md` - 自动生成的更新日志

## 📚 相关文档

- [Standard Version](https://github.com/conventional-changelog/standard-version)
- [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)
- [Keep a Changelog](https://keepachangelog.com/zh-CN/)

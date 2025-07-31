#!/usr/bin/env node

import process from 'node:process'

import { execSync } from 'child_process'
import fs from 'fs'

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      stdio: 'inherit',
      encoding: 'utf8',
      ...options
    })
  } catch {
    log(`命令执行失败: ${command}`, 'red')
    process.exit(1)
  }
}

function execSilent(command) {
  try {
    return execSync(command, {
      encoding: 'utf8'
    }).trim()
  } catch {
    return ''
  }
}

function hasUncommittedChanges() {
  const status = execSilent('git status --porcelain')
  return status.length > 0
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  return packageJson.version
}

function incrementVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number)
  switch (type) {
    case 'major':
      parts[0]++
      parts[1] = 0
      parts[2] = 0
      break
    case 'minor':
      parts[1]++
      parts[2] = 0
      break
    case 'patch':
    default:
      parts[2]++
      break
  }
  return parts.join('.')
}

function updatePackageVersion(newVersion) {
  const packagePath = 'package.json'
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  packageJson.version = newVersion
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')
}

function getLastTag() {
  try {
    return execSilent('git describe --tags --abbrev=0')
  } catch {
    // 如果没有tag，返回第一个commit
    return execSilent('git rev-list --max-parents=0 HEAD')
  }
}

function generateChangelog(lastTag) {
  try {
    // 获取自上一个tag以来的所有commit
    const commits = execSilent(
      `git log ${lastTag}..HEAD --pretty=format:"%h|%s|%an|%ad" --date=short`
    )

    if (!commits) {
      return '- 版本更新'
    }

    const commitLines = commits.split('\n')
    const changes = {
      feat: [],
      fix: [],
      docs: [],
      style: [],
      refactor: [],
      test: [],
      chore: [],
      other: []
    }

    commitLines.forEach((line) => {
      const [hash, message, author, date] = line.split('|')

      // 解析conventional commit格式
      const conventionalMatch = message.match(
        /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?\s*:\s*(.+)/
      )

      if (conventionalMatch) {
        const [, type, scope, description] = conventionalMatch
        const scopeText = scope ? ` ${scope}` : ''
        changes[type].push(`- ${description}${scopeText} (${hash}) - @${author} *${date}*`)
      } else {
        // 智能分类非conventional commit
        const lowerMessage = message.toLowerCase()
        if (
          lowerMessage.includes('fix') ||
          lowerMessage.includes('修复') ||
          lowerMessage.includes('bugfix')
        ) {
          changes.fix.push(`- ${message} (${hash}) - @${author} *${date}*`)
        } else if (
          lowerMessage.includes('feat') ||
          lowerMessage.includes('新增') ||
          lowerMessage.includes('add')
        ) {
          changes.feat.push(`- ${message} (${hash}) - @${author} *${date}*`)
        } else if (lowerMessage.includes('doc') || lowerMessage.includes('文档')) {
          changes.docs.push(`- ${message} (${hash}) - @${author} *${date}*`)
        } else if (lowerMessage.includes('refactor') || lowerMessage.includes('重构')) {
          changes.refactor.push(`- ${message} (${hash}) - @${author} *${date}*`)
        } else if (lowerMessage.includes('test') || lowerMessage.includes('测试')) {
          changes.test.push(`- ${message} (${hash}) - @${author} *${date}*`)
        } else if (
          lowerMessage.includes('chore') ||
          lowerMessage.includes('构建') ||
          lowerMessage.includes('依赖')
        ) {
          changes.chore.push(`- ${message} (${hash}) - @${author} *${date}*`)
        } else {
          changes.other.push(`- ${message} (${hash}) - @${author} *${date}*`)
        }
      }
    })

    // 生成changelog
    let changelog = []

    if (changes.feat.length > 0) {
      changelog.push('### ✨ 新功能')
      changelog.push(...changes.feat)
      changelog.push('')
    }

    if (changes.fix.length > 0) {
      changelog.push('### 🐛 Bug 修复')
      changelog.push(...changes.fix)
      changelog.push('')
    }

    if (changes.docs.length > 0) {
      changelog.push('### 📝 文档更新')
      changelog.push(...changes.docs)
      changelog.push('')
    }

    if (changes.refactor.length > 0) {
      changelog.push('### ♻️ 代码重构')
      changelog.push(...changes.refactor)
      changelog.push('')
    }

    if (changes.style.length > 0) {
      changelog.push('### 💄 样式更新')
      changelog.push(...changes.style)
      changelog.push('')
    }

    if (changes.test.length > 0) {
      changelog.push('### ✅ 测试')
      changelog.push(...changes.test)
      changelog.push('')
    }

    if (changes.chore.length > 0) {
      changelog.push('### 🔧 构建/工具')
      changelog.push(...changes.chore)
      changelog.push('')
    }

    if (changes.other.length > 0) {
      changelog.push('### 🔀 其他更改')
      changelog.push(...changes.other)
      changelog.push('')
    }

    return changelog.join('\n').trim() || '- 版本更新'
  } catch (error) {
    log(`生成changelog失败: ${error.message}`, 'yellow')
    return '- 版本更新'
  }
}

async function main() {
  log('🚀 开始发布流程...', 'blue')

  // 抑制zsh切换提示
  process.env.BASH_SILENCE_DEPRECATION_WARNING = '1'

  // 检查是否在git仓库中
  try {
    execSilent('git rev-parse --git-dir')
  } catch {
    log('❌ 当前目录不是git仓库', 'red')
    process.exit(1)
  }

  // 获取命令行参数
  const args = process.argv.slice(2)
  const versionType = args[0] || 'patch' // patch, minor, major

  if (!['patch', 'minor', 'major'].includes(versionType)) {
    log('❌ 版本类型必须是: patch, minor, major', 'red')
    process.exit(1)
  }

  // 检查工作区状态
  if (hasUncommittedChanges()) {
    log('⚠️  检测到未提交的更改，将在发布后自动提交', 'yellow')
  }

  // 获取当前版本并计算新版本
  const currentVersion = getCurrentVersion()
  const newVersion = incrementVersion(currentVersion, versionType)

  log(`📦 当前版本: ${currentVersion}`, 'blue')
  log(`📦 新版本: ${newVersion} (将创建GitHub Release)`, 'green')

  // 确认发布
  console.log('\n是否继续发布? (y/N)')
  process.stdin.setRawMode(true)
  process.stdin.resume()

  const confirmed = await new Promise((resolve) => {
    process.stdin.once('data', (key) => {
      process.stdin.setRawMode(false)
      process.stdin.pause()
      const input = key.toString().toLowerCase().trim()
      resolve(input === 'y' || input === 'yes')
    })
  })

  if (!confirmed) {
    log('❌ 发布已取消', 'yellow')
    process.exit(0)
  }

  try {
    // 1. 构建项目
    log('\n🔨 构建项目...', 'blue')
    exec('npm run build')

    // 2. 更新版本号
    log(`\n📝 更新版本号到 ${newVersion}...`, 'blue')
    updatePackageVersion(newVersion)

    // 3. 运行测试（如果存在）
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      if (pkg.scripts && pkg.scripts.test) {
        log('\n🧪 运行测试...', 'blue')
        exec('npm test')
      }
    }

    // 4. 创建git tag和提交
    log(`\n🏷️  创建git标签 v${newVersion}...`, 'blue')
    exec(`git add package.json`)
    exec(`git commit -m "chore: bump version to ${newVersion}"`)
    exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`)

    // 5. 检查并提交其他未提交的更改
    if (hasUncommittedChanges()) {
      log('\n📝 提交其他未提交的更改...', 'blue')
      exec('git add .')
      exec(`git commit -m "chore: post-release cleanup and updates"`)
    }

    // 6. 推送到远程仓库
    log('\n⬆️  推送到远程仓库...', 'blue')
    exec('git push origin main')
    exec(`git push origin v${newVersion}`)

    // 7. 生成更新日志
    log('\n📋 生成更新日志...', 'blue')
    const lastTag = getLastTag()
    const changelog = generateChangelog(lastTag, newVersion)

    // 7. 创建GitHub Release (这将触发npm发布)
    log('\n🎉 创建GitHub Release...', 'blue')
    const releaseNotes = `# Release v${newVersion}

## 🔥 更新内容

${changelog}

## 📦 安装

\`\`\`bash
npm install t-design-pro@${newVersion}
\`\`\`

## 🔗 链接

- [NPM Package](https://www.npmjs.com/package/t-design-pro)
- [GitHub Repository](https://github.com/laicui/t-design-pro)
- [文档地址](https://github.com/laicui/t-design-pro#readme)`

    // 尝试使用gh CLI，如果失败则提示手动创建
    try {
      exec(
        `gh release create v${newVersion} --title "Release v${newVersion}" --notes "${releaseNotes}"`
      )
      log(`\n✅ GitHub Release创建成功! GitHub Actions将自动发布到NPM`, 'green')
      log(`🔗 Release: https://github.com/laicui/t-design-pro/releases/tag/v${newVersion}`, 'blue')
      log(`⏳ 请等待GitHub Actions完成npm发布...`, 'yellow')
    } catch {
      log(`⚠️  创建GitHub Release失败，请手动创建:`, 'yellow')
      log(`🔗 https://github.com/laicui/t-design-pro/releases/new?tag=v${newVersion}`, 'blue')
      log(`📝 Release标题: Release v${newVersion}`, 'blue')
      log(`📝 Release内容:\n${releaseNotes.replace(/\\n/g, '\n')}`, 'blue')
      log(`ℹ️  创建后将自动触发GitHub Actions发布npm`, 'blue')
    }
  } catch (error) {
    log(`\n❌ 发布失败: ${error.message}`, 'red')

    // 回滚版本号
    log('🔄 回滚版本号...', 'yellow')
    updatePackageVersion(currentVersion)

    process.exit(1)
  }
}

main().catch(console.error)

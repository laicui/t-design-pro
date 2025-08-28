#!/usr/bin/env node

/**
 * 使用 standard-version 的自动化发布脚本
 * 替代原有的 publish.js，使用专业工具生成 CHANGELOG
 */

import { execSync } from 'child_process'
import process from 'node:process'

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
  } catch (error) {
    log(`命令执行失败: ${command}`, 'red')
    log(`错误信息: ${error.message}`, 'red')
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

async function main() {
  const [,, releaseType = 'auto'] = process.argv

  log('🚀 使用 standard-version 进行自动化发布', 'blue')
  log(`📦 发布类型: ${releaseType}`, 'blue')

  // 检查工作目录是否干净
  if (hasUncommittedChanges()) {
    log('❌ 存在未提交的更改，请先提交或暂存', 'red')
    process.exit(1)
  }

  // 检查当前分支
  const currentBranch = execSilent('git branch --show-current')
  if (currentBranch !== 'main') {
    log(`❌ 当前分支是 ${currentBranch}，请切换到 main 分支`, 'red')
    process.exit(1)
  }

  try {
    // 拉取最新代码
    log('\n⬇️  拉取最新代码...', 'blue')
    exec('git pull origin main')

    // 执行 standard-version
    log('\n📋 使用 standard-version 生成版本和 CHANGELOG...', 'blue')
    
    let releaseCommand = 'pnpm run release'
    
    switch (releaseType) {
      case 'patch':
        releaseCommand = 'pnpm run release:patch'
        break
      case 'minor':
        releaseCommand = 'pnpm run release:minor'
        break
      case 'major':
        releaseCommand = 'pnpm run release:major'
        break
      case 'alpha':
        releaseCommand = 'pnpm run release:alpha'
        break
      case 'beta':
        releaseCommand = 'pnpm run release:beta'
        break
      case 'dry':
        releaseCommand = 'pnpm run release:dry'
        log('🔍 干运行模式 - 仅查看效果，不会实际发布', 'yellow')
        break
      case 'auto':
      default:
        // 自动根据 conventional commits 决定版本类型
        break
    }

    exec(releaseCommand)

    if (releaseType === 'dry') {
      log('\n✅ 干运行完成！上面是预期的更改效果', 'green')
      return
    }

    // 推送标签和代码
    log('\n⬆️  推送到远程仓库...', 'blue')
    exec('git push --follow-tags origin main')

    // 获取新版本号
    const newVersion = execSilent('git describe --tags --abbrev=0').replace('v', '')
    
    log(`\n🎉 发布成功！版本: v${newVersion}`, 'green')
    log('\n📦 下一步操作:', 'blue')
    log('   1. 检查 GitHub Release 是否自动创建', 'blue')
    log('   2. 如需要，手动执行 npm publish', 'blue')
    log(`   3. 查看 CHANGELOG.md 确认更新日志`, 'blue')
    
  } catch (error) {
    log(`\n❌ 发布失败: ${error.message}`, 'red')
    process.exit(1)
  }
}

main().catch(error => {
  log(`未处理的错误: ${error.message}`, 'red')
  process.exit(1)
})

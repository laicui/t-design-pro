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

function execInteractive(command, options = {}) {
  try {
    return execSync(command, {
      stdio: 'inherit',
      encoding: 'utf8',
      ...options
    })
  } catch (error) {
    // 对于npm publish，如果是2FA错误，给出友好提示
    if (command.includes('npm publish') && error.message.includes('code')) {
      log('⚠️  如果需要输入二次验证码，请在上方输入', 'yellow')
    }
    log(`命令执行失败: ${command}`, 'red')
    process.exit(1)
  }
}

function execSilent(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim()
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

function checkNpmLogin() {
  try {
    const result = execSilent('npm whoami')
    if (!result) {
      log('❌ 未登录npm账号，请先运行: npm login', 'red')
      process.exit(1)
    }
    log(`✅ 已登录npm账号: ${result}`, 'green')
    return result
  } catch {
    log('❌ 未登录npm账号，请先运行: npm login', 'red')
    process.exit(1)
  }
}

async function main() {
  log('🚀 开始发布流程...', 'blue')

  // 检查npm登录状态
  log('\n🔍 检查npm登录状态...', 'blue')
  checkNpmLogin()

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
  log(`📦 新版本: ${newVersion}`, 'green')

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

    // 4. 发布到NPM
    log('\n📤 发布到NPM...', 'blue')
    log('💡 如果您的npm账号启用了二次验证，请准备好验证码', 'yellow')
    execInteractive('npm publish')

    // 5. 创建git tag
    log(`\n🏷️  创建git标签 v${newVersion}...`, 'blue')
    exec(`git add package.json`)
    exec(`git commit -m "chore: bump version to ${newVersion}"`)
    exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`)

    // 6. 检查并提交其他未提交的更改
    if (hasUncommittedChanges()) {
      log('\n📝 提交其他未提交的更改...', 'blue')
      exec('git add .')
      exec(`git commit -m "chore: post-release cleanup and updates"`)
    }

    // 7. 推送到远程仓库
    log('\n⬆️  推送到远程仓库...', 'blue')
    exec('git push origin main')
    exec(`git push origin v${newVersion}`)

    log(`\n✅ 发布成功! 版本 ${newVersion} 已发布到NPM`, 'green')
    log(`🔗 NPM: https://www.npmjs.com/package/t-design-pro/v/${newVersion}`, 'blue')
  } catch (error) {
    log(`\n❌ 发布失败: ${error.message}`, 'red')

    // 回滚版本号
    log('🔄 回滚版本号...', 'yellow')
    updatePackageVersion(currentVersion)

    process.exit(1)
  }
}

main().catch(console.error)

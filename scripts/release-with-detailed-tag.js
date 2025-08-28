#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
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

function execSilent(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  return packageJson.version
}

function getLastTag() {
  try {
    return execSilent('git describe --tags --abbrev=0')
  } catch {
    // 如果没有tag，返回第一个commit
    return execSilent('git rev-list --max-parents=0 HEAD')
  }
}

function generateDetailedTagMessage(currentVersion, lastTag) {
  try {
    // 获取自上一个tag以来的所有commit
    const commits = execSilent(
      `git log ${lastTag}..HEAD --pretty=format:"%h|%s|%an|%ad" --date=short`
    )

    if (!commits) {
      return `Release v${currentVersion}\n\n- 版本更新`
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
      const [hash, message, _author, _date] = line.split('|')

      // 跳过自动生成的提交
      if (
        message.includes('chore(release):') ||
        message.includes('docs: update CHANGELOG.md') ||
        message.includes('Release v')
      ) {
        return
      }

      // 解析conventional commit格式
      const conventionalMatch = message.match(
        /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?\s*:\s*(.+)/
      )

      if (conventionalMatch) {
        const [, type, scope, description] = conventionalMatch
        const scopeText = scope ? ` ${scope}` : ''
        changes[type].push(`- ${description}${scopeText} (${hash})`)
      } else {
        // 智能分类非conventional commit
        const lowerMessage = message.toLowerCase()
        if (
          lowerMessage.includes('fix') ||
          lowerMessage.includes('修复') ||
          lowerMessage.includes('bugfix')
        ) {
          changes.fix.push(`- ${message} (${hash})`)
        } else if (
          lowerMessage.includes('feat') ||
          lowerMessage.includes('新增') ||
          lowerMessage.includes('add')
        ) {
          changes.feat.push(`- ${message} (${hash})`)
        } else if (lowerMessage.includes('doc') || lowerMessage.includes('文档')) {
          changes.docs.push(`- ${message} (${hash})`)
        } else if (lowerMessage.includes('refactor') || lowerMessage.includes('重构')) {
          changes.refactor.push(`- ${message} (${hash})`)
        } else if (lowerMessage.includes('test') || lowerMessage.includes('测试')) {
          changes.test.push(`- ${message} (${hash})`)
        } else if (
          lowerMessage.includes('chore') ||
          lowerMessage.includes('构建') ||
          lowerMessage.includes('依赖')
        ) {
          changes.chore.push(`- ${message} (${hash})`)
        } else {
          changes.other.push(`- ${message} (${hash})`)
        }
      }
    })

    // 生成tag消息
    let tagMessage = [`Release v${currentVersion}`, '']

    if (changes.feat.length > 0) {
      tagMessage.push('✨ 新功能:')
      tagMessage.push(...changes.feat)
      tagMessage.push('')
    }

    if (changes.fix.length > 0) {
      tagMessage.push('🐛 Bug 修复:')
      tagMessage.push(...changes.fix)
      tagMessage.push('')
    }

    if (changes.docs.length > 0) {
      tagMessage.push('📝 文档更新:')
      tagMessage.push(...changes.docs)
      tagMessage.push('')
    }

    if (changes.refactor.length > 0) {
      tagMessage.push('♻️ 代码重构:')
      tagMessage.push(...changes.refactor)
      tagMessage.push('')
    }

    if (changes.style.length > 0) {
      tagMessage.push('💄 样式更新:')
      tagMessage.push(...changes.style)
      tagMessage.push('')
    }

    if (changes.test.length > 0) {
      tagMessage.push('✅ 测试:')
      tagMessage.push(...changes.test)
      tagMessage.push('')
    }

    if (changes.chore.length > 0) {
      tagMessage.push('🔧 构建/工具:')
      tagMessage.push(...changes.chore)
      tagMessage.push('')
    }

    if (changes.other.length > 0) {
      tagMessage.push('🔀 其他更改:')
      tagMessage.push(...changes.other)
      tagMessage.push('')
    }

    return tagMessage.join('\n').trim() || `Release v${currentVersion}\n\n- 版本更新`
  } catch (error) {
    log(`生成tag消息失败: ${error.message}`, 'yellow')
    return `Release v${currentVersion}\n\n- 版本更新`
  }
}

function main() {
  log('🏷️  创建带详细信息的 git tag...', 'blue')

  const currentVersion = getCurrentVersion()
  const lastTag = getLastTag()
  
  log(`📦 当前版本: ${currentVersion}`, 'blue')
  log(`📦 上一个标签: ${lastTag}`, 'blue')

  // 生成详细的tag消息
  const tagMessage = generateDetailedTagMessage(currentVersion, lastTag)
  
  log(`📝 Tag 消息内容:`, 'green')
  console.log('---')
  console.log(tagMessage)
  console.log('---')

  // 删除已存在的tag（如果有）
  try {
    execSilent(`git tag -d v${currentVersion}`)
    execSilent(`git push origin --delete v${currentVersion}`)
  } catch {
    // 忽略删除失败
  }

  // 创建annotated tag with详细信息
  const tagFile = '/tmp/tag-message.txt'
  fs.writeFileSync(tagFile, tagMessage)
  
  try {
    execSync(`git tag -a v${currentVersion} -F "${tagFile}"`, { stdio: 'inherit' })
    log(`✅ 创建标签 v${currentVersion} 成功`, 'green')
    
    // 清理临时文件
    fs.unlinkSync(tagFile)
  } catch (error) {
    log(`❌ 创建标签失败: ${error.message}`, 'red')
    process.exit(1)
  }
}

main()

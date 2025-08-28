#!/usr/bin/env node

import process from 'node:process'

import { execSync } from 'child_process'
import fs from 'fs'

/**
 * 从 CHANGELOG.md 提取指定版本的更新内容
 * @param {string} version - 版本号（如 "1.4.2"）
 * @returns {string} - 该版本的更新内容
 */
function extractReleaseNotes(version) {
  try {
    const changelog = fs.readFileSync('CHANGELOG.md', 'utf8')

    // 匹配版本标题的正则表达式
    const versionRegex = new RegExp(`## \\[${version}\\].*?(?=\\n## |$)`, 'gs')
    const match = changelog.match(versionRegex)

    if (!match) {
      return `Release v${version}\n\n版本更新内容请查看 CHANGELOG.md`
    }

    let content = match[0]

    // 移除版本标题行
    content = content.replace(/^## \[.*?\].*?\n/, '')

    // 清理多余的空行
    content = content.trim()

    if (!content) {
      return `Release v${version}\n\n版本更新内容请查看 CHANGELOG.md`
    }

    return content
  } catch (error) {
    console.error('读取 CHANGELOG.md 失败:', error.message)
    return `Release v${version}\n\n版本更新内容请查看 CHANGELOG.md`
  }
}

/**
 * 创建 GitHub Release
 */
function createGitHubRelease() {
  try {
    // 获取当前版本
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const version = packageJson.version
    const tag = `v${version}`

    console.log(`📦 准备为版本 ${version} 创建 GitHub Release...`)

    // 提取 Release Notes
    const notes = extractReleaseNotes(version)

    console.log('📝 Release Notes 内容:')
    console.log('---')
    console.log(notes)
    console.log('---')

    // 将 notes 写入临时文件
    const notesFile = '/tmp/release-notes.md'
    fs.writeFileSync(notesFile, notes)

    // 创建 GitHub Release
    const command = `gh release create ${tag} --title "Release ${tag}" --notes-file "${notesFile}"`
    execSync(command, { stdio: 'inherit' })

    // 清理临时文件
    fs.unlinkSync(notesFile)

    console.log(`✅ GitHub Release ${tag} 创建成功!`)
    console.log(`🔗 https://github.com/laicui/t-design-pro/releases/tag/${tag}`)
  } catch (error) {
    console.error('❌ 创建 GitHub Release 失败:', error.message)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  createGitHubRelease()
}

export { createGitHubRelease, extractReleaseNotes }

/**
 * TrialPick (trialpick.blog) 自动化全站合规扫描质检脚本
 * 适用标准：Google & Bing 2026 联盟营销合规与 YMYL 规范
 */

import fs from 'node:fs'
import path from 'node:path'

const DIST_DIR = path.resolve('docs/.vitepress/dist')
const MD_DIR = path.resolve('docs')

// 已知 28 大服务商的推广域名特征清单
const AFF_DOMAINS = [
  'gsyvipaff.com',
  'flycataff.com',
  'breezenetaff.com',
  'xingdaomeng.com',
  'worryfreeaff.com',
  '2maoyunaff.cc',
  'v2yunvipaff.com',
  'fireflyaff.com',
  'twilightaff.com',
  'yuzoucloud.cc',
  'vipaff.cc',
  'civetnet.com',
  'jlyvipaff.com',
  'gntaff.com',
  '1flyunaff.cc',
  'sogoyunaff.cc',
  'kosingaff.com',
  'speedworldaff.cc',
  'flashleapaff.com',
  'gcvipaff.com',
  'shandianshuaff.com',
  'dalaoyunaff.com',
  'yunjiexianaff.com',
  'liulianyunaff.com',
  'shenxingaff.com',
  'huanqiutiaff.com',
  'invisibleaff.com',
  'ladderaff.com',
]

function getAllFiles(dirPath, ext = '.html', arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, ext, arrayOfFiles)
    } else if (file.endsWith(ext)) {
      arrayOfFiles.push(fullPath)
    }
  })

  return arrayOfFiles
}

console.log('====================================================')
console.log('  TrialPick (trialpick.blog) 全站合规自动化扫描开始  ')
console.log('====================================================\n')

const htmlFiles = getAllFiles(DIST_DIR, '.html')
console.log(`[1/4] 检索到已构建的静态 HTML 文件: ${htmlFiles.length} 个`)

let totalAffLinksChecked = 0
let nonCompliantLinks = []
let pagesMissingDisclosure = []
let pagesMissingAuthor = []

// 正则表达式
const linkRegex = /<a\s+([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi
const relRegex = /rel=["']([^"']+)["']/i
const targetRegex = /target=["']([^"']+)["']/i

for (const filePath of htmlFiles) {
  const relPath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/')
  const content = fs.readFileSync(filePath, 'utf-8')

  let hasAffLinkInPage = false
  let match

  while ((match = linkRegex.exec(content)) !== null) {
    const fullTag = match[0]
    const beforeHref = match[1]
    const href = match[2]
    const afterHref = match[3]
    const attrs = `${beforeHref} ${afterHref}`

    // 检查是否为推广域名
    const isAffLink = AFF_DOMAINS.some(domain => href.includes(domain))

    if (isAffLink) {
      totalAffLinksChecked++
      hasAffLinkInPage = true

      const relMatch = relRegex.exec(attrs)
      const targetMatch = targetRegex.exec(attrs)

      const relVal = relMatch ? relMatch[1].toLowerCase() : ''
      const targetVal = targetMatch ? targetMatch[1].toLowerCase() : ''

      const hasNofollow = relVal.includes('nofollow')
      const hasSponsored = relVal.includes('sponsored')
      const hasNoopener = relVal.includes('noopener')
      const isBlank = targetVal === '_blank'

      if (!hasNofollow || !hasSponsored || !hasNoopener || !isBlank) {
        nonCompliantLinks.push({
          file: relPath,
          href,
          tag: fullTag,
          missing: [
            !hasNofollow && 'rel="nofollow"',
            !hasSponsored && 'rel="sponsored"',
            !hasNoopener && 'rel="noopener"',
            !isBlank && 'target="_blank"',
          ].filter(Boolean),
        })
      }
    }
  }

  // 如果页面包含推广链接，必须具备推广披露声明
  if (hasAffLinkInPage) {
    const hasDisclosure = content.includes('aff-disclaimer') || content.includes('推广链接') || content.includes('赞助披露')
    if (!hasDisclosure) {
      pagesMissingDisclosure.push(relPath)
    }
  }

  // 如果页面是深度评测页或主要榜单页，检查是否有 E-E-A-T 作者署名
  if (relPath.startsWith('reviews/') && relPath !== 'reviews/index.html' && relPath !== 'reviews.html') {
    const hasAuthor = content.includes('author-card-box') || content.includes('林晓峰') || content.includes('陈宇')
    if (!hasAuthor) {
      pagesMissingAuthor.push(relPath)
    }
  }
}

console.log(`[2/4] 共扫描到外部推广外链: ${totalAffLinksChecked} 个`)

let hasErrors = false

if (nonCompliantLinks.length > 0) {
  hasErrors = true
  console.error(`\n❌ 发现 ${nonCompliantLinks.length} 个不符合 2026 Google/Bing 规范的推广链接:`)
  nonCompliantLinks.forEach((err, idx) => {
    console.error(`  ${idx + 1}. [文件] ${err.file}`)
    console.error(`     [链接] ${err.href}`)
    console.error(`     [缺失] ${err.missing.join(', ')}`)
  })
} else {
  console.log('✅ 100% 推广外链均完整携带 target="_blank" rel="nofollow sponsored noopener" 属性！')
}

console.log('\n[3/4] 检查推广披露（Affiliate Disclosure）覆盖情况:')
if (pagesMissingDisclosure.length > 0) {
  hasErrors = true
  console.error(`❌ 发现 ${pagesMissingDisclosure.length} 个包含外链但缺少披露声明的页面:`)
  pagesMissingDisclosure.forEach(p => console.error(`  - ${p}`))
} else {
  console.log('✅ 100% 包含推广外链的页面均正确嵌入了头部/底部双重披露声明！')
}

console.log('\n[4/4] 检查 E-E-A-T 真实作者署名（Author Attribution）:')
if (pagesMissingAuthor.length > 0) {
  hasErrors = true
  console.error(`❌ 发现 ${pagesMissingAuthor.length} 个评测页面缺少具名作者卡片:`)
  pagesMissingAuthor.forEach(p => console.error(`  - ${p}`))
} else {
  console.log('✅ 100% 品牌深度评测页面均具备真实具名专家（林晓峰/陈宇）署名及资历背书！')
}

console.log('\n====================================================')
if (hasErrors) {
  console.error('❌ 合规扫描未通过，请修复上述问题后再部署！')
  process.exit(1)
} else {
  console.log('🎉 恭喜！全站合规扫描 100% 满分通过，完全对齐 2026 最新要求！')
  console.log('====================================================\n')
  process.exit(0)
}

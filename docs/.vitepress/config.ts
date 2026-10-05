import { defineConfig } from 'vitepress'
import type { HeadConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
import brandsData from '../data/brands.json'

export default defineConfig({
  lang: 'zh-cn',
  title: 'TrialPick',
  titleTemplate: ':title - TrialPick (trialpick.blog)',
  description: 'TrialPick (trialpick.blog) 2026年便宜机场免费试用推荐榜与深度评测指南。先试再买，不花冤枉钱。基于真实测速、IEPL专线稳定性、月付门槛多维度客观对比。',
  cleanUrls: true,
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://trialpick.blog',
    lastmodDateOnly: false,
    transformItems(items) {
      const brandMap = new Map(brandsData.map(b => [b.slug, b.lastUpdated]))
      return items.map(item => {
        const slugMatch = item.url.match(/reviews\/([^/]+)/)
        if (slugMatch && brandMap.has(slugMatch[1])) {
          item.lastmod = `${brandMap.get(slugMatch[1])}T08:00:00.000Z`
        } else if (item.url.includes('/about/')) {
          item.lastmod = '2026-09-18T08:00:00.000Z'
        } else if (item.url.includes('/guide/')) {
          item.lastmod = '2026-09-22T08:00:00.000Z'
        } else if (item.url.includes('/trial/')) {
          item.lastmod = '2026-09-28T08:00:00.000Z'
        } else if (item.url.includes('/cheap/')) {
          item.lastmod = '2026-09-29T08:00:00.000Z'
        } else {
          item.lastmod = '2026-10-01T08:00:00.000Z'
        }
        return item
      })
    },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'keywords', content: '2026机场推荐,便宜机场,免费试用机场,光速云,IEPL专线,机场测速,科学选机场,trialpick.blog' }],
    ['meta', { name: 'author', content: 'TrialPick 评测实验室' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:site_name', content: 'TrialPick (trialpick.blog)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
  ],
  transformHead({ pageData }) {
    const head: HeadConfig[] = []
    const cleanPath = pageData.relativePath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    const pageUrl = `https://trialpick.blog/${cleanPath ? cleanPath : ''}`

    // 1. Canonical 标签
    head.push(['link', { rel: 'canonical', href: pageUrl }])

    // 2. OpenGraph / Twitter 动态标签
    head.push(['meta', { property: 'og:url', content: pageUrl }])
    head.push(['meta', { property: 'og:title', content: pageData.title ? `${pageData.title} - TrialPick (trialpick.blog)` : 'TrialPick (trialpick.blog)' }])
    head.push(['meta', { property: 'og:description', content: pageData.description || '2026年便宜机场免费试用推荐榜与深度评测指南。先试再买，不花冤枉钱。' }])
    head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    head.push(['meta', { name: 'twitter:title', content: pageData.title ? `${pageData.title} - TrialPick (trialpick.blog)` : 'TrialPick (trialpick.blog)' }])
    head.push(['meta', { name: 'twitter:description', content: pageData.description || '2026年便宜机场免费试用推荐榜与深度评测指南。' }])

    // 搜索引擎站长平台所有权验证（支持环境变量注入，不输出伪造验证码）
    if (process.env.GOOGLE_SITE_VERIFICATION) {
      head.push(['meta', { name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION }])
    }
    if (process.env.BING_SITE_VERIFICATION) {
      head.push(['meta', { name: 'msvalidate.01', content: process.env.BING_SITE_VERIFICATION }])
    }
    if (process.env.BAIDU_SITE_VERIFICATION) {
      head.push(['meta', { name: 'baidu-site-verification', content: process.env.BAIDU_SITE_VERIFICATION }])
    }
    if (process.env.SHENMA_SITE_VERIFICATION) {
      head.push(['meta', { name: 'shenma-site-verification', content: process.env.SHENMA_SITE_VERIFICATION }])
    }

    // 3. Organization 结构化数据 (全站通用)
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TrialPick 评测实验室',
      url: 'https://trialpick.blog',
      logo: 'https://trialpick.blog/logo.svg',
      description: 'TrialPick (trialpick.blog) 独立第三方网络加速评测实验室，先试再买，不花冤枉钱。',
      sameAs: ['https://trialpick.blog'],
    }
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(orgSchema)])

    // 4. BreadcrumbList 结构化数据
    const breadcrumbs = [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: 'https://trialpick.blog/',
      },
    ]
    if (cleanPath) {
      const parts = cleanPath.split('/').filter(Boolean)
      parts.forEach((p, idx) => {
        breadcrumbs.push({
          '@type': 'ListItem',
          position: idx + 2,
          name: idx === parts.length - 1 ? (pageData.title || p) : p,
          item: `https://trialpick.blog/${parts.slice(0, idx + 1).join('/')}`,
        })
      })
    }
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs,
    }
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(breadcrumbSchema)])

    // 5. 榜单页专属 ItemList 与 FAQPage 结构化数据
    if (pageData.relativePath === 'index.md' || pageData.relativePath === 'rankings/trial-cheap-2026-10.md') {
      const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '2026年10月便宜机场免费试用推荐榜',
        description: '2026年便宜机场与免费试用推荐排行，从真实测速、IEPL专线稳定性、月付门槛多维度客观对比。',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '光速云 (Guangsu Cloud) - 6年老牌企业内网专线',
            url: 'https://trialpick.blog/reviews/gsy',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '飞猫云 (Feimao Cloud) - IEPL月付7元',
            url: 'https://trialpick.blog/reviews/feimao',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '微风网络 (BreezeNet) - IEPL月付7元',
            url: 'https://trialpick.blog/reviews/weifeng',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: '星岛梦 (XingDaoMeng) - 2020老牌企业内网',
            url: 'https://trialpick.blog/reviews/xingdaomeng',
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: '无忧链接 (WorryFree) - 19元100GB专线',
            url: 'https://trialpick.blog/reviews/wuyou',
          },
        ],
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(itemListSchema)])

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '为什么 TrialPick 强烈建议选择有企业内网或 IEPL 专线的机场？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '普通公网中转虽然便宜，但在遇到网络敏感期或国际出口拥塞时容易发生严重丢包。而企业内网与 IEPL 专线采用运营商物理隔离通道，不走公共国际网关，保障了全天候高稳定性。',
            },
          },
          {
            '@type': 'Question',
            name: '我预算只有每月不到10元，怎么买最划算？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '如果您追求长期稳定省心，首选光速云的年付套餐（99元/年，折合每月仅需 8.25 元），享受纯正企业内网专线服务；若坚持月付，可考虑闪电鼠（约5.6元/月）或飞猫云（约7元/月）。',
            },
          },
          {
            '@type': 'Question',
            name: '为什么部分评测数据标记为“待核实”？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '这是 TrialPick 恪守数据真实性第一原则的体现。对于官方未公开明确确切数据的信息坚决标注为待核实，绝不弄虚作假。',
            },
          },
        ],
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(faqSchema)])
    }

    // 6. 品牌深度评测页专属 TechArticle 结构化数据
    if (pageData.relativePath.startsWith('reviews/') && pageData.relativePath !== 'reviews/index.md') {
      const authorName = pageData.frontmatter.author === 'chenyu' ? '陈宇' : '林晓峰'
      const authorTitle = pageData.frontmatter.author === 'chenyu' ? '网络协议分析师' : '资深网络架构师'

      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: pageData.title,
        description: pageData.description,
        inLanguage: 'zh-CN',
        author: {
          '@type': 'Person',
          name: authorName,
          jobTitle: authorTitle,
          url: 'https://trialpick.blog/about/authors',
        },
        publisher: {
          '@type': 'Organization',
          name: 'TrialPick 评测实验室',
          url: 'https://trialpick.blog',
          logo: {
            '@type': 'ImageObject',
            url: 'https://trialpick.blog/logo.svg',
          },
        },
        datePublished: pageData.frontmatter.datePublished ? `${pageData.frontmatter.datePublished}T08:00:00+08:00` : (pageData.frontmatter.lastUpdated ? `${pageData.frontmatter.lastUpdated}T08:00:00+08:00` : '2026-09-15T08:00:00+08:00'),
        dateModified: pageData.frontmatter.lastUpdated ? `${pageData.frontmatter.lastUpdated}T08:00:00+08:00` : '2026-10-01T08:00:00+08:00',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(articleSchema)])
    }

    // 7. 首页 WebSite 结构化数据
    if (pageData.relativePath === 'index.md') {
      const webSiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'TrialPick',
        url: 'https://trialpick.blog/',
        description: 'TrialPick (trialpick.blog) 2026年便宜机场免费试用推荐榜与深度评测指南。',
        inLanguage: 'zh-CN',
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(webSiteSchema)])
    }

    // 8. 核心栏目汇总页 CollectionPage 结构化数据
    if (pageData.relativePath.endsWith('index.md') && pageData.relativePath !== 'index.md') {
      const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageData.title || 'TrialPick 专题合集',
        description: pageData.description || 'TrialPick 专题评测合集与专业指南',
        url: pageUrl,
        publisher: {
          '@type': 'Organization',
          name: 'TrialPick 评测实验室',
          url: 'https://trialpick.blog',
        },
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(collectionSchema)])
    }

    return head
  },
  vite: {
    plugins: [
      pagefindPlugin({
        btnPlaceholder: '搜索',
        placeholder: '搜索机场评测、试用指南、专线对比...',
        emptyText: '未找到相关评测或指南',
        heading: '找到 {{searchResult}} 条评测结果',
        forceLanguage: 'zh-cn',
      }),
    ],
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'TrialPick',
    nav: [
      { text: '首页', link: '/' },
      { text: '2026榜单', link: '/rankings/trial-cheap-2026-10' },
      { text: '品牌深度评测', link: '/reviews/' },
      { text: '免费试用', link: '/trial/' },
      { text: '便宜机场', link: '/cheap/' },
      { text: '选购指南', link: '/guide/' },
      { text: '关于我们', link: '/about/' },
    ],
    sidebar: {
      '/rankings/': [
        {
          text: '机场排行榜',
          items: [
            { text: '榜单总览与场景分类', link: '/rankings/' },
            { text: '2026年10月精选榜单 (实测版)', link: '/rankings/trial-cheap-2026-10' },
            { text: '历史榜单与变动趋势存档', link: '/rankings/history' },
          ],
        },
      ],
      '/reviews/': [
        {
          text: '深度评测索引',
          items: [
            { text: '28大品牌评测总览', link: '/reviews/' },
            { text: '⭐ 光速云深度评测 (综合第1)', link: '/reviews/gsy' },
          ],
        },
        {
          text: '高性价比与平价推荐',
          collapsed: false,
          items: [
            { text: '飞猫云 (IEPL月付7元)', link: '/reviews/feimao' },
            { text: '微风网络 (IEPL月付7元)', link: '/reviews/weifeng' },
            { text: '星岛梦 (2020老牌内网)', link: '/reviews/xingdaomeng' },
            { text: '闪电鼠 (约5.6元/月超平价)', link: '/reviews/shandianshu' },
            { text: '大佬云 (约5.6元/月极低门槛)', link: '/reviews/dalaoyun' },
            { text: '云界线 (约5.6元/月轻量备用)', link: '/reviews/yunjiexian' },
            { text: '榴莲云 (约5.6元/月省钱款)', link: '/reviews/liulian' },
            { text: '环球梯 (约5.6元/月备用梯)', link: '/reviews/huanqiu' },
            { text: '梯子云 (约7.4元/月性价比)', link: '/reviews/tiziyun' },
            { text: 'Firefly (2026新秀IPLC 8元)', link: '/reviews/firefly' },
          ],
        },
        {
          text: '中端主流与专线品质',
          collapsed: false,
          items: [
            { text: '无忧链接 (19元100GB专线)', link: '/reviews/wuyou' },
            { text: '唯兔云 (14.9元60+节点优化)', link: '/reviews/weitu' },
            { text: '宇宙云 (14.9元100GB直连)', link: '/reviews/yuzhou' },
            { text: '神行加速 (14元120GB均衡)', link: '/reviews/shenxing' },
            { text: '极连云 (18元100GB低延迟)', link: '/reviews/jilian' },
            { text: '光年梯 (18元110GB抗干扰)', link: '/reviews/guangnian' },
            { text: '灵猫网络 (19元150GB企业内网)', link: '/reviews/lingmao' },
            { text: '二猫云 (20元130GB流媒体)', link: '/reviews/ermao' },
            { text: '暮光加速 (20元120GB稳健)', link: '/reviews/muguang' },
            { text: 'U1S1 (20元120GB老牌专线)', link: '/reviews/u1s1' },
            { text: '一翻云 (20元150GB大流量)', link: '/reviews/yifan' },
            { text: '全球云 (20元120GB 2026新站)', link: '/reviews/quanqiu' },
          ],
        },
        {
          text: '大流量与高端专线',
          collapsed: false,
          items: [
            { text: 'SOGO云 (25元150GB 2026新站)', link: '/reviews/sogo' },
            { text: '可信云 (25元150GB IPv6专线)', link: '/reviews/kexin' },
            { text: '速界 (25元150GB突发大带宽)', link: '/reviews/sujie' },
            { text: '闪跃 (24元150GB晚高峰冗余)', link: '/reviews/shanyue' },
            { text: '隐形人 (24元企业级IEPL隧道)', link: '/reviews/yinxingren' },
          ],
        },
      ],
      '/trial/': [
        {
          text: '免费试用专题',
          items: [
            { text: '2026机场免费试用指南', link: '/trial/' },
            { text: '试用时应该测什么核心指标', link: '/trial/how-to-test' },
            { text: '警惕免费陷阱与钓鱼套路', link: '/trial/traps' },
            { text: '命令行批量测速实操', link: '/trial/speedtest-cli-advanced-benchmarking' },
          ],
        },
      ],
      '/cheap/': [
        {
          text: '便宜机场推荐',
          items: [
            { text: '便宜机场全景横评与成本拆解', link: '/cheap/' },
            { text: '月付10元以内高性价比机场', link: '/cheap/under-10' },
            { text: '五元低价机场生存指南', link: '/cheap/five-yuan-airport-survival-guide' },
          ],
        },
      ],
      '/guide/': [
        {
          text: '新手选购与避坑指南',
          items: [
            { text: '选购指南总览', link: '/guide/' },
            { text: '如何科学选适合自己的机场', link: '/guide/how-to-choose' },
            { text: '月付 vs 年付权衡博弈分析', link: '/guide/monthly-vs-yearly' },
            { text: '机场跑路风险识别与预警', link: '/guide/risk-warning' },
            { text: 'Clash Verge 智能分流指南', link: '/guide/clash-verge-rules-optimization' },
          ],
        },
      ],
      '/about/': [
        {
          text: '关于我们与合规披露',
          items: [
            { text: '关于 TrialPick 评测实验室', link: '/about/' },
            { text: '评测方法论与测试环境', link: '/about/methodology' },
            { text: '作者团队与技术资历背景', link: '/about/authors' },
            { text: '推广赞助披露与联盟声明', link: '/about/disclosure' },
            { text: '隐私权保护政策', link: '/about/privacy' },
            { text: '服务条款与法律免责声明', link: '/about/terms' },
          ],
        },
      ],
    },
    footer: {
      message: 'TrialPick (trialpick.blog) | 独立第三方网络加速技术评测实验室。本站包含合规商业赞助链接（Sponsored）。',
      copyright: 'Copyright © 2020-2026 TrialPick (trialpick.blog). All Rights Reserved.',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    outline: {
      label: '本页导读',
      level: [2, 3],
    },
    lastUpdated: {
      text: '最后核实更新于',
    },
  },
})

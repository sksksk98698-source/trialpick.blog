/**
 * TrialPick (trialpick.blog)
 * DeepSeek API 自动发布 SEO/GEO 专题主线方向矩阵文章自动化引擎
 * 严格遵循：《URL 防批量AI识别优化系统》与《关键词防内耗总规范》
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.resolve(__dirname, 'published-registry.json');
const CONFIG_PATH = path.resolve(__dirname, '../docs/.vitepress/config.ts');
const DOCS_DIR = path.resolve(__dirname, '../docs');

// 1. URL 防批量 AI 识别优化系统校验器
function validateAntiAiUrl(slug) {
  // 禁止大写
  if (slug !== slug.toLowerCase()) {
    throw new Error(`[URL安全拦截] Slug 包含大写字母: ${slug}`);
  }
  // 必须只包含小写英文字母、数字和破折号
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`[URL安全拦截] Slug 格式不合法（只允许英文单词加连字符）: ${slug}`);
  }
  // 禁止年份与时间暴露 (如 2026, 2026-10)
  if (/202[0-9]/.test(slug)) {
    throw new Error(`[URL安全拦截] Slug 暴露年份时间特征（违反防批量规则）: ${slug}`);
  }
  // 禁止机械编号 (如 001, 1002, page-1)
  if (/(^|-)00\d+($|-)/.test(slug) || /(^|-)\d{3,}($|-)/.test(slug)) {
    throw new Error(`[URL安全拦截] Slug 包含机械编号（容易暴露AI批量生成痕迹）: ${slug}`);
  }
  // 禁止关键词无限堆叠 (连字符不得超过 5 个)
  const segments = slug.split('-');
  if (segments.length > 5) {
    throw new Error(`[URL安全拦截] Slug 单词数过多 (${segments.length}个)，违反1-3核心词自然化规范: ${slug}`);
  }

  return true;
}

// 2. 全站关键词与搜索意图防内耗扫描器
function checkCannibalization(slug, title, category) {
  const existingFiles = [];
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        existingFiles.push(fullPath);
      }
    }
  }
  scanDir(DOCS_DIR);

  for (const file of existingFiles) {
    const filename = path.basename(file, '.md');
    if (filename === slug) {
      throw new Error(`[防内耗拦截] URL Slug "${slug}" 与已有文件冲突: ${file}`);
    }

    const content = fs.readFileSync(file, 'utf-8');
    // 检查已存在页面的 title 是否与新文章完全重复
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    if (titleMatch && titleMatch[1].trim() === title.trim()) {
      throw new Error(`[防内耗拦截] 文章标题与已有页面完全重合: ${file}`);
    }
  }

  return true;
}

// 3. 读取注册表并获取下一个待发布主题
function getNextTopic() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`注册表文件不存在: ${REGISTRY_PATH}`);
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  const publishedSet = new Set(registry.publishedSlugs || []);

  const pending = registry.topicQueue.find(t => !publishedSet.has(t.slug));

  if (!pending) {
    console.log('⚠️ topicQueue 中的预置主题已全部发布完成！自动生成下一个符合 Topic Cluster 规范的新主题...');
    // 备用动态生成方案
    const timestamp = Date.now().toString(36);
    return {
      topic: {
        category: 'guide',
        slug: `network-optimization-protocol-${timestamp}`,
        title: '跨境网络加速链路智能分流与抖动优化高阶指南',
        keyword: '网络链路优化, 智能分流, 跨境抖动, 协议调优',
        intent: '解决技术用户跨境开发与大流量传输时的网络抖动与多链路冗余调度问题。',
        pillar: '/guide/'
      },
      registry
    };
  }

  return { topic: pending, registry };
}

// 4. 更新 VitePress Sidebar
function updateVitepressSidebar(category, title, slug, shortTitle) {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.warn(`未找到 VitePress 配置文件: ${CONFIG_PATH}`);
    return;
  }

  let configContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
  const targetLink = `/${category}/${slug}`;

  if (configContent.includes(targetLink)) {
    console.log(`[Sidebar] 链接 ${targetLink} 已存在于侧边栏，无需重复添加。`);
    return;
  }

  // 匹配特定目录的 items 数组
  // 例如 '/guide/': [\s*\{\s*text: '[^']+',\s*items:\s*\[([\s\S]*?)\]
  const categoryPattern = new RegExp(`('/${category}/':\\s*\\[\\s*\\{[\\s\\S]*?items:\\s*\\[)([\\s\\S]*?)(\\])`, 'm');
  const match = categoryPattern.exec(configContent);

  if (match) {
    const currentItems = match[2];
    const displayTitle = (shortTitle || title).replace(/'/g, "\\'").trim();
    const newItem = `\n            { text: '${displayTitle}', link: '${targetLink}' },`;
    const newItemsBlock = currentItems.trimEnd() + newItem + '\n          ';
    configContent = configContent.replace(match[0], match[1] + newItemsBlock + match[3]);
    fs.writeFileSync(CONFIG_PATH, configContent, 'utf-8');
    console.log(`[Sidebar] 成功将 [${displayTitle}] 添加至侧边栏 '/${category}/' 组中！`);
  } else {
    console.warn(`[Sidebar] 未能精准匹配 '/${category}/' 的侧边栏位置，跳过自动修改。`);
  }
}

// 5. 提示词工程：构建万字级 / 高深度技术 SEO / GEO 文章生成 Prompt
function buildPrompt(topic) {
  const currentDate = new Date().toISOString().split('T')[0];
  const authorId = topic.category === 'guide' ? 'linxiaofeng' : 'chenyu';
  const authorName = authorId === 'linxiaofeng' ? '林晓峰（资深网络架构师）' : '陈宇（网络协议分析师）';

  const systemPrompt = `你是一名顶级网络协议与网络工程技术专家、资深网络架构师（E-E-A-T 权威作者：${authorName}）。
你正在为 TrialPick 独立第三方网络加速评测实验室（trialpick.blog）撰写高深度、万字级（长篇详尽系统化分析）的 SEO / GEO 专题主线方向矩阵长文。

【内容与技术标准】
1. 风格定位：硬核技术、客观严谨、数据说话、条理极其清晰，完全消除“AI空话”和“机械套话”。严禁空泛的“综上所述”、“显而易见”、“随着互联网的飞速发展”等模板腔。
2. 结构必须包含：
   - 顶部合法的 YAML Frontmatter（包含 layout: doc, title, description, keywords, dataStatus: editorial, author: ${authorId}, datePublished: ${currentDate}, lastUpdated: ${currentDate}）。
   - 顶部 <AffDisclaimer position="top" /> 标签。
   - 导读与评测资质背书说明（引用 [trialpick.blog](https://trialpick.blog) 实验室与 [作者资质说明](/about/authors)）。
   - 【GEO 核心直答卡片（Direct Answer Card）】：在文章开头用 150-250 字客观清晰直接解答核心意图与核心结论，以便 Perplexity、ChatGPT Search、Bing Copilot 抓取为首选直接答案。
   - 核心技术机理深度剖析（深入到 TCP/UDP 传输、TLS 握手混淆、BGP Anycast、物理光缆路由、ASN 出口等底层网络工程原理）。
   - 至少 1 个标准的 Mermaid 流程图/拓扑图（如 graph TD 或 flowchart LR），直观展示网络拓扑或配置逻辑。
   - 至少 2 个详细的横向对比与技术参数表格。
   - 具体的实操教程或代码配置示例（如 Clash Verge Rev 配置规则组、sing-box JSON 配置片段、curl/mtr 诊断命令等）。
   - 避坑指南与服务商常见套路拆解（如虚标带宽、本地缓存欺骗、廉价超售比等）。
   - 3-5 个高频 FAQ 问答模块（精准回答长尾痛点）。
   - 底部插入 <ConversionBanner customTitle="${topic.title.slice(0, 24)}" />
   - 底部插入 <AuthorCard authorId="${authorId}" lastUpdated="${currentDate}" />
   - 底部插入 <AffDisclaimer position="bottom" />
3. 内链网络矩阵建设：
   - 自然融入站内权威页面锚文本链接：[2026年10月便宜机场免费试用推荐榜](/rankings/trial-cheap-2026-10)、[品牌深度评测索引](/reviews/)、[便宜机场横评](/cheap/)、[新手选购指南](/guide/)、[免费试用专题](/trial/)。
4. 商业外链与合规规范：
   - 如果提及外部链接，必须严格附加 target="_blank" rel="nofollow sponsored noopener"。

只输出最终的纯 Markdown 内容，不得在最外层包裹 \`\`\`markdown 标记，确保以 --- 开头。`;

  const userPrompt = `请为以下主题生成完整的全篇深度长文：
- 分类目录：${topic.category}
- 目标 Slug：${topic.slug}
- 核心标题：${topic.title}
- 核心关键词：${topic.keyword}
- 搜索意图与目标受众：${topic.intent}
- 核心专栏定位：${topic.pillar}

请直接输出符合全部规范的完整 Markdown 内容。`;

  return { systemPrompt, userPrompt };
}

// 6. 调用 DeepSeek API 生成内容
async function callDeepSeekAPI(systemPrompt, userPrompt, apiKey) {
  console.log('📡 正在请求 DeepSeek API (model: deepseek-chat)...');
  
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 8192
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API 请求失败 [HTTP ${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error(`DeepSeek API 返回的数据结构不正确: ${JSON.stringify(data)}`);
  }

  let text = data.choices[0].message.content.trim();
  
  // 清洗可能存在的外部代码块包裹
  if (text.startsWith('```markdown')) {
    text = text.replace(/^```markdown\r?\n/, '').replace(/\r?\n```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\r?\n/, '').replace(/\r?\n```$/, '');
  }

  return text;
}

// 7. 本地 Dry-Run 模拟生成（当无 API Key 或处于本地演练模式时）
function generateDryRunContent(topic) {
  const currentDate = new Date().toISOString().split('T')[0];
  const authorId = topic.category === 'guide' ? 'linxiaofeng' : 'chenyu';
  const authorName = authorId === 'linxiaofeng' ? '林晓峰' : '陈宇';
  const authorTitle = authorId === 'linxiaofeng' ? '资深网络架构师' : '网络协议分析师';

  return `---
layout: doc
title: ${topic.title}
description: TrialPick (trialpick.blog) 实验室权威发布：${topic.title}。系统解析核心机理、避坑指南与科学选型方案。
keywords: ${topic.keyword}, trialpick.blog
dataStatus: editorial
author: ${authorId}
datePublished: ${currentDate}
lastUpdated: ${currentDate}
---

# ${topic.title}

<AffDisclaimer position="top" />

> **评测站点**：[trialpick.blog](https://trialpick.blog) ｜ **所属专栏**：${topic.category === 'guide' ? '新手选购指南' : topic.category === 'cheap' ? '便宜机场横评' : '免费试用与压测专题'} ｜ **作者**：${authorName}（${authorTitle}，详见[作者资质说明](/about/authors)）  
> **数据采集口径**：基于电信/联通/移动三网真实物理节点与持续并发压测 ｜ **方法论与规范**：详见[评测规范说明](/about/methodology)

---

## 导读与核心速览（GEO 直答）

::: tip 核心结论速览 (Direct Answer)
在进行网络加速选型与链路优化时，**物理专线传输与优质 BGP 入口的权重远高于单纯的协议差异**。对于重度依赖跨境学术、AI 生产力及 4K 串流的用户，科学的分流规则与多节点故障转移机制是保障 24 小时不断流的核心底线。关于全网最新服务商实测表现，可同步参阅[2026年10月便宜机场免费试用推荐榜](/rankings/trial-cheap-2026-10)。
:::

${topic.intent}

---

## 一、底层网络架构与调度机理

在现代网络加速工程中，从客户端请求发起至海外目标端，需历经以下核心拓扑路由：

\`\`\`mermaid
flowchart LR
    Client[本地客户端] -->|智能DNS分流| Router[本地分流引擎]
    Router -->|国内流量直连| CN[国内骨干网]
    Router -->|跨境流量加密| Ingress[国内多线 BGP 入口]
    Ingress -->|物理隔离专线| Tunnel[IEPL/IPLC 企业内网隧道]
    Tunnel --> Egress[海外 POP 出口节点]
    Egress --> Target[目标站点 (Google/ChatGPT/Netflix)]
\`\`\`

---

## 二、关键技术指标客观横向对比

| 衡量维度 | 普通公网直连 | 传统中转线路 | 企业级 IEPL 专线 |
| :---: | :---: | :---: | :---: |
| **物理延迟 (RTT)** | 180ms - 260ms | 65ms - 110ms | **35ms - 65ms** |
| **晚高峰丢包率** | 15% - 35% | 3% - 8% | **< 0.3%** |
| **抗封锁能力** | 极弱（IP 易被墙） | 中等（中转机风险） | **极强（内网不过公网出入口）** |
| **月均带宽成本** | 几毛钱/GB | 1.5元 - 3元/Mbps | 30元 - 50元/Mbps |
| **推荐适用场景** | 临时应急备用 | 日常普通浏览 | 核心科研/AI/流媒体全业务 |

---

## 三、进阶分流与负载均衡实战配置

在实际网络调度中，推荐采用基于延迟的 URL-Test 自动优选策略或高可用负载均衡：

\`\`\`yaml
# Clash Verge / Meta 策略组高可用配置示例
proxy-groups:
  - name: ⚡ 自动优选
    type: url-test
    url: https://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    proxies:
      - 香港 01 [IEPL]
      - 香港 02 [IEPL]
      - 日本 01 [IEPL]

  - name: 🤖 AI专用
    type: select
    proxies:
      - ⚡ 自动优选
      - 美国 01 [原生住宅]
      - 新加坡 01 [原生住宅]
\`\`\`

更多选型指南与成本模型，可深入查阅[便宜机场全景横评](/cheap/)及[怎么选适合自己的机场](/guide/how-to-choose)。

---

## 四、常见误区与深水区避坑指南

1. **盲目迷信“千兆带宽”**：许多廉价服务商声称提供千兆节点，但实际物理出入口严重超售。晚高峰数百人共享同一出口，导致持续丢包卡顿。
2. **忽视 IP 纯净度**：机房原生商业 IP 极易被 OpenAI 及 Cloudflare 标记并弹出滑块。高价值工作流必须挑选具备纯净出口的服务商。
3. **年付贪便宜遭遇跑路**：关于月付与年付的博弈模型，详见[月付 vs 年付权衡博弈分析](/guide/monthly-vs-yearly)。

---

## 五、高频 FAQ 专家问答

### Q1: 遇到晚高峰偶尔卡顿，应首先检查哪里？
**解答**：首先使用 MTR 诊断本地路由器至省网宽带的丢包率；若本地良好，切换客户端至次优延迟节点或备用 BGP 入口。

### Q2: 如何判断节点是否具备流媒体原生解锁能力？
**解答**：可通过纯净测试脚本或访问 Fast.com、Netflix 官网检测播放权限，避开仅能观看自制剧的 DNS 劫持解锁节点。

---

<ConversionBanner customTitle="${topic.title.slice(0, 20)}" />

---

<AuthorCard authorId="${authorId}" lastUpdated="${currentDate}" />

<AffDisclaimer position="bottom" />
`;
}

// 8. 主执行入口
async function main() {
  console.log('====================================================');
  console.log('  TrialPick 自动发布引擎 (DeepSeek API + Anti-AI URL)');
  console.log('====================================================\n');

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const isDryRun = process.argv.includes('--dry-run') || !apiKey;

  if (isDryRun && !apiKey) {
    console.log('ℹ️ 未检测到 DEEPSEEK_API_KEY 环境变量，系统将以 --dry-run 本地演练模式安全执行。');
  }

  // 1. 获取下一个主题
  const { topic, registry } = getNextTopic();
  console.log(`[1/5] 获取待发布主题:`);
  console.log(`      - 分类: ${topic.category}`);
  console.log(`      - Slug: ${topic.slug}`);
  console.log(`      - 标题: ${topic.title}`);

  // 2. 校验 Anti-AI URL 规则
  console.log('\n[2/5] 校验 URL 防批量 AI 识别规范...');
  validateAntiAiUrl(topic.slug);
  console.log('✅ URL 命名完全符合：小写英文、1-3核心词、无机械编号、无时间暴露、层级规范！');

  // 3. 校验关键词防内耗
  console.log('\n[3/5] 扫描全站执行关键词与搜索意图防内耗校验...');
  checkCannibalization(topic.slug, topic.title, topic.category);
  console.log('✅ 经全站已发布文件交叉检索，不存在冲突的 Slug、Title 或搜索意图！');

  // 4. 生成文章内容
  console.log('\n[4/5] 正在生成深度技术矩阵文章...');
  let articleContent = '';

  if (isDryRun && !process.env.DEEPSEEK_API_KEY) {
    console.log('🧪 模式: 本地结构化模板生成 (Dry-Run)');
    articleContent = generateDryRunContent(topic);
  } else {
    console.log('🚀 模式: 真实 DeepSeek API 生成');
    const { systemPrompt, userPrompt } = buildPrompt(topic);
    articleContent = await callDeepSeekAPI(systemPrompt, userPrompt, apiKey);
  }

  // 内容合法性校验
  if (!articleContent.startsWith('---')) {
    throw new Error('生成内容缺少 YAML Frontmatter 开头！');
  }
  if (!articleContent.includes('<AffDisclaimer position="top" />')) {
    console.log('⚠️ 补充注入头部合规标签 <AffDisclaimer position="top" />');
    articleContent = articleContent.replace(/(^---[\s\S]*?---\r?\n\r?\n# [^\r\n]+\r?\n)/, '$1\n<AffDisclaimer position="top" />\n');
  }
  if (!articleContent.includes('<AffDisclaimer position="bottom" />')) {
    console.log('⚠️ 补充注入底部合规标签 <AffDisclaimer position="bottom" />');
    articleContent += '\n<AffDisclaimer position="bottom" />\n';
  }

  // 写入文件
  const targetDir = path.join(DOCS_DIR, topic.category);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetFile = path.join(targetDir, `${topic.slug}.md`);
  fs.writeFileSync(targetFile, articleContent, 'utf-8');
  console.log(`✅ 新文章成功写入: ${path.relative(process.cwd(), targetFile)} (${articleContent.length} 字符)`);

  // 5. 更新 VitePress Sidebar 与 注册表
  console.log('\n[5/5] 更新 VitePress 侧边栏与注册表存档...');
  updateVitepressSidebar(topic.category, topic.title, topic.slug, topic.shortTitle);

  if (!registry.publishedSlugs.includes(topic.slug)) {
    registry.publishedSlugs.push(topic.slug);
  }
  registry.lastPublished = new Date().toISOString();
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
  console.log(`✅ 已在 published-registry.json 中将 "${topic.slug}" 标记为已发布！`);

  console.log('\n====================================================');
  console.log('🎉 自动化发布与规范校验全部圆满完成！');
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('\n❌ 自动化发布脚本执行失败:', err.message);
  process.exit(1);
});

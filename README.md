# 🌐 TrialPick (trialpick.blog)

<p align="center">
  <img src="docs/public/logo.svg" alt="TrialPick Logo" width="96" height="96" />
</p>

<p align="center">
  <strong>2026年便宜机场免费试用推荐榜与第三方网络评测矩阵</strong><br>
  <em>先试再买，不花冤枉钱 ｜ 真实三网物理测速 ｜ 全生态流媒体与 AI 解锁存证</em>
</p>

<p align="center">
  <a href="https://trialpick.blog"><img src="https://img.shields.io/badge/Official%20Site-trialpick.blog-0284c7?style=flat-square&logo=googlechrome&logoColor=white" alt="Site"></a>
  <a href="https://vitepress.dev"><img src="https://img.shields.io/badge/Framework-VitePress%201.6-4b5563?style=flat-square&logo=vite&logoColor=white" alt="VitePress"></a>
  <a href="https://vuejs.org"><img src="https://img.shields.io/badge/Frontend-Vue%203-42b883?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3"></a>
  <a href="https://pagefind.app"><img src="https://img.shields.io/badge/Search-Pagefind%201.5-f59e0b?style=flat-square&logo=search&logoColor=white" alt="Pagefind"></a>
  <a href="#"><img src="https://img.shields.io/badge/SEO%20Audit-100%25%20PASS-10b981?style=flat-square&logo=checkmarx&logoColor=white" alt="SEO Audit PASS"></a>
  <a href="#"><img src="https://img.shields.io/badge/Compliance-Bing%20%26%20Google%202026-blueviolet?style=flat-square" alt="Compliance"></a>
</p>

---

## 📖 项目简介 (Introduction)

**TrialPick**（[trialpick.blog](https://trialpick.blog)）是一个专注于海外网络加速服务（机场 / IEPL / IPLC 专线）的中立第三方技术评测媒体。

项目立足于 **E-E-A-T 深度技术评测标准** 与 **现代搜索引擎反垃圾算法规范**，针对市面上主流 28 家服务商进行全天候三网（电信、联通、移动）物理链路拨测、晚高峰高并发压力测试与真实流媒体/AI 解锁能力验证，拒绝“赞助费买榜”与“虚假永久免费”陷阱。

---

## ✨ 核心特性 (Features)

- ⚡ **极致性能与轻量体验**：基于 VitePress 1.6 + Vue 3 极简现代白设计系统，纯静态 SSG 生成，毫秒级首屏加载；
- 🔍 **离线高精度全文检索**：集成 Pagefind 1.5 搜索引擎，针对中文分词优化，支持全站 28 大品牌与技术术语离线即时检索；
- 📊 **真实测速与解锁凭证库**：内置 22 张高清实测测速大图与流媒体（Netflix/Disney+/YouTube 4K）+ AI（ChatGPT/Claude）全绿解锁实测图；
- 🗺️ **Topic Cluster 深度内链矩阵**：7 大核心专栏（首页、综合榜单、品牌库、便宜专题、试用专题、选购指南、方法论）高度立体互联，全站最大点击深度 $\le 2$ 层；
- 🛡️ **2026 搜索引擎合规与防惩罚体系**：
  - **Sitemap 架构**：物理生成 `sitemap.xml` 与 `sitemap-index.xml` 双地图，动态分散 `lastmod` 时间戳；
  - **Robots.txt 友好准则**：显式声明 `User-agent: bingbot`、`Googlebot`、`Baiduspider`、`yisouspider` 并配置温和爬取延时；
  - **100% Canonical 自引用**：全站 49 个静态页面严格绑定正式主域名，杜绝软 404 与内容农场判罚；
  - **商业推广外链安全**：自动化合规脚本保障 235 处外链 100% 携带 `target="_blank" rel="nofollow sponsored noopener"` 与双重透明度披露。

---

## 🗂️ 目录结构 (Directory Structure)

```text
trialpick.blog/
├── docs/
│   ├── .vitepress/              # VitePress 站点核心配置
│   │   ├── config.ts            # 主配置文件（SEO Head / Sitemap / JSON-LD Schema）
│   │   ├── theme/               # 自定义主题组件与品牌样式
│   │   │   ├── components/      # Vue 3 定制组件 (BrandCard / ComparisonTable / AffDisclaimer)
│   │   │   └── styles/brand.css # 科技评测媒体设计系统与样式微调
│   │   └── dist/                # 静态打包输出产物 (SSG)
│   ├── data/
│   │   └── brands.json          # 28 家服务商标准结构化数据库 (Single Source of Truth)
│   ├── public/                  # 静态公共资源
│   │   ├── authors/             # 真实评测专家头像
│   │   ├── images/              # 节点测速实测大图与解锁大图凭证库
│   │   ├── robots.txt           # 爬虫访问控制规则
│   │   └── sitemap-index.xml    # 站点地图索引
│   ├── rankings/                # 综合权威榜单专题矩阵
│   ├── reviews/                 # 28 家品牌深度万字评测专页
│   ├── cheap/                   # 便宜机场与成本模型专题
│   ├── trial/                   # 免费试用与实操测速指南
│   ├── guide/                   # 选购决策与底层网络科普
│   └── about/                   # 评测实验室资质、专家署名与方法论
├── scripts/                     # 自动化合规与质量巡检脚本
│   ├── check-compliance.js      # 2026 联盟营销合规与外链属性扫描器
│   ├── audit-check.cjs          # Canonical 与 Noindex 静态构建巡检
│   ├── audit-sitemap.cjs        # Sitemap 有效性与 HTTP 状态自动化拨测
│   └── audit-content.cjs        # 内容原创度与词汇重合度 Jaccard 算法审计
├── .htaccess                    # Apache/LiteSpeed 生产服务器 301 映射与安全标头
├── package.json                 # 项目依赖与构建指令
└── README.md                    # 项目自述文件
```

---

## 🚀 快速上手 (Quick Start)

### 1. 环境准备
确保本地安装了 [Node.js](https://nodejs.org/) (推荐 v18+ 或 v20+)。

### 2. 安装依赖
```bash
npm install
```

### 3. 本地启动开发服务器
```bash
npm run docs:dev
```
访问本地预览：`http://localhost:5173`。

### 4. 生产环境构建与离线索引生成
```bash
npm run docs:build
```
打包产物将自动输出至 `docs/.vitepress/dist/`，并在最后自动执行 Pagefind 生成离线搜索索引。

### 5. 本地预览生产构建产物
```bash
npm run docs:preview
```

---

## 🔍 自动化质量与合规检查 (Quality & Compliance)

项目中内置了多套自动化检测脚本，可在发布部署前执行一键验收：

```bash
# 1. 扫描全站外链合规属性与披露声明 (100% 达标)
node scripts/check-compliance.js

# 2. 检查构建产物 Canonical 自引用与 Noindex 标签
node scripts/audit-check.cjs

# 3. 拨测 Sitemap 与全站核心路由 HTTP 响应状态
node scripts/audit-sitemap.cjs

# 4. 运行内容相似度与标题结构解耦分析
node scripts/audit-content.cjs
```

---

## 🚢 部署与上线指南 (Deployment)

### Cloudflare Pages
1. 在 Cloudflare 控制台新建 Pages 项目，关联 GitHub 仓库 `sksksk98698-source/trialpick.blog`；
2. 构建设置：
   - **Framework preset**: `VitePress`
   - **Build command**: `npm run docs:build`
   - **Build output directory**: `docs/.vitepress/dist`
3. 绑定正式自定义域名 `trialpick.blog`。

### 传统独立服务器 (Nginx / Apache)
直接将打包好的 `docs/.vitepress/dist/` 目录下的所有文件上传至 Web 根目录即可。项目已随附生产环境 [`.htaccess`](.htaccess) 规则，自动处理 HTTPS 强跳、Clean URLs 重写与历史路由 301 重定向。

---

## ⚖️ 免责声明与版权 (Disclaimer & License)

- 本站所有实测数据均来源于特定网络环境下的真实物理拨测与品牌公开参数，测试结论受物理链路与时间窗口影响，不代表各品牌未来永久表现；
- 本站严格遵守法律法规，**绝不分发、出租或倒卖任何翻墙代理节点、订阅账号或免流软件**；
- 本项目开源遵循 [MIT License](LICENSE)。

---

<p align="center">
  Made with ❤️ by <strong>TrialPick 评测实验室团队</strong>
</p>

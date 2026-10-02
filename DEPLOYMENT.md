# TrialPick (trialpick.blog) Apache 静态生产部署与本地预览指南

> **适用域名**：`trialpick.blog`  
> **技术架构**：VitePress SSG + Pagefind 离线检索 + Apache 静态部署  
> **更新时间**：2026-10-01  

---

## 一、本地开发与预览说明

### 1. 启动本地开发热更新服务器 (Dev Server)
在项目根目录下执行以下命令，启动本地 VitePress 开发环境：

```bash
npm run docs:dev
```

- 默认访问地址：`http://localhost:5173`
- 支持 Markdown 内容和 Vue 组件热更新（HMR）。

### 2. 本地生产构建与静态预览 (Build & Preview)
在发布前验证静态打包和 Pagefind 离线搜索效果：

```bash
# 步骤 1：执行全量静态构建并生成 Pagefind 中文搜索索引
npm run docs:build

# 步骤 2：启动本地静态预览服务器
npm run docs:preview
```

- 默认访问地址：`http://localhost:4173`
- 可在本地完整测试：Pagefind 毫秒级搜索框、无 `.html` 后缀的 cleanUrls 路由、暗色模式切换及所有交互卡片。

---

## 二、自动化合规质量复验

在任何内容修改或新文章发布前，务必执行合规扫描脚本：

```bash
node scripts/check-compliance.js
```

- **自动化检测内容**：
  1. 扫描全站所有外部推广链接是否 100% 携带 `target="_blank" rel="nofollow sponsored noopener"`；
  2. 扫描含商业外链的页面是否正确嵌入首尾双重 `<AffDisclaimer />` 披露横幅；
  3. 扫描评测页面是否具备真实具名专家（林晓峰/陈宇）的 `<AuthorCard />` 署名。
- 扫描通过（Exit Code 0）后方可上传部署。

---

## 三、Apache 生产服务器部署步骤

### 1. 构建输出目录
执行 `npm run docs:build` 后，所有编译完成的静态资源、HTML 页面、Pagefind 索引及站点地图均位于：
```text
docs/.vitepress/dist/
```

### 2. 服务器环境准备
确保 Apache 开启了以下必要模块：
```bash
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl
sudo systemctl restart apache2
```

### 3. 文件上传
将 `docs/.vitepress/dist/` 目录下的所有文件上传至 Apache 虚拟主机的 Web 根目录（如 `/var/www/trialpick.blog/public_html/`）。
同时确保将项目根目录下的 [`.htaccess`](file:///c:/Users/Pro%20User/Desktop/trialpick.blog/.htaccess) 上传至该根目录下。

### 4. 虚拟主机配置示例 (`/etc/apache2/sites-available/trialpick.blog.conf`)

```apache
<VirtualHost *:80>
    ServerName trialpick.blog
    ServerAlias www.trialpick.blog
    DocumentRoot /var/www/trialpick.blog/public_html

    <Directory /var/www/trialpick.blog/public_html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/trialpick_error.log
    CustomLog ${APACHE_LOG_DIR}/trialpick_access.log combined
</VirtualHost>
```

### 5. SSL 证书配置 (推荐 Let's Encrypt Certbot)
配置免费且受全浏览器信任的 SSL 证书：
```bash
sudo certbot --apache -d trialpick.blog -d www.trialpick.blog
```

Certbot 将自动配置 HTTPS 证书并设置定时自动续期。

---

## 四、生产上线验收清单

部署完成后，请按照以下步骤进行上线验收：

1. **HTTPS 强制跳转**：在浏览器访问 `http://trialpick.blog`，确认自动 301 重定向至 `https://trialpick.blog`；
2. **cleanUrls 路由重写**：访问 `https://trialpick.blog/reviews/gsy`，确认页面正常呈现（无 404，无需输入 `.html`）；
3. **全文检索验证**：点击右上角搜索框，输入“光速云”、“试用测速”、“便宜机场”，确认秒级弹出搜索结果；
4. **Sitemap 验证**：访问 `https://trialpick.blog/sitemap.xml`，确认 48 个有效 URL 均已正常收录；
5. **安全标头验证**：使用浏览器开发者工具（Network 标签页）查看响应头，确认包含：
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Referrer-Policy: strict-origin-when-cross-origin`
6. **转化外链核对**：点击任意品牌卡片或光速云注册按钮，确认在新标签页打开，且右键“检查元素”可见 `rel="nofollow sponsored noopener"`。

<template>
  <div class="conversion-banner-card">
    <div class="banner-badge">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      TrialPick 实验室 2026 年度编辑综合力荐
    </div>
    
    <div class="banner-body">
      <div class="banner-main">
        <h3 class="banner-title">
          {{ customTitle || '追求长期省心与零断连？建议优先考虑【光速云】' }}
        </h3>
        <p class="banner-desc">
          在对比了市面上 28 家机场后，如果您厌倦了频繁换节点、晚高峰丢包卡顿或担心小机场跑路，2020 年成立的<strong>光速云</strong>是目前经过 6 年时间检验的最稳之选。企业内网专线直连，晚高峰 4K 极速秒开。
        </p>
        <div class="banner-highlights">
          <div class="hl-item">
            <span class="hl-bullet">✓</span> <strong>6年老牌稳定</strong>（2020年运营至今，零跑路污点）
          </div>
          <div class="hl-item">
            <span class="hl-bullet">✓</span> <strong>纯企业级内网</strong>（晚高峰20:00-23:00丢包率接近0%）
          </div>
          <div class="hl-item">
            <span class="hl-bullet">✓</span> <strong>超高性价比</strong>（入门套餐年付99元，折合仅<strong>8.25元/月</strong>）
          </div>
          <div class="hl-item">
            <span class="hl-bullet">✓</span> <strong>全解锁保障</strong>（全节点解锁 ChatGPT/Claude/Netflix）
          </div>
        </div>
      </div>

      <div class="banner-action-area">
        <div class="coupon-box">
          <span class="coupon-label">专属优惠码</span>
          <span class="coupon-val"><code>AMM</code></span>
        </div>
        <a :href="referralUrl" target="_blank" rel="nofollow sponsored noopener" class="cta-btn-primary conversion-cta">
          直达光速云官网抢购
          <span class="aff-tag">(含推广链接)</span>
        </a>
        <a href="/reviews/gsy" class="review-link">
          查看光速云 3000+ 字完整评测报告 →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LINKS } from '../../../data/links'

defineProps<{
  customTitle?: string
}>()

const referralUrl = LINKS.GSY_REGISTER
</script>

<style scoped>
.conversion-banner-card {
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(56, 189, 248, 0.03) 100%);
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 14px;
  padding: 24px;
  margin: 36px 0;
  box-shadow: 0 8px 24px rgba(2, 132, 199, 0.1);
  position: relative;
}

.banner-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 14px;
}

.banner-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.banner-main {
  flex: 1;
  min-width: 280px;
}

.banner-title {
  margin: 0 0 10px 0 !important;
  font-size: 19px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.banner-desc {
  margin: 0 0 14px 0 !important;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.banner-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
}

.hl-item {
  font-size: 13px;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 6px;
}

.hl-bullet {
  color: #10b981;
  font-weight: bold;
}

.banner-action-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 220px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  padding: 16px;
  border-radius: 12px;
}

.coupon-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.coupon-val code {
  color: #dc2626;
  font-weight: 800;
  font-size: 15px;
  padding: 2px 8px;
  background: rgba(220, 38, 38, 0.08);
  border-radius: 4px;
}

.conversion-cta {
  width: 100%;
  text-align: center;
  font-size: 14px;
  padding: 11px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.aff-tag {
  font-size: 11px;
  opacity: 0.85;
  font-weight: normal;
}

.review-link {
  font-size: 12.5px;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 768px) {
  .banner-action-area {
    width: 100%;
  }
}
</style>

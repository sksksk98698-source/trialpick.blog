<template>
  <div v-if="brand" :class="['brand-card-box', brand.rank === 1 ? 'is-top-pick' : '']">
    <div class="card-header">
      <div class="header-left">
        <span class="rank-badge" :class="'rank-' + brand.rank">#{{ brand.rank }}</span>
        <h3 class="brand-title">{{ brand.name }}</h3>
        <span class="founded-tag">{{ brand.foundedYear }}年开业</span>
      </div>
      <div class="header-right">
        <span class="price-highlight">
          <span class="currency">¥</span>
          <span class="num">{{ brand.monthlyPrice }}</span>
          <span class="unit">/月起</span>
        </span>
      </div>
    </div>

    <div class="card-meta-grid">
      <div class="meta-item">
        <span class="meta-label">入门套餐</span>
        <span class="meta-val">{{ brand.entryPlan }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">专线类型</span>
        <span class="meta-val line-type-val">{{ brand.lineType }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">专属优惠码</span>
        <span class="meta-val coupon-code"><code>{{ brand.coupon }}</code></span>
      </div>
      <div class="meta-item">
        <span class="meta-label">数据状态</span>
        <span class="meta-val status-badge">{{ brand.dataStatus === 'vendor' ? '官方核验' : '实测数据' }}</span>
      </div>
    </div>

    <div class="card-features">
      <ul>
        <li v-for="(feat, idx) in brand.features.slice(0, 3)" :key="idx">
          <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{{ feat }}</span>
        </li>
      </ul>
    </div>

    <div class="card-actions">
      <a :href="'/reviews/' + brand.slug" class="cta-btn-secondary">
        查看完整深度评测
      </a>
      <a :href="brand.referralUrl" target="_blank" rel="nofollow sponsored noopener" class="cta-btn-primary">
        直达官网注册 <span class="aff-hint">(含推广链接)</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import brandsData from '../../../data/brands.json'

const props = defineProps<{
  slug?: string
  rank?: number
}>()

const brand = computed(() => {
  if (props.slug) {
    return brandsData.find(b => b.slug === props.slug)
  }
  if (props.rank) {
    return brandsData.find(b => b.rank === props.rank)
  }
  return null
})
</script>

<style scoped>
.brand-card-box {
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.brand-card-box:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.08);
}

.is-top-pick {
  border: 2px solid var(--vp-c-brand-1);
  background: linear-gradient(180deg, rgba(2, 132, 199, 0.03) 0%, var(--vp-c-bg) 100%);
  position: relative;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-border);
  padding-bottom: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 14px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
}

.rank-1 {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
}

.brand-title {
  margin: 0 !important;
  font-size: 19px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.founded-tag {
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-elv);
  padding: 2px 8px;
  border-radius: 4px;
}

.price-highlight {
  color: var(--vp-c-brand-1);
  font-weight: 800;
}

.currency {
  font-size: 14px;
  margin-right: 2px;
}

.num {
  font-size: 24px;
  line-height: 1;
}

.unit {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: normal;
  margin-left: 2px;
}

.card-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  background: var(--vp-c-bg-alt);
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 14px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}

.meta-val {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.line-type-val {
  color: #0284c7;
}

.coupon-code code {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}

.status-badge {
  font-size: 11px;
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
  width: fit-content;
}

.card-features ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.check-icon {
  flex-shrink: 0;
  color: #10b981;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.aff-hint {
  font-size: 11px;
  opacity: 0.85;
  margin-left: 2px;
}

@media (max-width: 640px) {
  .card-actions {
    flex-direction: column;
  }
  .card-actions a {
    width: 100%;
    text-align: center;
  }
}
</style>

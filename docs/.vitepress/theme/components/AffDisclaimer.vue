<template>
  <div :class="['aff-disclaimer-wrapper', position === 'top' ? 'disclaimer-top' : 'disclaimer-bottom']">
    <div class="disclaimer-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    </div>
    <div class="disclaimer-content">
      <p class="disclaimer-title">
        <strong>{{ position === 'top' ? '合规透明度披露声明（含赞助与推广链接）' : '商业推广与中立性保障承诺' }}</strong>
      </p>
      <p class="disclaimer-text">
        <template v-if="position === 'top'">
          本页面部分推荐链接为合规商业赞助外链（已依照 Google & Bing 2026 规范标记 <code>rel="nofollow sponsored noopener"</code>）。若您通过链接订阅，TrialPick 可能会获得由服务商支付的技术支持佣金。这<strong>不会增加您的任何购买费用</strong>，亦不影响我们的独立实测与客观缺陷揭露。
        </template>
        <template v-else>
          TrialPick 恪守数据真实性与客观测试原则。所有收录品牌均标明数据状态（<code>vendor</code> / <code>measured</code>），严禁捏造测速与虚构优惠。详细赞助合作细则与评测独立性承诺请阅读 <a href="/about/disclosure">赞助披露政策</a> 与 <a href="/about/methodology">评测方法论</a>。
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  position?: 'top' | 'bottom'
}>()
</script>

<style scoped>
.aff-disclaimer-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 8px;
  padding: 12px 16px;
  margin: 18px 0 24px;
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.disclaimer-top {
  margin-top: 12px;
}

.disclaimer-bottom {
  margin-top: 36px;
  border-left-color: #10b981;
}

.disclaimer-icon {
  flex-shrink: 0;
  color: var(--vp-c-brand-1);
  margin-top: 2px;
}

.disclaimer-bottom .disclaimer-icon {
  color: #10b981;
}

.disclaimer-content {
  flex: 1;
}

.disclaimer-title {
  margin: 0 0 4px !important;
  color: var(--vp-c-text-1);
  font-weight: 600;
  font-size: 14px;
}

.disclaimer-text {
  margin: 0 !important;
}

.disclaimer-text a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.disclaimer-text code {
  font-size: 12px;
  padding: 2px 4px;
  background: var(--vp-c-bg-elv);
  border-radius: 4px;
}
</style>

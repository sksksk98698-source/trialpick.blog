<template>
  <div class="author-card-box">
    <div class="author-avatar-wrap">
      <img :src="author.avatar" :alt="author.name" class="author-avatar" />
    </div>
    <div class="author-info">
      <div class="author-header">
        <div class="author-name-group">
          <span class="author-name">{{ author.name }}</span>
          <span class="verified-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            实名认证专家
          </span>
        </div>
        <span class="verify-date">最后核实：{{ lastUpdated || '2026-10-01' }}</span>
      </div>
      <p class="author-title">{{ author.title }}</p>
      <p class="author-bio">{{ author.bio }}</p>
      <div class="author-specialties">
        <span class="spec-label">测试专长：</span>
        <span v-for="tag in author.specialties" :key="tag" class="spec-tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import authorsData from '../../../data/authors.json'

const props = defineProps<{
  authorId?: string
  lastUpdated?: string
}>()

const author = computed(() => {
  const found = authorsData.find(a => a.id === props.authorId)
  return found || authorsData[0]
})
</script>

<style scoped>
.author-card-box {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 16px 20px;
  margin: 32px 0 24px;
}

.author-avatar-wrap {
  flex-shrink: 0;
}

.author-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}

.author-info {
  flex: 1;
}

.author-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}

.author-name-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-weight: 700;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11.5px;
  font-weight: 600;
  color: #0284c7;
  background-color: rgba(2, 132, 199, 0.1);
  padding: 2px 7px;
  border-radius: 12px;
}

.verify-date {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.author-title {
  margin: 0 0 6px !important;
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.author-bio {
  margin: 0 0 10px !important;
  font-size: 13px;
  color: var(--vp-c-text-3);
  line-height: 1.6;
}

.author-specialties {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.spec-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.spec-tag {
  font-size: 11.5px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  padding: 2px 8px;
  border-radius: 6px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .author-card-box {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .author-header {
    justify-content: center;
  }
  .author-specialties {
    justify-content: center;
  }
}
</style>

<template>
  <div class="comparison-table-wrapper">
    <div v-if="showFilters" class="table-filters">
      <button 
        v-for="f in filterOptions" 
        :key="f.key"
        :class="['filter-btn', currentFilter === f.key ? 'active' : '']"
        @click="currentFilter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="table-scroll-container">
      <table class="brand-rank-table">
        <thead>
          <tr>
            <th v-if="showRank" class="th-rank">排名</th>
            <th class="th-brand">品牌</th>
            <th class="th-year">成立</th>
            <th class="th-plan">入门套餐规格</th>
            <th class="th-price">折合月费</th>
            <th class="th-line">线路类型</th>
            <th class="th-coupon">优惠码</th>
            <th class="th-action">快速操作</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="b in filteredBrands" 
            :key="b.slug"
            :class="[b.rank === 1 ? 'highlight-row' : '']"
          >
            <td v-if="showRank" class="td-rank">
              <span :class="['rank-badge-sm', b.rank === 1 ? 'rank-1' : '']">
                {{ b.rank === 1 ? '★ 1' : b.rank }}
              </span>
            </td>
            <td class="td-brand">
              <a :href="'/reviews/' + b.slug" class="brand-name-link">
                <strong>{{ b.name }}</strong>
              </a>
              <span v-if="b.rank === 1" class="tag-top">综合第1</span>
            </td>
            <td class="td-year">{{ b.foundedYear }}年</td>
            <td class="td-plan">{{ b.entryPlan }}</td>
            <td class="td-price">
              <span class="price-val">¥{{ b.monthlyPrice }}</span>
              <span class="price-sub">/月</span>
            </td>
            <td class="td-line">
              <span class="line-badge">{{ b.lineType }}</span>
            </td>
            <td class="td-coupon">
              <code>{{ b.coupon }}</code>
            </td>
            <td class="td-action">
              <div class="action-btn-group">
                <a :href="'/reviews/' + b.slug" class="table-btn-review" title="查看评测">
                  评测
                </a>
                <a :href="b.referralUrl" target="_blank" rel="nofollow sponsored noopener" class="table-btn-aff" title="直达注册(含推广链接)">
                  直达官网
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-footer-hint">
      * 注：数据状态标注为 <code>vendor</code>（品牌核验），折合月费依据官方入门套餐计费周期折算。所有直达外链均遵守 Google 2026 规范标明 <code>rel="nofollow sponsored noopener"</code>。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import brandsData from '../../../data/brands.json'

const props = withDefaults(defineProps<{
  filterMode?: 'all' | 'under10' | 'top10' | 'trial'
  showFilters?: boolean
  limit?: number
  showRank?: boolean
}>(), {
  filterMode: 'all',
  showFilters: true,
  limit: 28,
  showRank: false,
})

const currentFilter = ref(props.filterMode)

const filterOptions = [
  { key: 'all', label: '全部 28 家机场' },
  { key: 'top10', label: '综合推荐 Top 10' },
  { key: 'under10', label: '10元以内高性价比' },
  { key: 'trial', label: '支持试用/低成本尝鲜' },
]

const filteredBrands = computed(() => {
  let list = [...brandsData]
  if (currentFilter.value === 'under10') {
    list = list.filter(b => b.monthlyPrice <= 10.0)
  } else if (currentFilter.value === 'top10') {
    list = list.filter(b => b.rank <= 10)
  } else if (currentFilter.value === 'trial') {
    // 支持免费试用或入门月付小于8元的低试错成本机场
    list = list.filter(b => b.rank === 1 || b.monthlyPrice <= 8.5)
  }
  return list.slice(0, props.limit)
})
</script>

<style scoped>
.comparison-table-wrapper {
  margin: 24px 0 32px;
}

.table-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.filter-btn {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #ffffff;
  font-weight: 600;
}

.table-scroll-container {
  overflow-x: auto;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.brand-rank-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  margin: 0 !important;
  display: table !important;
}

.brand-rank-table th {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  padding: 12px 14px;
  font-weight: 700;
  text-align: left;
  border-bottom: 2px solid var(--vp-c-border);
  white-space: nowrap;
}

.brand-rank-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  vertical-align: middle;
}

.highlight-row {
  background-color: rgba(2, 132, 199, 0.05) !important;
}

.highlight-row td {
  border-bottom-color: rgba(2, 132, 199, 0.2);
}

.rank-badge-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 7px;
  background: var(--vp-c-bg-elv);
  border-radius: 6px;
  font-weight: 700;
  font-size: 12px;
}

.rank-1 {
  background: #0284c7;
  color: #ffffff;
}

.brand-name-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.brand-name-link:hover {
  color: var(--vp-c-brand-1);
}

.tag-top {
  display: inline-block;
  background: #ef4444;
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  margin-left: 6px;
}

.price-val {
  font-size: 15px;
  font-weight: 700;
  color: #0284c7;
}

.price-sub {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}

.line-badge {
  background: var(--vp-c-bg-elv);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.action-btn-group {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.table-btn-review {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1) !important;
  padding: 4px 9px;
  border-radius: 6px;
  font-size: 12px;
  text-decoration: none !important;
}

.table-btn-review:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}

.table-btn-aff {
  background: var(--vp-c-brand-1);
  color: #ffffff !important;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none !important;
}

.table-btn-aff:hover {
  background: var(--vp-c-brand-2);
}

.table-footer-hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 8px;
  line-height: 1.5;
}
</style>

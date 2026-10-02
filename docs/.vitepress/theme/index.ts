import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import './styles/brand.css'

import AffDisclaimer from './components/AffDisclaimer.vue'
import AuthorCard from './components/AuthorCard.vue'
import BrandCard from './components/BrandCard.vue'
import ConversionBanner from './components/ConversionBanner.vue'
import ComparisonTable from './components/ComparisonTable.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('AffDisclaimer', AffDisclaimer)
    app.component('AuthorCard', AuthorCard)
    app.component('BrandCard', BrandCard)
    app.component('ConversionBanner', ConversionBanner)
    app.component('ComparisonTable', ComparisonTable)
  },
}

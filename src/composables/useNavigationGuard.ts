import type { NavigationGuard } from 'vue-router'
import { useFixturesStore } from '@/stores/fixtures'

export function useNavigationGuard(): NavigationGuard {
  let lazyInitDone = false
  return async (to) => {
    const fixturesStore = useFixturesStore()
    if (!lazyInitDone) {
      lazyInitDone = true
      try {
        await fixturesStore.fetch()
      } catch {
        // Error already surfaced via toast in the store; treat as "no fixtures".
      }
    }
    const hasFixtures = fixturesStore.weeks.length > 0
    if ((to.path === '/fixtures' || to.path === '/simulation') && !hasFixtures) {
      return '/'
    }
  }
}

import { createRouter, createWebHistory } from 'vue-router'
import TeamsView from '@/views/TeamsView.vue'
import FixturesView from '@/views/FixturesView.vue'
import SimulationView from '@/views/SimulationView.vue'
import { useNavigationGuard } from '@/composables/useNavigationGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'teams', component: TeamsView },
    { path: '/fixtures', name: 'fixtures', component: FixturesView },
    { path: '/simulation', name: 'simulation', component: SimulationView },
  ],
})

router.beforeEach(useNavigationGuard())

export default router

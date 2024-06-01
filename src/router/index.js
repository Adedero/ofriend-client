import { createRouter, createWebHistory } from 'vue-router';
import IndexLayout from '@/layouts/IndexLayout.vue';
import OnboardingLayout from '@/layouts/OnboardingLayout.vue';
import LegalLayout from '@/layouts/LegalLayout.vue';
import AppLayout from '@/layouts/AppLayout.vue';

import HomeView from '@/views/index/HomeView.vue';

import indexRoutes from '@/data/routes/index.routes';
import onboardingRoutes from '@/data/routes/onboarding.routes';
import legalRoutes from '@/data/routes/legal.routes';
import appRoutes from '@/data/routes/app.routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        ...indexRoutes]
    },
    {
      path: '/onboarding',
      component: OnboardingLayout,
      redirect: { name: 'signin' },
      children: onboardingRoutes
    },
    {
      path: '/legal',
      component: LegalLayout,
      redirect: { name: 'terms-and-conditions' },
      children: legalRoutes
    },
    {
      path: '/app',
      component: AppLayout,
      redirect: { name: 'app-home'},
      children: appRoutes,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

export default router

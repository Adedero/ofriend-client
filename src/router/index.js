import { createRouter, createWebHistory } from 'vue-router'
import IndexLayout from '@/layouts/IndexLayout.vue'
/* import OnboardingLayout from '@/layouts/OnboardingLayout.vue';
import LegalLayout from '@/layouts/LegalLayout.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import ChatLayout from '@/layouts/ChatLayout.vue'; */

import HomeView from '@/views/index/HomeView.vue'

import indexRoutes from '@/data/routes/index.routes'
import onboardingRoutes from '@/data/routes/onboarding.routes'
import legalRoutes from '@/data/routes/legal.routes'
import appRoutes from '@/data/routes/app.routes'
import mobileChatRoutes from '@/data/routes/mobile-chat.routes'
import recoveryRoutes from '@/data/routes/recovery.routes'
/* import chatRoutes from '@/data/routes/chat.routes'; */

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
        ...indexRoutes
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      beforeEnter: (to, from, next) => { next('/404') }
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/errors/Error404View.vue')
    },
    {
      path: '/500',
      name: '500',
      component: () => import('@/views/errors/Error500View.vue')
    },
    {
      path: '/onboarding',
      component: () => import('@/layouts/OnboardingLayout.vue'),
      redirect: { name: 'signin' },
      children: onboardingRoutes
    },
    {
      path: '/recovery/forgot-password',
      component: () => import('@/layouts/RecoveryLayout.vue'),
      children: recoveryRoutes
    },
    {
      path: '/legal',
      component: () => import('@/layouts/LegalLayout.vue'),
      redirect: { name: 'terms-and-conditions' },
      children: legalRoutes
    },
    {
      path: '/app',
      component: () => import('@/layouts/AppLayout.vue'),
      children: appRoutes,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat',
      component: () => import('@/views/chat/ChatView.vue'),
      beforeEnter: (to, from, next) => {
        if (window.innerWidth < 800) {
          next('/m/chat')
        } else {
          next()
        }
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/m/chat',
      name: 'chat-mobile',
      component: () => import('@/views/chat-mobile/ChatMobileView.vue'),
      children: mobileChatRoutes,
      beforeEnter: (to, from, next) => {
        if (window.innerWidth > 800) {
          next('/chat')
        } else {
          next()
        }
      }
    }
  ]
})

export default router

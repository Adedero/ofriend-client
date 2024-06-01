import { createRouter, createWebHistory } from 'vue-router';
import IndexLayout from '@/layouts/IndexLayout.vue';
import OnboardingLayout from '@/layouts/OnboardingLayout.vue';
import HomeView from '@/views/index/HomeView.vue';
import LegalLayout from '@/layouts/LegalLayout.vue';

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
        {
          path: 'about',
          component: () => import('@/views/index/AboutView.vue'),
          children: [
            {
              path: '',
              name: 'about',
              component: () => import('@/views/index/about/AboutView.vue')
            },
            {
              path: 'team',
              name: 'team',
              component: () => import('@/views/index/about/TeamView.vue')
            },
            {
              path: 'careers',
              name: 'careers',
              component: () => import('@/views/index/about/CareersView.vue')
            }
          ]
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/index/ContactView.vue')
        }
      ]
    },
    {
      path: '/onboarding',
      component: OnboardingLayout,
      redirect: { name: 'signin' },
      children: [
        {
          path: 'signin',
          name: 'signin',
          component: () => import('@/views/onboarding/SigninView.vue')
        },
        {
          path: 'signup',
          name:'signup',
          component: () => import('@/views/onboarding/SignupView.vue')
        },
        {
          path: 'signup-business-or-organization',
          name: 'signup-org',
          component: () => import('@/views/onboarding/SignupOrgView.vue')
        },
        {
          path: 'otp-verification',
          name: 'otp',
          component: () => import('@/views/onboarding/OtpView.vue')
        }
      ]
    },
    {
      path: '/legal',
      component: LegalLayout,
      redirect: { name: 'terms-and-conditions' },
      children: [
        {
          path: 'terms-and-conditions',
          name: 'terms-and-conditions',
          component: () => import('@/views/legal/TermsAndConditionsView.vue')
        },
        {
          path: 'privacy-policy',
          name: 'privacy-policy',
          component: () => import('@/views/legal/PrivacyPolicyView.vue')
        },
        {
          path: 'cookie-policy',
          name: 'cookie-policy',
          component: () => import('@/views/legal/CookiePolicyView.vue')
        }
      ]
    }
  ]
})

export default router

const legalRoutes = [
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

export default legalRoutes;
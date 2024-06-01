const onboardingRoutes = [
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
export default onboardingRoutes;
const recoveryRoutes = [
  {
    path: '',
    name: 'forgot-password',
    component: () => import('@/views/recovery/ForgotPasswordView.vue'),
    beforeEnter: (to, from, next) => {
      if (from.name !== 'signin') {
        next('/onboarding/signin')
      } else {
        next()
      }
    }
  }
]
export default recoveryRoutes

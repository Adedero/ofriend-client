const appRoutes = [
  {
    path: 'home',
    name: 'app-home',
    component: () => import('../../views/app/AppHomeView.vue')
  },
  {
    path: 'messages',
    name: 'app-messages',
    component: () => import('../../layouts/MessagingLayout.vue')
  }
]

export default appRoutes;
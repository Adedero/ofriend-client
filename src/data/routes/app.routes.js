const appRoutes = [
  {
    path: 'home',
    name: 'app-home',
    component: () => import('../../views/app/AppHomeView.vue')
  }
]

export default appRoutes;
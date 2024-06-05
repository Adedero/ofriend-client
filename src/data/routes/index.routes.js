const indexRoutes = [
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

export default indexRoutes

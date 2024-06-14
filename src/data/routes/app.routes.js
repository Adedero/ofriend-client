const appRoutes = [
  {
    path: '',
    name: 'app-home',
    component: () => import('@/views/app/AppHomeView.vue')
  },
  {
    path: 'post/:postId',
    name: 'user-post',
    component: () => import('@/views/app/PostDetailsVue.vue')
  },
  {
    path: 'notifications',
    name: 'app-notifications',
    component: () => import('@/views/app/NotificationsView.vue')
  },
  {
    path: 'profile/:userId',
    name: 'user-profile',
    component: () => import('@/views/app/ProfileView.vue')
  },
  {
    path: 'edit-profile',
    name: 'edit-profile',
    component: () => import('@/views/app/EditProfileView.vue')
  },
  {
    path: 'products-and-services',
    name: 'products',
    component: () => import('@/views/app/ProductsView.vue')
  },
  {
    path: 'saved-posts',
    name: 'saved-posts',
    component: () => import('@/views/app/SavedPostsView.vue')
  }
]

export default appRoutes

const mobileChatRoutes = [
  {
    path: '',
    name: 'mobile-chat-list',
    component: () => import('../../views/chat-mobile/MobileChatListView.vue')
  },
  {
    path: 'private-chat',
    name: 'mobile-private-chat',
    component: () => import('../../views/chat-mobile/MobilePrivateChatView.vue')
  }
]

export default mobileChatRoutes

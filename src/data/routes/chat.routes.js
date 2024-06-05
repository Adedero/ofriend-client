const chatRoutes = [
  {
    path: '',
    name: 'chats',
    component: () => import('../../views/chat/ChatView.vue')
  }
]

export default chatRoutes

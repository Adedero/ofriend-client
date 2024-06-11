import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(sessionStorage.getItem('user')) || {
    id: '',
    name: '',
    email: '',
    isVerified: false,
    isOrg: false,
    createdAt: '',
    bio: ''
  });

  const setUser = (value = {}) => {
    sessionStorage.setItem('user', JSON.stringify(value));
    user.value = value;
  }

  return { user, setUser }
});
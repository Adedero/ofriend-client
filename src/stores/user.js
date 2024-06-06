import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const user = ref(sessionStorage.getItem('user') || {
    name: '',
    email: '',
    isVerified: false,
    isOrg: false
  });

  const setUser = (value = {}) => {
    sessionStorage.setItem('user', JSON.stringify(value));
    user.value = value;
  }

  return { user, setUser }
});
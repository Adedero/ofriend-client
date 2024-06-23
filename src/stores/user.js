import { ref } from 'vue';
import { defineStore } from 'pinia';

/* export const useUserStore = defineStore('user', () => {
  const users = ref(JSON.parse(sessionStorage.getItem('users')) || {});
  const user = ref({ id: '', name: '', email: '', isVerified: false, isOrg: false, createdAt: '', bio: '' });

  const setUser = (newUser = {}) => {
    users.value[newUser.id] = newUser;
    sessionStorage.setItem('users', JSON.stringify(users.value));
    user.value = newUser;
  };

  const getUser = (userId) => {
    return users.value[userId] || null;
  };

  const clearUser = (userId) => {
    delete users.value[userId];
    sessionStorage.setItem('users', JSON.stringify(users.value));
    if (user.value.id === userId) {
      user.value = { id: '', name: '', email: '', isVerified: false, isOrg: false, createdAt: '', bio: '' };
    }
  };

  return { user, getUser, setUser, clearUser }
}); */

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(sessionStorage.getItem('user')) || null);

  const token = ref(sessionStorage.getItem('token') || null);

  const setToken = (value) => {
    sessionStorage.setItem('token', value);
    token.value = value;
  }

  const setUser = (value = {}) => {
    sessionStorage.setItem('user', JSON.stringify(value));
    user.value = value;
  }

  return { user, setUser, token, setToken }
});
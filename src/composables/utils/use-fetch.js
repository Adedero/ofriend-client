import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

export const useGet = async (url, options = {}) => {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const status = ref(null);

  async function getRequest() {
    const userStore = useUserStore();
    loading.value = true;
    try {
      const res = await fetch(`${import.meta.env.VITE_API}${url}`, {
        headers: {
          'Authorization': 'Bearer ' + userStore.token
        },
        ...options
      });
      data.value = await res.json();
      status.value = res.status;
      error.value = null;
    } catch (error) {
      error.value = error.message
    } finally {
      loading.value = false;
    }
  }

  await getRequest();

  return { loading, status, data, error }
}


export const usePost = async (url, postData, method = 'POST', options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const status = ref(null);

  async function postRequest() {
    const userStore = useUserStore();
    loading.value = true;
    try {
      const res = await fetch(`${import.meta.env.VITE_API}${url}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userStore.token
        },
        body: JSON.stringify(postData),
        signal: controller.signal,
      ...options
      });

      data.value = await res.json();
      status.value = res.status;
      error.value = null;
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  }

  await postRequest();

  clearTimeout(timeoutId);

  return { loading, status, data, error }
}
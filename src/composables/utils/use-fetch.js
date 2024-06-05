import { ref } from 'vue';

export const useGet = async (url, options = {}) => {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const status = ref(null);

  async function getRequest() {
    loading.value = true;
    try {
      const res = await fetch(`${import.meta.env.VITE_API}${url}`, {
        credentials: 'include',
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


export const usePost = async (url, postData, method = 'POST', options = {}) => {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const status = ref(null);

  async function postRequest() {
    loading.value = true;
    try {
      const res = await fetch(`${import.meta.env.VITE_API}${url}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(postData),
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

  return { loading, status, data, error }
}
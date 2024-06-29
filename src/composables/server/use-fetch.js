import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';

export const useGet = async (url, options = {
  router: null,
  toast: null,
  toastLife: 5000,
  refetch: false,
  toastOnSuccess: false,
  successSummary: 'Successful',
  successDetail: 'Your request was completed successfully.',
  sendToken: true
}, done) => {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const status = ref(null);

  async function getRequest(api) {
    const userStore = useUserStore();

    const token = userStore.token;

    if (options.sendToken) {
      if(!token) return options.router.push({ name: 'signin' });
    }

    if (loading.value) return;

    loading.value = true;

    try {
      const res = await fetch(`${import.meta.env.VITE_API}${api}`, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-type': 'application/json'
        },
      });

      const payload = await res.json();

      if (!payload) {
        options.router.push('/500');
        return;
      }
      //console.log(payload);

      data.value = payload;
      status.value = res.status;
      error.value = null;

      if (res.status === 401 || payload.authMessage) {
        options.router.push({ name: 'signin' });
        return;
      }

      if (res.status === 403) {
        options.router.push('/403');
        return;
      }

      if (res.status === 404) {
        options.router.push('/404');
        return;
      }

      if (res.status !== 200) {
        options.toast.add({
          severity: 'warn',
          summary: payload.info ? payload.info : 'Failed',
          detail: payload.message ? payload.message : 'The request could not be completed. Please, try again later.',
          life: options.toastLife || 5000
        });
        return;
      }

      if (options.toastOnSuccess) {
        options.toast.add({ 
          severity: 'success',
          summary: data.value.info || options.successSummary,
          detail:  data.value.message || options.successDetail,
          life: options.toastLife || 5000
        })
      }

      if (typeof done === 'function') {
        done(data.value);
      }

    } catch (error) {
      console.error(error);
      error.value = error.message;

      options.toast.add({ 
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: options.toastLife || 5000
      });
    } finally {
      loading.value = false;
    }
  }

  await getRequest(url);

  const retry = async () => getRequest(url);

  watch(() => url, async (newValue) => {
    if (options.refetch) await getRequest(newValue);
  });

  return { loading, status, data, error, retry }
}


export const usePost = async (url, options = {
  body: null,
  method: 'POST',
  router: null,
  toast: null,
  toastLife: 5000,
  refetch: false,
  sendToken: true,
  toastOnSuccess: false,
  successSummary: 'Successful',
  successDetail: 'Your request was completed successfully.'
}, done) => {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const status = ref(null);

  async function postRequest(api) {
    const userStore = useUserStore();
    const token = userStore.token;

    if (options.sendToken) {
      if(!token) return options.router.push({ name: 'signin' });
    }

    if (loading.value) return;

    loading.value = true;

    try {
      const res = await fetch(`${import.meta.env.VITE_API}${api}`, {
        method: options.method ? options.method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(options.body),
      });

      const payload = await res.json();

      if (!payload) {
        options.router.push('/500');
        return;
      }
      //console.log(payload);

      data.value = payload;
      status.value = res.status;
      error.value = null;

      if (res.status === 401 || payload.authMessage) {
        options.router.push({ name: 'signin' });
        return;
      }

      if (res.status === 403) {
        options.router.push('/403');
        return;
      }

      if (res.status === 404) {
        options.router.push('/404');
        return;
      }

      if (res.status !== 200) {
        options.toast.add({
          severity: 'warn',
          summary: payload.info ? payload.info : 'Failed',
          detail: payload.message ? payload.message : 'The request could not be completed. Please, try again later.',
          life: options.toastLife || 5000
        });
        return;
      }

      if (options.toastOnSuccess) {
        options.toast.add({ 
          severity: 'success',
          summary: data.value.info || options.successSummary,
          detail:  data.value.message || options.successDetail,
          life: options.toastLife || 5000
        })
      }

      if (typeof done === 'function') {
        done(data.value);
      }

    } catch (error) {
      console.error(error);
      error.value = error.message;
      options.toast.add({ 
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: options.toastLife || 5000
      });
    } finally {
      loading.value = false;
    }
  }

  await postRequest(url);

  const retry = async () => postRequest(url);

  watch(() => url, async (newValue) => {
    if (options.refetch === true) await postRequest(newValue);
  });

  return { loading, status, data, error, retry }
}
import { computed, reactive, ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';

export const useGet = async (url, config = {
  skip: false,
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
  const response = ref(null);

  const _fetch = async function getRequest(api) {
    const userStore = useUserStore();
    const token = userStore.token;

    if (config.sendToken && !token) {
      return config.router.push({ name: 'signin' });
    }

    if (loading.value) return;

    loading.value = true;

    try {
      response.value = await fetch(`${import.meta.env.VITE_API}${api}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json'
        },
      });

      const payload = await response.value.json();

      if (!payload) {
        config.router.push('/500');
        return;
      }

      data.value = payload;
      status.value = response.value.status;
      error.value = null;

      if (status.value === 401 || payload.authMessage) {
        config.router.push({ name: 'signin' });
        return;
      }

      if (status.value === 403) {
        config.router.push('/403');
        return;
      }

      if (status.value === 404) {
        config.router.push('/404');
        return;
      }

      if (status.value !== 200) {
        config.toast.add({
          severity: 'warn',
          summary: payload.info ? payload.info : 'Failed',
          detail: payload.message ? payload.message : 'The request could not be completed. Please, try again later.',
          life: config.toastLife || 5000
        });
        return;
      }

      if (config.toastOnSuccess) {
        config.toast.add({
          severity: 'success',
          summary: data.value.info || config.successSummary,
          detail: data.value.message || config.successDetail,
          life: config.toastLife || 5000
        });
      }

      if (typeof done === 'function') {
        done(data.value);
      }

    } catch (err) {
      console.error(err);
      error.value = err.message;

      config.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
        life: config.toastLife || 5000
      });
    } finally {
      loading.value = false;
    }
  }

  if (!config.skip) {
    await _fetch(url);
  }

  watch(() => url, async (newValue) => {
    if (config.refetch) await _fetch(newValue);
  });

  return { response, loading, status, data, error, _fetch };
};


//Fetching with cache
const cacheMap = reactive(new Map());

export const useCachedGet = async (url, config = {}, done) => {
  const info = await useGet(url, { skip: true, ...config });

  const key = url.split('/')[1];

  const update = () => cacheMap.set(key, info.data.value);
  const clear = () => cacheMap.set(key, undefined);

  const cachedFetch = async () => {
    try {
      await info._fetch(url);

      if (typeof done === 'function') {
        done(info.data.value);
      }

      update();
    } catch (err) {
      clear();
    }
  };

  const cachedData = computed(() => cacheMap.get(key));

  if (cachedData.value == null) {
    cachedFetch();
  } else {
    info.loading.value = false;
  }

  return { ...info, _fetch: cachedFetch, cachedData, clear };
};


//POST, PUT, PATCH AND DELETE requests
export const usePost = async (url, config = {
  skip: false,
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

  const _fetch = async function postRequest(api) {
    const userStore = useUserStore();
    const token = userStore.token;

    if (config.sendToken) {
      if(!token) return config.router.push({ name: 'signin' });
    }

    if (loading.value) return;

    loading.value = true;

    try {
      const res = await fetch(`${import.meta.env.VITE_API}${api}`, {
        method: config.method ? config.method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(config.body),
      });

      const payload = await res.json();

      if (!payload) {
        config.router.push('/500');
        return;
      }
      //console.log(payload);

      data.value = payload;
      status.value = res.status;
      error.value = null;

      if (res.status === 401 || payload.authMessage) {
        config.router.push({ name: 'signin' });
        return;
      }

      if (res.status === 403) {
        config.router.push('/403');
        return;
      }

      if (res.status === 404) {
        config.router.push('/404');
        return;
      }

      if (res.status !== 200) {
        config.toast.add({
          severity: 'warn',
          summary: payload.info ? payload.info : 'Failed',
          detail: payload.message ? payload.message : 'The request could not be completed. Please, try again later.',
          life: config.toastLife || 5000
        });
        return;
      }

      if (config.toastOnSuccess) {
        config.toast.add({ 
          severity: 'success',
          summary: data.value.info || config.successSummary,
          detail:  data.value.message || config.successDetail,
          life: config.toastLife || 5000
        })
      }

      if (typeof done === 'function') {
        done(data.value);
      }

    } catch (error) {
      console.error(error);
      error.value = error.message;
      config.toast.add({ 
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: config.toastLife || 5000
      });
    } finally {
      loading.value = false;
    }
  }

  await _fetch(url);

  watch(() => url, async (newValue) => {
    if (config.refetch === true) await _fetch(newValue);
  });

  return { loading, status, data, error, _fetch }
}
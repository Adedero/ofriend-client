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
  sendToken: true,
  timeout: null,
}, done) => {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const status = ref(null);
  const response = ref(null);

  const _fetch = async function getRequest(api) {
    const userStore = useUserStore();
    const token = userStore.token;

    const abortController = new AbortController();
    let timer = null;

    if (config.sendToken && !token) {
      return config.router.push({ name: 'signin' });
    }

    if (loading.value) return;

    loading.value = true;

    timer = setTimeout(() => {
      abortController.abort();
    }, config.timeout || 1000 * 60);

    try {
      response.value = await fetch(`${import.meta.env.VITE_API}${api}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json'
        },
        signal: abortController.signal
      });

      const payload = await response.value.json();

      if (!payload) {
        config.router.push('/500');
        return;
      }

      
      status.value = response.value.status;
      

      if (status.value === 401 && payload.authMessage) {
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

        error.value = payload.message;
        data.value = null;
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

      data.value = payload;
      error.value = null;

      if (typeof done === 'function') {
        done(data.value);
      }

    } catch (err) {
      console.error(err);
      error.value = err.message;

      if (err instanceof DOMException && err.name === 'AbortError') {
          config.toast.add({
          severity: 'warn',
          summary: 'Timeout',
          detail: 'That took too long. Please, check your internet connection and try again',
          life: config.toastLife || 5000
        });
        
        return;
      }

      config.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
        life: config.toastLife || 5000
      });
      
    } finally {
      loading.value = false;
      if (timer) {
        clearTimeout(timer);
      }
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
  const { loading, data, _fetch} = await useGet(url, { skip: true, ...config });

  const key = url.split('/')[1];

  const update = () => cacheMap.set(key, data.value);
  const clear = () => cacheMap.set(key, undefined);

  const cachedFetch = async () => {
    try {
      await _fetch(url);

      if (typeof done === 'function') {
        done(data.value);
      }

      update();
    } catch (err) {
      console.log(err);
      //clear();
    }
  };

  const cachedData = computed(() => cacheMap.get(key));

  if (cachedData.value == null) {
    cachedFetch();
  } else {
    loading.value = false;
  }

  return {_fetch: cachedFetch, cachedData, clear };
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
  successDetail: 'Your request was completed successfully.',
  timeout: null
}, done) => {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const status = ref(null);

  const _fetch = async function postRequest(api) {
    const userStore = useUserStore();
    const token = userStore.token;
    const abortController = new AbortController();
    let timer = null;

    if (config.sendToken) {
      if(!token) return config.router.push({ name: 'signin' });
    }

    if (loading.value) return;

    loading.value = true;

    timer = setTimeout(() => {
      abortController.abort();
    }, config.timeout || 1000 * 30);

    try {
      const res = await fetch(`${import.meta.env.VITE_API}${api}`, {
        method: config.method ? config.method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        signal: abortController.signal,
        body: JSON.stringify(config.body),
      });

      const payload = await res.json();

      if (!payload) {
        config.router.push('/500');
        return;
      }
      //console.log(payload);

      
      status.value = res.status;
      

      if (res.status === 401 && payload.authMessage) {
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

        error.value = payload.message;
        data.value = null;
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

      data.value = payload;
      error.value = null;

      if (typeof done === 'function') {
        done(data.value);
      }

    } catch (err) {
      console.error(err);
      error.value = err.message;
      if (err instanceof DOMException && err.name === 'AbortError') {
          config.toast.add({
          severity: 'warn',
          summary: 'Timeout',
          detail: 'That took too long. Please, check your internet connection and try again',
          life: config.toastLife || 5000
        });
        
        return;
      }

      config.toast.add({ 
        severity: 'error',
        summary: 'Error',
        detail: err.message,
        life: config.toastLife || 5000
      });

    } finally {
      loading.value = false;
      if (timer) {
        clearTimeout(timer);
      }
    }
  }

  await _fetch(url);

  watch(() => url, async (newValue) => {
    if (config.refetch === true) await _fetch(newValue);
  });

  return { loading, status, data, error, _fetch }
}
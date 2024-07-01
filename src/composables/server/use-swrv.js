import { useUserStore } from '@/stores/user';
import useSWRV from 'swrv';

export default function useSWRVFetch(url, config = { router: null, toast: null }, done) {
  const { token } = useUserStore();
  
  const fetcher = async (api) => {
    const res = await fetch(api, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const payload = await res.json();
    
    if (!payload) {
      config.router.push('/500');
      return;
    }

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
        summary: payload.info || config.successSummary,
        detail: payload.message || config.successDetail,
        life: config.toastLife || 5000
      });
    }
    
    return payload;
  }

  const { data, error } = useSWRV(url, fetcher);

  // Watch for changes in data and call the done callback if provided
  data && data.value && typeof done === 'function' && done(data.value);

  return { data, error }
}
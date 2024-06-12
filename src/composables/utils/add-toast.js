export function addToast(response, toast, onSuccess = true, life = 5000) {
  if (!response.error) {
    if (response.status !== 200) {
      toast.add({
        severity: 'warn',
        summary: response.data.info? response.data.info: 'Failed',
        detail: response.data.message,
        life: life
      });
    } else {
      if (onSuccess) {
        toast.add({
          severity:'success',
          summary: response.data.info? response.data.info: 'Success',
          detail: response.data.message,
          life: life
        });
      }
    }
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.error,
      life: life
    });
  }
}

export function useToastError(toast, error = null, life = 0) {
  life > 0 ?
  toast.add({ 
    severity: 'error',
    summary: 'Error',
    detail: error ? (error.message ? error.message : error) : 'Something went wrong. Please, check your connection and try again later.',
    life: life
  })
  :toast.add({ 
    severity: 'error',
    summary: 'Error',
    detail: error ? (error.message ? error.message : error) : 'Something went wrong. Please, check your connection and try again later.',
  })

}
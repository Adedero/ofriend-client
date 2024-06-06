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
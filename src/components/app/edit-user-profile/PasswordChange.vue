<script setup>
import { ref } from 'vue';
import { usePost } from '@/composables/utils/use-fetch';
import { useRouter } from 'vue-router';

const router = useRouter();

const password = ref({});
const loading = ref(false);
const error = ref({ isError: false, message: '' });

const changePassword = async () => {
  error.value.isError = false;
  error.value.message = '';
  const { oldpassword, newpassword, confirm } = password.value;
  if (!oldpassword || !newpassword || !confirm) {
    error.value.isError = true;
    error.value.message = 'All fields are required';
    return;
  }
  if (newpassword.length < 6) {
    error.value.isError = true;
    error.value.message = 'Password must be at least 6 characters';
    return;
  }
  if (newpassword === oldpassword) return;
  
  if (confirm !== newpassword) {
    error.value.isError = true;
    error.value.message = 'Passwords do not match';
    return;
  }
  const passwords = {
    oldpassword,
    newpassword,
    confirm,
  }
  loading.value = true;
  try {
    const { data, status, error: err } = await usePost('api/change-password', passwords, 'PUT');
    console.log(data.value);
    if (err.value) {
      error.value.isError = true;
      error.value.message = err.value;
      return;
    }
    if (status.value !== 200) {
      error.value.isError = true;
      error.value.message = data.value.message;
      return;
    }
    router.push({ name: 'signin' });
  } catch (err) {
    console.log(err);
    error.value.isError = true;
    error.value.message = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <p class="font-semibold">Change Password</p>
    <small v-show="error.isError" class="text-[red]">{{ error.message }}</small>

    <div class="mt-3 grid md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-5">
      <div>
        <label for="old-password" class="text-sm text-slate-500 font-bold block">Old password</label>
        <Password v-model="password.oldpassword" input-id="old-password" toggle-mask :feedback="false" class="w-full"
          input-class="w-full" />
      </div>

      <div>
        <label for="new-password" class="text-sm text-slate-500 font-bold block">New password</label>
        <Password v-model="password.newpassword" input-id="new-password" toggle-mask class="w-full"
          input-class="w-full" />
      </div>

      <div>
        <label for="confirm-password" class="text-sm text-slate-500 font-bold block">Confirm password</label>
        <Password v-model="password.confirm" toggle-mask input-id="confirm-password" :feedback="false" class="w-full"
          input-class="w-full" />
      </div>

      <div class="grid items-end">
        <Button @click="changePassword" label="Save changes" :loading class="btn w-fit md:w-full" />
      </div>
    </div>
  </div>
</template>
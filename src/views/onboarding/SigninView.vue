<script setup>
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { usePost } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();

const isLoading = ref(false);

const user = ref({});

const isUnverified = ref(false);

const isSubmissionValid = computed(() => user.value.email && user.value.password);

const signin = async () => {
  isLoading.value = true;
  await usePost('auth/sign-in', { body: user.value, router, toast, sendToken: false }, (data) => {
    userStore.setToken(data.token);
    userStore.setUser(data.user);
    const { isVerified } = data.user;
    if (isVerified) {
      router.push({ name: 'app-home' });
      return;
    }
    isUnverified.value = true;
  });
  isLoading.value = false;
}

//If user is unverified, send an authentication email
const isMailing = ref(false);

const sendMail = async () => {
  isMailing.value = true;
  await usePost(`auth/send-mail/${user.value.email}`, { router, toast }, (data) => {
    
    if (data.success) router.push({ name: 'otp' }); 
  });
  isMailing.value = false;
}
/* const signin = async () => {
  res.value.loading = true;
  try {
    res.value = await usePost('auth/sign-in', user.value);
    if (!res.value) return;
    console.log(res.value.data)
    addToast(res.value, toast, false);
    if (res.value.error || res.value.status !== 200) {
      return
    }
    userStore.setToken(res.value.data.token)
    userStore.setUser(res.value.data.user);
    
    const { isVerified } = res.value.data.user;
    if (isVerified) {
      router.push({ name: 'app-home' });
      return;
    }
    isUnverified.value = true;
    return;
  } catch (err) {
    console.log(err);
  }
}

const mailResponse = ref({});
const sendMail = async () => {
  mailResponse.value.loading = true;
  try {
    mailResponse.value = await usePost(`auth/send-mail/${user.value.email}`);
    console.log(mailResponse.value)
    if (mailResponse.value.data.success) {
      router.push({  name: 'otp' });
      return;
    }
    addToast(mailResponse.value, toast, false);
  } catch (error) {
    console.log(error);
  }
} */

</script>

<template>
  <Toast class="max-w-96" />
  <Dialog v-model:visible="isUnverified" modal header="Verify Account" class="md:w-[40rem]">
    <div class="grid gap-5 md:grid-cols-2">
      <div>
        <img src="../../assets/images/verification.svg" alt="verification">
      </div>

      <div class="text-center flex flex-col  gap-4  md:justify-center md:gap-6 md:text-left">
        <div>
          <h1 class="font-bold text-3xl">Almost there!</h1>

        </div>

        <p>Please take a moment to verify your email. <br> You will need to do this just once.</p>

        <div class="flex gap-2 justify-center md:justify-normal">
          <Button type="button" label="Cancel" severity="secondary" @click="isUnverified = false"></Button>
          <Button type="button" label="Proceed" class="btn" @click="sendMail" :loading="isMailing"></Button>
        </div>
      </div>
    </div>
  </Dialog>

  <section class="max-w-80 md:max-w-96">
    <h1 class="font-bold text-3xl">Welcome Back</h1>
    <p>
      Don't have an account?
      <RouterLink :to="{ name: 'signup' }" class="text-accent hover:underline">Sign up</RouterLink>
      instead.
    </p>

    <div class="mt-10 grid gap-6">
      <InputText v-model="user.email" class="w-full" placeholder="Email" />

      <Password v-model="user.password" toggleMask :feedback="false" input-class="w-full"
        placeholder="Confirm Password" />

      <RouterLink to="/recovery/forgot-password" class="justify-self-end -mt-3 text-stone-400 hover:underline hover:text-accent text-right">Forgot password?
      </RouterLink>

      <Button @click="signin" :loading="isLoading" :disabled="!isSubmissionValid" label="Sign in" icon="pi pi-sign-in"
        icon-pos="right" class="btn" />
    </div>
  </section>
</template>

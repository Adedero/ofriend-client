<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useGet, usePost } from '@/composables/utils/use-fetch';
import { addToast } from '@/composables/utils/add-toast';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import maskEmail from '@/composables/utils/mask-email';
import { useUserStore } from '@/stores/user';


const userStore = useUserStore();

const router = useRouter();
const toast = useToast();

const seconds = ref(60);
const timer = ref(null);
const isResend = ref(false);
const isVerified = ref(false);

const res = ref(null);

const OTP = ref('');

const isButtonDisabled = computed(() => {
  return (!OTP.value || OTP.value.length !== 6);
});

const verifyResponse = ref({});
//Submitting the OTP for verification
const verifyOTP = async () => {
  verifyResponse.value.loading = true;
  try {
    verifyResponse.value = await usePost(`auth/verify-account/${OTP.value}`);
    if (verifyResponse.value.data.success) {
      isVerified.value = true;
      userStore.setUser(res.value.data.user);
      setTimeout(() => {
        router.push({ name: 'app-home' });
      }, 3000);
      return
    }
    addToast(verifyResponse.value, toast, false);
    return;
  } catch (error) {
    console.log(error);
  }
}

//Resending the OTP;
const mailResponse = ref({});

const resendOTP = async () => {
  mailResponse.value.loading = true;
  if (!res.value?.data?.user?.email) {
    toast.add({ severity: 'warn', summary: 'Failed', detail: 'Something went wrong. Please, try again later', life: 5000 });
    return
  }
  try {
    mailResponse.value = await usePost(`auth/send-mail/${res.value.data.user.email}`);
    addToast(mailResponse.value, toast, false);
    isResend.value = true;
  } catch (error) {
    console.log(error);
  }
}


onMounted(async () => {
  /*res.value = await useGet('auth/check-auth');
  if (res.value.error || !res.value.data.isAuthenticated) {
    router.push({ name: 'signin' });
    return;
  }*/
  timer.value = setInterval(() => {
    if (seconds.value === 0) {
      clearInterval(timer.value);
    } else {
      seconds.value--;
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer.value);
})
</script>

<template>
  <Toast class="max-w-96" />
  <Dialog v-model:visible="isVerified" modal :closable="false" class="rounded-none md:rounded-xl md:max-w-[32rem]">
    <div class="grid place-content-center gap-5">
      <div class="grid place-content-center">
        <img src="../../assets/images/success-icon.png" alt="success icon">
      </div>
      <div class="grid gap-3 text-center">
        <p class="font-bold">Congratulations</p>
        <div>
          <p>You have successfully created and verified your account.</p>
          <p v-if="res">Welcome onboard <span class="font-semibold">{{ res.data.user.name }}</span></p>
        </div>
      </div>
      <div class="grid place-content-center -mt-4">
        <span class="text-accent pi pi-spinner pi pi-spin mt-4" style="font-size: 1.2rem"></span>
      </div>
    </div>
  </Dialog>

  <section v-if="res && !res.loading" class="max-w-80">
    <h1 class="font-bold text-3xl">Verify Email Address</h1>
    <div>
      <p v-if="!isResend" class="mt-3">
        Enter the OTP sent to your email <span class="font-semibold">{{ maskEmail(res.data.user.email) }}</span>.
      </p>
      <p v-else class="mt-3">
        The OTP has been resent to your email <span class="font-semibold">{{ maskEmail(res.data.user.email) }}</span>.
      </p>
    </div>

    <div class="mt-10 grid gap-6">
      <InputOtp v-model="OTP" :length="6" integer-only mask class="flex gap-4 justify-between w-full" />
      <div>
        <p v-if="!mailResponse.loading" class="text-center">
          Didn't get the code? <button @click="resendOTP" :disabled="seconds"
            class="text-accent hover:underline disabled:text-slate-500 disabled:hover:no-underline">Resend
            {{ seconds ? `in ${seconds}s` : '' }}</button>
        </p>
        <p v-else class="text-slate-500 text-center cursor-not-allowed">Resending...</p>
      </div>

      <Button @click="verifyOTP" label="Confirm" :disabled="isButtonDisabled" :loading="verifyResponse.loading"
        icon="pi pi-check-square" icon-pos="right" class="btn" />
    </div>

    <p class="text-center mt-5">Back to
      <RouterLink :to="{ name: 'signin' }" class="text-accent font-semibold">Sign in.</RouterLink>
    </p>
  </section>

  <section v-if="!res || (res && res.loading)" class="w-80">
    <Skeleton height="5rem" class="w-full" />
    <div class="mt-10 grid gap-6">
      <Skeleton height="3rem" />
      <Skeleton height="1rem" />
      <Skeleton height="3rem" />
    </div>
  </section>
</template>

<style>
.p-inputotp-input {
  width: 100%;
}
</style>

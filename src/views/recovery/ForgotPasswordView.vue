<script setup>
import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePost } from '@/composables/utils/use-fetch';
import { addToast } from '@/composables/utils/add-toast';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

//Sends OTP to email
const email = ref('');
const emailResponse = ref({});
const sendMail = async (nextCallback) => {
  if (!email.value) {
    return toast.add({ severity: 'warn', info: 'Invalid request', detail: 'Please enter a valid email address' });
  }
  emailResponse.value.loading = true;
  try {
    emailResponse.value = await usePost(`auth/send-password-recovery-email/${email.value}`);
    if (!emailResponse.value) {
      return
    }
    if (emailResponse.value.data.success) {
      nextCallback();
      return;
    }
    addToast(emailResponse.value, toast, false);
    return
  } catch (error) {
    console.log(error)
  }
  console.log(email.value);
  nextCallback();
}

const OTP = ref('');
const password = ref('');
const passwordResponse = ref({});
const isSuccessful = ref(false);
const timer = ref(null);

const changePassword = async () => {
  passwordResponse.value.loading = true;
  try {
    passwordResponse.value = await usePost(
      'auth/change-password',
      { email: email.value, otp: OTP.value, password: password.value },
      'PUT'
    )
    if (!passwordResponse.value) return 
    if (passwordResponse.value.data.success) {
      isSuccessful.value = true;
      timer.value = setTimeout(() => {
        router.push({ name: 'signin' });
      }, 5000);
      return
    }
    addToast(passwordResponse.value, toast);
    return
  } catch (error) {
    toast.add({ severity: 'error', info: 'Error', detail: error.message });
    console.log(error)
  }
}

onUnmounted(() => clearTimeout(timer.value));


</script>

<template>
  <Toast class="max-w-96" />
  <Dialog v-model:visible="isSuccessful" modal :closable="false" class="rounded-none md:rounded-xl md:max-w-[32rem]">
    <div class="grid place-content-center gap-5">
      <div class="grid place-content-center">
        <img src="../../assets/images/success-icon.png" alt="success icon">
      </div>
      <div class="grid gap-3 text-center">
        <p class="font-bold">Congratulations</p>
        <div>
          <p>You have successfully recovered your account.</p>
          <p>You will be automatically redirected to the sign in page..</p>
        </div>
      </div>
      <div class="grid place-content-center -mt-4">
        <span class="text-accent pi pi-spinner pi pi-spin mt-4" style="font-size: 1.2rem"></span>
      </div>
    </div>
  </Dialog>
  <section class="max-w-80 md:max-w-96">
    <h1 class="font-bold text-3xl">Recover Your Account</h1>
    <p>Recover your account in a few simple steps.</p>

    <Stepper linear class="mt-10">
      <!-- Input Email -->
      <StepperPanel>
        <template #content="{ nextCallback }">
          <div class="grid gap-4">
            <p class="font-semibold">Enter your email address.</p>
            <InputText v-model="email" class="w-full" placeholder="Email" />
            <div class="flex justify-end">
              <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="sendMail(nextCallback)"
                :disabled="!email" :loading="emailResponse.loading" />
            </div>
          </div>
        </template>
      </StepperPanel>

      <!-- Input OTP -->
      <StepperPanel>
        <template #content="{ prevCallBack, nextCallback }">
          <div class="grid gap-4">
            <p class="font-semibold">Enter the OTP sent to your email address.</p>
            <InputOtp v-model="OTP" :length="6" integer-only mask class="flex gap-4 justify-between w-full" />
            <div class="flex justify-between">
              <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallBack" />
              <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback"
                :disabled="!OTP || OTP.length !== 6" />
            </div>
          </div>
        </template>
      </StepperPanel>

      <StepperPanel>
        <template #content="{ prevCallBack }">
          <div class="grid gap-4">
            <p class="font-semibold">Enter your new password.</p>
            <Password v-model="password" toggle-mask input-class="w-full" placeholder="Your new password" />
            <small class="text-red-500 -mt-2">Your password must be 6 characters long or more</small>
            <div class="flex justify-between">
              <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallBack" />
              <Button label="Submit" icon="pi pi-check-circle" iconPos="right" @click="changePassword"
                :disabled="!password || password.length < 6" :loading="passwordResponse.loading" />
            </div>
          </div>
        </template>
      </StepperPanel>
    </Stepper>

    <p class="mt-4 text-center">
      Do you want to try <RouterLink :to="{ name: 'signin' }" class="text-accent hover:underline">signing in
      </RouterLink>
      again?
    </p>
  </section>
</template>
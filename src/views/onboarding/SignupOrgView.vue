<script setup>
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { usePost } from '@/composables/utils/use-fetch';
import countries from '@/data/countries';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { addToast } from '@/composables/utils/add-toast';

const router = useRouter();
const toast = useToast();
const response = ref({});

const user = ref({});

const isSubmissionValid = computed(() => {
  return (
    user.value.name &&
    user.value.country &&
    user.value.region &&
    user.value.address &&
    user.value.businessDescription &&
    user.value.email &&
    user.value.password &&
    user.value.passwordRepeat &&
    user.value.hasAgreedToTerms &&
    isPasswordEqual.value
  )
});

const isPasswordLongEnough = computed(() => user.value.password && user.value.password.length < 6);

const isPasswordEqual = computed(() => {
  if (isPasswordLongEnough.value || !user.value.passwordRepeat) return true;
  return user.value.passwordRepeat === user.value.password;
});

const submit = async () => {
  response.value.loading = true;
  try {
    response.value = await usePost('auth/register/org', user.value);
    addToast(response.value, toast);
    if (response.value.status === 200) {
      setTimeout(() => {
        router.push({ name: 'signin' });
      }, 5000);
    }
  } catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <Toast class="max-w-96" />
  <section class="-mb-40 pb-10 max-w-80 md:max-w-[30rem]">
    <h1 class="font-bold text-3xl">Business/Organization Account</h1>
    <p>
      Got an account already?
      <RouterLink :to="{ name: 'signin' }" class="text-accent hover:underline">Sign in</RouterLink>
      instead.
    </p>

    <div class="mt-5 grid gap-6 md:grid-cols-2">
      <InputText v-model="user.name" class="w-full md:col-span-2" placeholder="Business or Organization Name" />

      <Dropdown v-model="user.country" filter :options="countries" option-label="name" checkmark
        :highlightOnSelect="false" class="w-full" placeholder="Country" />

      <InputText v-model="user.region" class="w-full" placeholder="State or Region Located" />

      <InputText v-model="user.address" class="w-full md:col-span-2" placeholder="Office Address" />

      <Textarea v-model="user.businessDescription" rows="5" cols="30" class="w-full md:col-span-2 resize-none"
        placeholder="Brief Description of Buiness or Organization" />

      <InputText v-model="user.email" class="w-full md:col-span-2" placeholder="Email" />

      <Password v-model="user.password" toggleMask input-class="w-full" placeholder="Password" />

      <small v-show="isPasswordLongEnough" class="-mt-5 md:hidden text-xs text-red-500">Password must be at least 6
        characters
        long.</small>

      <Password v-model="user.passwordRepeat" toggleMask :feedback="false" input-class="w-full"
        placeholder="Confirm Password" />

      <small v-show="!isPasswordEqual" class="-mt-5 md:text-right md:col-span-2 text-xs text-red-500">Passwords do not
        match!</small>

      <small v-show="isPasswordLongEnough" class="hidden md:block -mt-5 text-xs text-red-500">Password must be at least
        6 characters
        long.</small>

      <div class="md:col-span-2 flex gap-2">
        <Checkbox v-model="user.hasAgreedToTerms" binary />
        <small>
          I agree to the
          <RouterLink to="/legal/terms-and-conditions" class="text-accent font-semibold hover:underline">
            Terms and Conditions
          </RouterLink>
          of Ofriend Edu and I give my consent to their
          <RouterLink to="/legal/privacy-policy" class="text-accent hover:underline font-semibold">
            Privacy Policy</RouterLink>.
        </small>
      </div>

      <Button @click="submit" :loading="response.loading" :disabled="!isSubmissionValid" label="Sign up"
        icon="pi pi-arrow-right" icon-pos="right" class="btn" />
    </div>

    <hr class="my-5" />

    <p>
      Click
      <RouterLink :to="{ name: 'signup' }" class="text-accent font-semibold hover:underline">here</RouterLink>
      to create a personal Ofriend account.
    </p>
  </section>
</template>

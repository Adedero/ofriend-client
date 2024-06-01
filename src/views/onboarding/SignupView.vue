<script setup>
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
</script>

<template>
  <section class="max-w-80 md:max-w-[30rem]">
    <h1 class="font-bold text-3xl">Create Account</h1>
    <p>Got an account already?
      <RouterLink :to="{ name: 'signin' }" class="text-accent hover:underline">Sign in</RouterLink>
      instead.
    </p>

    <div class="mt-5 grid gap-6 md:grid-cols-2">
      <InputText class="w-full md:col-span-2" placeholder="Full Name" />

      <Calendar dateFormat="dd/mm/yy" class="w-full" placeholder="Date of Birth" />

      <Dropdown class="w-full" placeholder="Gender" />

      <Dropdown checkmark :highlightOnSelect="false" class="w-full" placeholder="Country" />

      <InputText class="w-full" placeholder="State or Region" />

      <InputText class="w-full md:col-span-2" placeholder="Email" />

      <Password toggleMask input-class="w-full" placeholder="Password" />

      <Password toggleMask :feedback="false" input-class="w-full" placeholder="Confirm Password" />

      <div class="md:col-span-2 flex gap-2">
        <Checkbox binary />
        <small>
          I agree to the <RouterLink to="/legal/terms-and-conditions" class="text-accent font-semibold hover:underline"> Terms and Conditions
          </RouterLink> of Ofriend Edu and I give my consent to their <RouterLink to="/legal/privacy-policy" class="text-accent hover:underline font-semibold"> Privacy Policy</RouterLink>.
        </small>
      </div>

      <Button label="Sign up" icon="pi pi-arrow-right" icon-pos="right" class="btn" />

    </div>

    <hr class="my-5">

    <p>Click
      <RouterLink :to="{ name: 'signup-org' }" class="text-accent font-semibold hover:underline">here</RouterLink>
      to create an Ofriend account for a business or
      organization.
    </p>
  </section>
</template>

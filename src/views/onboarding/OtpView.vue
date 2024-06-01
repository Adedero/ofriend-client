<script setup>
import InputOtp from 'primevue/inputotp';
import Button from 'primevue/button';
</script>

<template>
  <section class="max-w-80">
    <h1 class="font-bold text-3xl">Verify Email Address</h1>
    <p class="mt-3">
      Enter the OTP sent to your email <span class="font-semibold">john*******@gmail.com</span>.
    </p>

    <div class="mt-10 grid gap-6">
      <InputOtp :length="6" integer-only mask class="flex gap-4 justify-between w-full" />

      <p class="text-center">
        Didn't get the code? <button class="text-accent hover:underline">Resend in 56s</button>
      </p>

      <Button label="Confirm" icon="pi pi-check-square" icon-pos="right" class="btn" />
    </div>
  </section>
</template>

<style>
.p-inputotp-input {
  width: 100%;
}
</style>

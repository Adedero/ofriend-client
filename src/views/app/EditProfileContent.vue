<script setup>
import { useRouter } from 'vue-router';
import { useGet } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const { data: user } = await useGet('api/get-full-profile/', { router, toast });

</script>

<template>
  <main class="relative">
    <Toast class="max-w-96" />

    <div class="flex items-center gap-2 cursor-context-menu sticky top-0 bg-white z-10">
      <span class="pi pi-user-edit" style="font-size: 1.2rem;"></span>
      <h1 class="font-bold text-lg">Edit Profile</h1>
    </div>

    <div v-if="user" class="mt-3 flex flex-col gap-6">
      <NameChange :user />
      <EmailChange :user />
      <BusinessDetailsChange v-if="user.isOrg" :user />
      <BirthdayChange v-if="!user.isOrg" :user />
      <GenderChange v-if="!user.isOrg" :user />
      <CountryChange :user />
      <AddressChange :user />
      <Divider />
      <BlockedUsers :user />
      <SubscriptionList :user />
      <Divider />
      <PasswordChange :user />
      <Divider />
      <DeleteAccount />
    </div>
  </main>
</template>
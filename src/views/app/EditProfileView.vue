<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGet } from '@/composables/utils/use-fetch';
const router = useRouter();

const user = ref(null);
const getFullProfile = async () => {
  try {
    const { status, data, error } = await useGet('api/get-full-profile/');
    //console.log(data.value);
    if (error.value) return router.push('/500');
    if (status.value === 401 && data.value.authMessage) return router.push({ name: 'signin' });
    if (status.value !== 200) return router.push('/404');
    user.value = data.value;
  } catch (error) {
    console.log(error);
    router.push('/500');
  }
}

onMounted(async () => await getFullProfile());
</script>

<template>
  <main class="relative">
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
      <SubscriptionList />
      <Divider />
      <PasswordChange :user />
      <Divider />
      <DeleteAccount />
    </div>


    <div v-else>
      <div v-for="i in 2" :key="i" class="mb-6">
        <div class="flex items-center gap-3">
          <Skeleton width="6rem" height="1.5rem" />
          <Skeleton shape="circle" height="2.5rem" width="2.5rem" />
        </div>
        <Skeleton width="100%" height="2.5rem" class="mt-1" />
      </div>
    </div>
  </main>
</template>
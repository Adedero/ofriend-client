<script setup>
import { ref } from 'vue';
import { useToastError } from '@/composables/utils/add-toast';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { usePost } from '@/composables/utils/use-fetch';

const props = defineProps({
  user: { type: Object, required: true }
});

//const emit = defineEmits(['onSubscribeToggle'])

const toast = useToast();

const isSubscribed = ref(props.user.viewerIsSubscribedToUser);
const loading = ref(false);
const toggleSubscription = async () => {
  loading.value = true;
  try {
    const { error, data , status } = await usePost(`api/toggle-user-subscribe/${props.user._id}`, {}, 'PUT');
    if (error.value || status.value !== 200) {
      console.log(error.value);
      useToastError(toast, error.value, 500)
      return;
    }
    isSubscribed.value = data.value.isSubscribed;
    //emit('onSubscribeToggle', data.value.isSubscribed)
  } catch (error) {
    useToastError(toast, error)
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <Toast class="max-w-96" />
    <Button @click="toggleSubscription" :loading severity="secondary" :label="isSubscribed ? 'Unsubscribe' : 'Suscribe'"
      :icon="isSubscribed ? 'pi pi-bell-slash' : 'pi pi-bell'" size="small" class="hidden md:flex h-10 text-sm lg:text-base mt-2" />

    <Button @click="toggleSubscription" :loading severity="secondary"
      :icon="isSubscribed ? 'pi pi-bell-slash' : 'pi pi-bell'" size="small" class="h-10 md:hidden text-sm mt-2" />
  </div>
</template>
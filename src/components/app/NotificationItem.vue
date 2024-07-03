<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { usePost } from '@/composables/server/use-fetch';
import { timeAgo } from '@/composables/utils/formats';

const props = defineProps({ notification: { type: Object, required: true } });

const emit = defineEmits(['deleteNotification']);

const router = useRouter();
const toast = useToast();

const deleteNotification = async (id) => {
  await usePost(`api/delete-notification/${id}`, { method: 'DELETE', router, toast });
  emit('deleteNotification', id);
}

const menu = ref(null);
const items = [
  { label: 'Remove', icon: 'pi pi-trash', command: () => deleteNotification(props.notification._id) }
]

const toggle = (event) => menu.value.toggle(event);
</script>

<template>
  <div class="flex-shrink-0 flex items-center gap-2 justify-between">
    <Toast class="max-w-96" />

    <div @click="$router.push(`${notification.link}`)" class="cursor-pointer flex items-center gap-2">
      <DynamicAvatar shape="circle" :user="notification.fromUser" class="flex-shrink-0 w-20 h-20 text-3xl font-light" />

      <div>
        <p class="font-semibold text-sm">{{ notification.fromUser.name }}</p>
        <p>{{ notification.description }}</p>
        <p class="text-slate-500 text-sm">{{ timeAgo(notification.createdAt) }}</p>
      </div>
    </div>

    <Button @click="toggle" icon="pi pi-ellipsis-v" text size="small" rounded />
    <Menu ref="menu" popup :model="items" />
  </div>
</template>
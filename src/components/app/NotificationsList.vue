<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useGet, usePost } from '@/composables/server/use-fetch';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog'

const confirm = useConfirm();

const router = useRouter();
const toast = useToast();

const limit = 10;

const { data: notifications } = await useGet(`api/get-notifications?skip=0&limit=${limit}`, { router, toast });

const notificationsLength = computed(() => notifications.value.length);

const allLoaded = ref(false);
const isLoading = ref(false);

const loadMoreNotifications = async () => {
  isLoading.value = true;
  await useGet(`api/get-notifications?skip=${notificationsLength.value}&limit=${limit}`,
  { router, toast },
  (alerts) => {
    notifications.value.push(...alerts);
    if (alerts.length < limit) allLoaded.value = true;
  });
  isLoading.value = false;
}


const loading = ref(false);

const clearAllNotifications = async () => {
  if (!notifications.value.length) return;
  loading.value = true;
  await usePost('api/clear-all-notifications', { method: 'DELETE', router, toast }, () => {
    notifications.value = [];
  });
  loading.value = false;
}

const handleNotificationDelete = (id) => notifications.value = notifications.value.filter(n => n._id !== id);

const handleScroll = (event) => {
  const { scrollHeight, clientHeight, scrollTop } = event.target;
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    !allLoaded.value && loadMoreNotifications();
  }
}

const confirmClear = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Clear notifications',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancel',
    rejectIcon: 'pi pi-times',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Clear',
    acceptIcon: 'pi pi-trash',
    accept: () => {
      clearAllNotifications();
    }
  });
}

</script>

<template>
  <div>
    <Toast class="max-w-96" />
    <ConfirmDialog />
    <div class="flex items-center justify-between gap-2">
      <p class="font-semibold">New</p>
      <Button v-show="notifications.length > 0" @click="confirmClear()" :loading label="Clear all" icon="pi pi-trash"
        severity="danger" size="small" text />
    </div>

    <div @scroll="handleScroll" class="max-h-[75dvh] overflow-y-auto flex flex-col gap-4">
      <NotificationItem v-for="notification in notifications" :key="notification._id" :notification
        @deleteNotification="handleNotificationDelete" />

      <div v-if="isLoading" class="grid place-content-center">
        <span class="pi pi-spinner pi-spin text-primary" style="font-size: 1.2rem"></span>
      </div>
    </div>
  </div>
</template>
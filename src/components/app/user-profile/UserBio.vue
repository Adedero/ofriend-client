<script setup>
import { usePost } from '@/composables/utils/use-fetch';
import { computed, ref } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['onBioUpdated']);

const toast = useToast();
const userStore = useUserStore();

const textarea = ref(null);
const editedBio = ref(props.user.bio);

const MAX_WORD_COUNT = 250;

const wordCount = computed(() => editedBio.value?.length?? 0)
const isEditing = ref(false);

const loading = ref(false);
const saveBio = async () => {
  loading.value = true;
  try {
    const { status, data, error } = await usePost('api/update-bio', { bio: editedBio.value }, 'PUT');
    if (error.value) {
      return toast.add({severity: 'error', summary: 'Error', detail: 'Something went wrong. Please, try again later'});
    }
    if (status.value !== 200) {
      return toast.add({ severity: 'warn', detail: data.value.message, life: 5000 });
    }
    isEditing.value = false;
    userStore.setUser({
      ...userStore.user,
      bio: editedBio.value
    })
    emit('onBioUpdated', editedBio.value);
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please, try again later' });
  } finally {
    loading.value = false;
  }
}

const menu = ref(null);
const items = [
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      isEditing.value = true;
      textarea.value.focus();
    }
  }
]

const toggle = (event) => menu.value.toggle(event);
</script>

<template>
  <div>
    <Toast class="max-w-96" />

    <div class="flex items-center gap-2 justify-between">
      <p class="font-semibold">Bio</p>
      <Button v-if="user.isViewingSelf" @click="toggle" text icon="pi pi-ellipsis-v" rounded size="small" />
    </div>

    <div v-if="isEditing">
      <Textarea ref="textarea" v-model="editedBio" maxlength="250" rows="6" auto-resize
        class="bg-soft-gray-2 focus:bg-white w-full max-h-[200px]" />
      <small>Word count: {{ wordCount }}/ {{ MAX_WORD_COUNT }}</small>

      <div class="grid grid-cols-2 gap-2 mt-2">
        <Button @click="isEditing = false" severity="secondary" label="Cancel" size="small" icon="pi pi-times"
          class="block" />
        <Button @click="saveBio" :loading label="Save" icon="pi pi-check" size="small" class="block btn" />
      </div>
    </div>

    <p v-else class="text-sm whitespace-pre">{{ user.bio }}</p>
    <Menu ref="menu" :model="items" :popup="true" />
  </div>
</template>

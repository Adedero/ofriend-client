<script setup>
import { usePost } from '@/composables/utils/use-fetch';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});
const userStore = useUserStore();

const isEditing = ref(false);
const editedName = ref(props.user.name);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const updateName = async () => {
  if (editedName.value === props.user.name || !editedName.value) return;
  loading.value = true;
  try {
    const { status, data } = await usePost('api/change-name', { name: editedName.value }, 'PUT');
    //console.log(data.value);
    if (status. value !== 200) {
      error.value = true;
      errorMessage.value = data.value.message;
      cancelEdit();
    }
    userStore.setUser({
      ...userStore.user,
      name: editedName.value
    })
    isEditing.value = false;
  } catch (err) {
    console.error(err);
    error.value = true;
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
}

const cancelEdit = () => {
  isEditing.value = false;
  editedName.value = props.user.name;
};
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <p class="font-semibold">Name</p>
      <Button v-if="!isEditing" @click="isEditing = true" icon="pi pi-pencil" rounded severity="secondary" />

      <div v-else class="flex items-center gap-3">
        <Button icon="pi pi-check" @click="updateName" rounded outlined severity="success" :loading />
        <Button v-if="!loading" icon="pi pi-times" @click="cancelEdit" rounded outlined severity="danger" />
      </div>
    </div>

    <div class="mt-1">
      <p class="text-blue-500 font-medium mb-1">You can only change your name once every 60 days.</p>
      <InputText v-model="editedName" :readOnly="!isEditing" class="p-3 w-full" />
      <small v-if="error" class="text-red-500">{{ errorMessage }}</small>
    </div>
  </div>
</template>
<script setup>
import { usePost } from '@/composables/utils/use-fetch';
import { ref } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const isEditing = ref(false);
const editedAddress = ref(props.user.address);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

const updateAddress = async () => {
  if (!editedAddress.value || (editedAddress.value === props.user.address)) return;
  loading.value = true;
  try {
    const { status, data } = await usePost('api/change-address', { address: editedAddress.value }, 'PUT');
    //console.log(data.value);
    if (status.value !== 200) {
      error.value = true;
      errorMessage.value = data.value.message;
      cancelEdit();
    }
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
  editedAddress.value = props.user.email;
};
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <p class="font-semibold">Address</p>
      <Button v-if="!isEditing" @click="isEditing = true" icon="pi pi-pencil" rounded severity="secondary" />

      <div v-else class="flex items-center gap-3">
        <Button icon="pi pi-check" @click="updateAddress" rounded outlined severity="success" :loading />
        <Button v-if="!loading" icon="pi pi-times" @click="cancelEdit" rounded outlined severity="danger" />
      </div>
    </div>

    <div class="mt-1">
      <Textarea v-model="editedAddress" rows="1" :readOnly="!isEditing" auto-resize maxlength="300" class="p-3 w-full max-h-40" />
      <small v-if="error" class="text-red-500">{{ errorMessage }}</small>
    </div>
  </div>
</template>
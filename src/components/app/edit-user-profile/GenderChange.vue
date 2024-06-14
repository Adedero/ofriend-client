<script setup>
import { usePost } from '@/composables/utils/use-fetch';
import { ref } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const gender = ref(props.user.gender.charAt(0).toUpperCase() + props.user.gender.slice(1));

const isEditing = ref(false);
const editedGender = ref('');
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

const updateGender = async () => {
  if (!editedGender.value || (editedGender.value === gender.value)) return;
  loading.value = true;
  try {
    const { status, data } = await usePost('api/change-gender', { gender: editedGender.value.toLowerCase() }, 'PUT');
    //console.log(data.value);
    if (status.value !== 200) {
      error.value = true;
      errorMessage.value = data.value.message;
      cancelEdit();
    }
    gender.value = editedGender.value;
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
  editedGender.value = gender.value;
};
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <p class="font-semibold">Gender</p>
      <Button v-if="!isEditing" @click="isEditing = true" icon="pi pi-pencil" rounded severity="secondary" />

      <div v-else class="flex items-center gap-3">
        <Button icon="pi pi-check" @click="updateGender" rounded outlined severity="success" :loading />
        <Button v-if="!loading" icon="pi pi-times" @click="cancelEdit" rounded outlined severity="danger" />
      </div>
    </div>

    <div class="mt-1">
      <p v-if="!isEditing" class="p-3 w-full border rounded-lg">{{ gender }}</p>

      <Dropdown v-else v-model="editedGender" :options="['Female', 'Male', 'Other']" class="w-full"
        placeholder="Select gender" />
      <small v-if="error" class="text-red-500">{{ errorMessage }}</small>
    </div>
  </div>
</template>


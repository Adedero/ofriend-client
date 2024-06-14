<script setup>
import { usePost } from '@/composables/utils/use-fetch';
import { ref } from 'vue';
import { formatDate } from '@/composables/utils/formats';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const birthday = ref(formatDate(props.user.birthday));
const isEditing = ref(false);
const editedBirthday = ref('');
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

const updateBirthday = async () => {
  if (!editedBirthday.value) return;
  const initialBirthday = formatDate(props.user.birthday);
  const updatedBirthday = formatDate(editedBirthday);
  const isUnchanged = (updatedBirthday === initialBirthday);

  if (isUnchanged) return;
  loading.value = true;
  try {
    const { status, data } = await usePost('api/change-birthday', { birthday: editedBirthday.value }, 'PUT');
    //console.log(data.value);
    if (status.value !== 200) {
      error.value = true;
      errorMessage.value = data.value.message;
      cancelEdit();
    }
    birthday.value = formatDate(editedBirthday.value);
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
  editedBirthday.value = '';
};
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <p class="font-semibold">Birthday</p>
      <Button v-if="!isEditing" @click="isEditing = true" icon="pi pi-pencil" rounded severity="secondary" />

      <div v-else class="flex items-center gap-3">
        <Button icon="pi pi-check" @click="updateBirthday" rounded outlined severity="success" :loading />
        <Button v-if="!loading" icon="pi pi-times" @click="cancelEdit" rounded outlined severity="danger" />
      </div>
    </div>

    <div class="mt-1">
      <p v-if="!isEditing" class="p-3 w-full border rounded-lg">{{ birthday }}</p>
      <Calendar v-else v-model="editedBirthday" dateFormat="dd/mm/yy" placeholder="Enter birthday" class="w-full" input-class="p-3" />
      <small v-if="error" class="text-red-500">{{ errorMessage }}</small>
    </div>
  </div>
</template>


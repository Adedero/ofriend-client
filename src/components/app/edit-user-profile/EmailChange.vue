<script setup>
import { usePost } from '@/composables/utils/use-fetch';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const isEditing = ref(false);
const editedEmail = ref(props.user.email);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

const updateEmail = async () => {
  if (editedEmail.value === props.user.email || !editedEmail.value) return;
  loading.value = true;
  try {
    const { status, data } = await usePost('api/change-email', { email: editedEmail.value }, 'PUT');
    //console.log(data.value);
    if (status.value !== 200) {
      error.value = true;
      errorMessage.value = data.value.message;
      cancelEdit();
    }
    isEditing.value = false;
    router.push({ name: 'signin' });
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
  editedEmail.value = props.user.email;
};
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <p class="font-semibold">Email</p>
      <Button v-if="!isEditing" @click="isEditing = true" icon="pi pi-pencil" rounded severity="secondary" />

      <div v-else class="flex items-center gap-3">
        <Button icon="pi pi-check" @click="updateEmail" rounded outlined severity="success" :loading />
        <Button v-if="!loading" icon="pi pi-times" @click="cancelEdit" rounded outlined severity="danger" />
      </div>
    </div>

    <div class="mt-1">
      <p class="text-blue-500 font-medium mb-1">You would need to verify your account once your email has been changed.</p>
      <InputText v-model="editedEmail" :readOnly="!isEditing" class="p-3 w-full" />
      <small v-if="error" class="text-red-500">{{ errorMessage }}</small>
    </div>
  </div>
</template>
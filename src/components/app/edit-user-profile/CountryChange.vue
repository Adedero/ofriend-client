<script setup>
import { ref } from 'vue';
import countries from '@/data/countries';
import { usePost } from '@/composables/utils/use-fetch';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const location = ref(`${props.user.region}, ${props.user.country}`);
const editedCountry = ref({});
const editedRegion = ref('')

const isEditing = ref(false);

const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

const updateLocation = async () => {
  if (!editedCountry.value.name || !editedRegion.value || (editedCountry.value.name === location.value.split(',')[1].trim()) || (editedRegion.value === location.value.split(',')[0].trim())) return;
  loading.value = true;
  try {
    const { status, data } = await usePost('api/change-country-and-region', {
      country: editedCountry.value.name,
      region: editedRegion.value
    }, 'PUT');
    //console.log(data.value);
    if (status.value !== 200) {
      error.value = true;
      errorMessage.value = data.value.message;
      cancelEdit();
    }
    location.value = `${editedCountry.value.name}, ${editedRegion.value}`
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
  editedCountry.value = {};
  editedRegion.value = '';
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <p class="font-semibold">Location</p>
      <Button v-if="!isEditing" @click="isEditing = true" icon="pi pi-pencil" rounded severity="secondary" />

      <div v-else class="flex items-center gap-3">
        <Button icon="pi pi-check" @click="updateLocation" rounded outlined severity="success" :loading />
        <Button v-if="!loading" icon="pi pi-times" @click="cancelEdit" rounded outlined severity="danger" />
      </div>
    </div>

    <div class="mt-1">
      <p v-if="!isEditing" class="p-3 w-full border rounded-lg">{{ location }}</p>

      <div v-else class="grid grid-cols-2 gap-3">
        <Dropdown v-model="editedCountry" filter :options="countries" option-label="name" checkmark
          :highlightOnSelect="false" class="w-full" placeholder="Country" />

        <InputText v-model="editedRegion" class="w-full" placeholder="State or Region" />
      </div>
      
      <small v-if="error" class="text-red-500">{{ errorMessage }}</small>
    </div>
  </div>
</template>

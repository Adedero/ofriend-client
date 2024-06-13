<script setup>
import { ref } from 'vue';

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  search: {
    type: String,
    required: true
  }
})

const input = ref('');

const isSearching = ref(true);
const allLoaded = ref(true);
const loading = ref(false);

const results = ref([]);

const searchUser = () => {
  console.log(props.userId);
  console.log(input.value);
};

const cancelSearch = () => {
  input.value = '';
  results.value = [];
  isSearching.value = false;
  allLoaded.value = true;
  loading.value = false;
};
</script>

<template>
  <div>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-search"></i>
      </InputGroupAddon>
      <InputText @keydown.enter="searchUser" v-model="input" placeholder="Search name" />
    </InputGroup>

    <div v-if="isSearching" class="mt-2 border-b pb-2">
      <div class="flex items-center justify-between">
        <p class="text-sm font-semibold">Search results</p>
        <Button @click="cancelSearch" rounded icon="pi pi-times-circle" text severity="danger" class="h-8 w-8" />
      </div>

      <Divider />
      <div v-if="results.length" id="results">

      </div>

      <p v-else class="text-center font-medium">No results found</p>

      <div v-if="!allLoaded" class="grid justify-center mt-2">
        <Button label="Load more" icon="pi pi-plus" outlined size="small" />
      </div>

    </div>
  </div>

</template>
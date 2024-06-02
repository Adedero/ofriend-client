<script setup>
import { ref } from 'vue';
import AttachmentButtons from '@/components/app/AttachmentButtons.vue';
const post = ref('');
</script>

<template>
  <div class="p-3 border rounded-md">
    <div class="flex flex-col gap-2 md:flex-row">
      <div class="flex items-center justify-between md:block">
        <img src="../../assets/images/default-profile-img.png" alt="default profile image"
          class="w-10 aspect-square rounded-full object-cover">

        <div class="md:hidden">
          <AttachmentButtons />
        </div>
      </div>

      <div class="flex-grow">
        <Editor v-model="post" editorStyle="max-height: 400px; font-size: 1rem; overflow-y: auto">
          <template v-slot:toolbar>
            <span class="ql-formats">
              <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
              <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
              <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
            </span>
          </template>
        </Editor>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-end md:justify-between">
      <div class="hidden md:block">
        <AttachmentButtons />
      </div>

      <Button label="Post" icon="pi pi-angle-double-right" icon-pos="right" size="small"
        class="bg-primary border-primary hover:bg-primary-lighter transition-colors" />
    </div>
  </div>
</template>

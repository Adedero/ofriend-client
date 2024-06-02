<script setup>
defineEmits(['closeDialog'])
</script>

<template>
  <div class="px-1">
    <div class="flex items-center justify-between">
      <Button @click="$emit('closeDialog')" label="Back to post" size="small" text icon="pi pi-angle-left"
        class="text-sm p-1" />

      <div>
        <button class="hidden items-center gap-1">
          <span>File attached</span>
          <span class="pi pi-times-circle"></span>
        </button>

        <button class="p-1">
          <span class="pi pi-image"></span>
        </button>
      </div>
    </div>

    <div class="flex items-end gap-1">
      <Textarea rows="1" auto-resize placeholder="Say something..."
        class="bg-soft-gray border-none focus:bg-white text-sm max-h-16 flex-grow" />
      <button class="bg-primary p-1 text-white rounded-md h-9 w-10 grid place-content-center">
        <span class="pi pi-send"></span>
      </button>
    </div>
  </div>
</template>
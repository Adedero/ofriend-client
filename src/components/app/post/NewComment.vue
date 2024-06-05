
<template>
  <div class="p-1">
    <div class="flex items-center justify-between">
      <div>
        <button class="hidden items-center gap-1">
          <span>File attached</span>
          <span class="pi pi-times-circle"></span>
        </button>
      </div>
    </div>

    <div class="flex items-end gap-1">
      <CommentMediaAttachment />

      <Textarea rows="1" auto-resize placeholder="Say something..."
        class="bg-soft-gray border-none focus:bg-white text-sm max-h-16 flex-grow" />

        <Button icon="pi pi-send" class="btn h-9" />
    </div>
  </div>
</template>
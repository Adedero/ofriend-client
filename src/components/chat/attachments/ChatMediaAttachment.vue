<script setup>
import { ref } from 'vue'

const op = ref()
const toggle = (event) => op.value.toggle(event)
</script>

<template>
  <div>
    <Button @click="toggle" text severity="secondary" icon="pi pi-paperclip" />
    <OverlayPanel ref="op" :dismissable="false">
      <div class="grid grid-cols-3 gap-3">
        <ChatCameraAttachment @on-cancel-upload="toggle" />

        <ChatImageAttachment @on-cancel-upload="toggle" />

        <ChatVideoAttachment @on-cancel-upload="toggle" />

        <ChatAudioAttachment @on-cancel-upload="toggle" />

        <ChatDocumentAttachment />
      </div>
    </OverlayPanel>
  </div>
</template>

<style lang="scss" scoped></style>

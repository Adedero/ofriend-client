<script setup>
import { ref } from 'vue';
const emit = defineEmits(['onCameraFileSend', 'onImageFileSend', 'onVideoFileSend', 'onAudioFileSend', 'onDocumentFileSend']);

const onCameraFileSend = (data) => emit('onCameraFileSend', data);
const onImageFileSend = (data) => emit('onImageFileSend', data);
const onVideoFileSend = (data) => emit('onVideoFileSend', data);
const onAudioFileSend = (data) => emit('onAudioFileSend', data);
const onDocumentFileSend = (data) => emit('onDocumentFileSend', data);

const op = ref()
const toggle = (event) => op.value.toggle(event)
</script>

<template>
  <div>
    <Button @click="toggle" text severity="secondary" icon="pi pi-paperclip" />
    <OverlayPanel ref="op" :dismissable="false">
      <div class="grid grid-cols-3 gap-3">
        <ChatCameraAttachment @on-cancel-upload="toggle" @on-file-send="onCameraFileSend" />

        <ChatImageAttachment @on-cancel-upload="toggle" @on-file-send="onImageFileSend" />

        <ChatVideoAttachment @on-cancel-upload="toggle" @on-file-send="onVideoFileSend" />

        <ChatAudioAttachment @on-cancel-upload="toggle" @on-file-send="onAudioFileSend" />

        <ChatDocumentAttachment @on-cancel-upload="toggle" @on-file-send="onDocumentFileSend" />
      </div>
    </OverlayPanel>
  </div>
</template>

<style lang="scss" scoped></style>

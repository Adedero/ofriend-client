<script setup>
import { ref } from 'vue';

const isRecording = ref(false);
const isPaused = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const audioURL = ref(null);
const recordingTime = ref(0);
let recordingInterval = null;

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data);
    };

    mediaRecorder.value.onstop = () => {
      const blob = new Blob(audioChunks.value, { type: 'audio/wav' });
      audioURL.value = URL.createObjectURL(blob);
      audioChunks.value = [];
      clearInterval(recordingInterval);
      recordingTime.value = 0;
    };

    mediaRecorder.value.start();
    isRecording.value = true;
    recordingTime.value = 0;
    recordingInterval = setInterval(() => {
      recordingTime.value++;
    }, 1000);
  } catch (error) {
    console.error("Error accessing microphone: ", error);
    alert("Could not access your microphone. Please check your settings and try again.");
  }
}

const togglePlay = () => {
  if (mediaRecorder.value.state === 'recording') {
    mediaRecorder.value.pause();
    isPaused.value = true;
  } else if (mediaRecorder.value.state === 'paused') {
    mediaRecorder.value.resume();
    isPaused.value = false;
  }
}

const sendRecording = () => {
  mediaRecorder.value.stop();
  isRecording.value = false;
}

const deleteRecording = () => {
  mediaRecorder.value.stop();
  audioChunks.value = [];
  audioURL.value = null;
  isRecording.value = false;
  isPaused.value = false;
  clearInterval(recordingInterval);
  recordingTime.value = 0;
}
</script>

<template>
  <div class="relative">
    <div v-if="isRecording" class="fixed top-0 flex items-center gap-2">
      <Button @click="deleteRecording" severity="error" icon="pi pi-trash" />

      <div class="w-16">
        <div class="w-3 aspect-square rounded-full bg-red-500 animate-pulse"></div>
        <p>{{ Math.floor(recordingTime / 60) }}:{{ String(recordingTime % 60).padStart(2, '0') }}</p>
      </div>

      <Button @click="togglePlay" severity="secondary" :icon="isPaused ? 'pi pi-play' : 'pi pi-pause'" />

      <Button @click="sendRecording" icon="pi pi-send" />
    </div>

    <Button v-if="!isRecording" @click="startRecording" text severity="secondary" icon="pi pi-microphone" />

    <audio v-if="audioURL" :src="audioURL" controls></audio>
  </div>
</template>

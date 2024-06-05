<script setup>
import { onUnmounted, ref, watchEffect } from 'vue'
const emit = defineEmits(['onStop', 'onError', 'onDeleted'])

const isRecording = ref(false)
const isPaused = ref(false)
const isDeleting = ref(false)
const audioUrl = ref('')
const stream = ref(null)
const mediaRecorder = ref(null)
const audioChunks = ref([])
const recordingTime = ref(0)
let recordingInterval = null

const initializeMediaRecorder = () => {
  mediaRecorder.value = new MediaRecorder(stream.value)

  mediaRecorder.value.onerror = (error) => {
    clearInterval(recordingInterval)
    recordingTime.value = 0
    emit('onError', error)
    console.error(error)
  }

  mediaRecorder.value.onstart = () => {
    isRecording.value = true
    recordingInterval = setInterval(() => {
      recordingTime.value++
    }, 1000)
  }

  mediaRecorder.value.ondataavailable = (e) => {
    audioChunks.value.push(e.data)
  }

  mediaRecorder.value.onpause = () => {
    isPaused.value = true
    clearInterval(recordingInterval)
  }

  mediaRecorder.value.onresume = () => {
    isPaused.value = false
    recordingInterval = setInterval(() => {
      recordingTime.value++
    }, 1000)
  }

  mediaRecorder.value.onstop = () => {
    clearInterval(recordingInterval)
    recordingTime.value = 0
    isRecording.value = false

    if (isDeleting.value) {
      audioChunks.value = []
      isDeleting.value = false
      emit('onDeleted')
      stream.value.getTracks().forEach((track) => track.stop())
      stream.value = null
      mediaRecorder.value = null
      return
    }

    const blob = new Blob(audioChunks.value, {
      type: 'audio/webm;codecs=opus'
    })
    audioChunks.value = []
    audioUrl.value = URL.createObjectURL(blob)
    emit('onStop', {
      blob: blob,
      audioUrl: audioUrl.value
    })

    stream.value.getTracks().forEach((track) => track.stop())
    stream.value = null
    mediaRecorder.value = null
  }
}

const startRecording = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
    initializeMediaRecorder()
    mediaRecorder.value.start()
  } catch (error) {
    alert(error.message)
    console.error(error)
  }
}

const stopRecording = () => {
  mediaRecorder.value.stop()
}

const toggleRecord = () => {
  if (mediaRecorder.value && isPaused.value) {
    mediaRecorder.value.resume()
  } else if (mediaRecorder.value && !isPaused.value) {
    mediaRecorder.value.pause()
  } else {
    return
  }
}

const deleteRecording = () => {
  isDeleting.value = true
  isRecording.value = false
  isPaused.value = false
  clearInterval(recordingInterval)
  recordingTime.value = 0
  mediaRecorder.value.stop()
}

watchEffect(() => {
  if (recordingTime.value === 300) {
    mediaRecorder.value.stop()
  }
})

onUnmounted(() => {
  clearInterval(recordingInterval)
  recordingTime.value = 0
  if (mediaRecorder.value) {
    mediaRecorder.value.stop()
  }
})
</script>

<template>
  <div class="relative">
    <div
      v-if="isRecording"
      class="bottom-[4.5rem] left-0 cs-2:bottom-10 cs-2:right-[2rem] lg:right-[4.5rem] fixed bg-white shadow-lg border border-slate-500 rounded-full py-1 px-2 flex items-center gap-3 w-full cs-2:left-[unset] cs-2:w-[22rem] justify-between"
    >
      <Button
        @click="toggleRecord"
        severity="info"
        rounded
        :icon="isPaused ? 'pi pi-play' : 'pi pi-pause'"
        class="flex-shrink-0"
      />

      <div
        class="w-3 aspect-square rounded-full bg-red-500"
        :class="{ 'animate-pulse': isRecording && !isPaused }"
      ></div>

      <p>{{ Math.floor(recordingTime / 60) }}:{{ String(recordingTime % 60).padStart(2, '0') }}</p>

      <div v-if="!isPaused">
        <img src="../../assets/images/audio-wave.gif" alt="Recording..." class="h-12" />
      </div>

      <div v-else class="h-12 w-12 flex items-center justify-center">
        <div class="w-full border-[1.5px] border-blue-400"></div>
      </div>

      <Button
        @click="deleteRecording"
        rounded
        severity="danger"
        icon="pi pi-trash"
        class="flex-shrink-0"
      />

      <Button
        label="Send"
        @click="stopRecording"
        icon="pi pi-send"
        class="btn"
        style="border-radius: 999px"
      />
    </div>

    <div>
      <Button v-if="!isRecording" @click="startRecording" icon="pi pi-microphone" class="btn" />
    </div>
  </div>
</template>

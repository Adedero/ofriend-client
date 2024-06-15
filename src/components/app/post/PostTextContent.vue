}
</style>
<template>
  <div>
    <div ref="textContainer" :class="{ 'trunc': isTruncated }">{{ text }}</div>
    <Button v-if="showButton" @click="toggleText" size="small" severity="info" text class="mt-2">{{
      buttonText
    }}</Button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  }
})

const isTruncated = ref(true)
const showButton = ref(false)
const textContainer = ref(null)

const buttonText = computed(() => {
  return isTruncated.value ? 'Read More' : 'Show Less'
})

function toggleText() {
  isTruncated.value = !isTruncated.value
  // Ensure the styles are reapplied
  if (isTruncated.value) {
    textContainer.value.style.display = '-webkit-box'
  } else {
    textContainer.value.style.display = 'block'
  }
}

onMounted(() => {
  checkIfTextExceedsLines()
})

watch(
  () => props.text,
  () => {
    checkIfTextExceedsLines()
  }
)

function checkIfTextExceedsLines() {
  if (textContainer.value) {
    // Reset display to calculate natural height
    textContainer.value.style.display = 'block'
    textContainer.value.style.maxHeight = 'none'
    const lineHeight = parseFloat(getComputedStyle(textContainer.value).lineHeight)
    const maxHeight = lineHeight * 8
    if (textContainer.value.scrollHeight > maxHeight) {
      showButton.value = true
      textContainer.value.style.display = '-webkit-box'
    } else {
      showButton.value = false
    }
  }
}
</script>

<style scoped>
.trunc {
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.5em * 8);
  line-height: 1.5em;
}
</style>

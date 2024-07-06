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
    const lineHeight = parseFloat(getComputedStyle(textContainer.value).lineHeight);
    const maxHeight = lineHeight * 5
    if (textContainer.value.scrollHeight > maxHeight) {
      showButton.value = true
      textContainer.value.style.display = '-webkit-box'
    } else {
      showButton.value = false
    }
  }
}
</script>

<template>
  <div>
    <div ref="textContainer" v-html="text" class="whitespace-pre-wrap" :class="{ reduced: isTruncated }"></div>

    <Button v-if="showButton" @click="toggleText" size="small" severity="info" text class="mt-2">{{
      buttonText
    }}</Button>
  </div>
</template>


<style scoped>
.reduced {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

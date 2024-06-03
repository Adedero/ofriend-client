<script setup>
import { onMounted, ref } from "vue";
const convoBox = ref()
onMounted(() => {
  convoBox.value.scrollTop = convoBox.value.scrollHeight;
})
</script>


<template>
  <section class="mt-2 h-[calc(100dvh-5rem)]">
    <div ref="convoBox" class="h-full overflow-y-scroll">
      <ChatBox />
      <NewChat />
    </div>
  </section>
</template>
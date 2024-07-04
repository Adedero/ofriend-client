<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const visible = ref(false);

const popup = ref(null);
const popupStyle = ref({});

const show = (event) => {
  if (visible.value) return;
  visible.value = true;
  if (!popup.value) return;
  const { innerWidth, innerHeight } = window;
  const targetRect = event.target.getBoundingClientRect();
  const popupRect = popup.value.getBoundingClientRect();

  let top = targetRect.bottom;
  let left = targetRect.left;

  // Adjust if the popup is too close to the right
  if (targetRect.left + popupRect.width > innerWidth) {
    left = targetRect.right - popupRect.width;
  }

  // Adjust if the popup is too close to the bottom
  if (targetRect.bottom + popupRect.height > innerHeight) {
    top = targetRect.top - popupRect.height;
  }

  // Adjust if the popup is too close to the left
  if (left < 0) {
    left = targetRect.left;
  }

  // Adjust if the popup is too close to the top
  if (top < 0) {
    top = targetRect.bottom;
  }

  popupStyle.value = {
    top: `${top + 5}px`,
    left: `${left + 5}px`
  };

}

const hide = () => visible.value = false;

const toggle = (event) => {
  visible.value ? visible.value = false : show(event)
};

defineExpose({ show, hide, toggle });

// Recalculate position on window resize
const handleResize = () => visible.value = false;

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div v-if="visible" ref="popup" :style="popupStyle" :class="['popup', visible ? 'block' : 'hidden']">
    <slot></slot>
  </div>
</template>


<style scoped>
.popup {
  @apply bg-white border shadow rounded-lg z-50 p-2 absolute
}
</style>

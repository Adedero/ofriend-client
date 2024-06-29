<script setup>
import { ref, watch } from 'vue';

// Define props
const props = defineProps({
  rows: { type: String, default: "3" },
  cols: { type: String },
  placeholder: { type: String },
  inputClass: { type: String },
  inputStyle: { type: String },
  inputId: { type: String },
  maxRows: { type: Number, default: 0 },
  autoResize: { type: Boolean, default: false },
  fluid: { type: Boolean, default: false },
  enterIsSend: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  noResize: { type: Boolean, default: true }
});

// Define emits
const emit = defineEmits(['update:modelValue']);

// Reactive text property
const text = ref(props.modelValue);

// Watch for changes in modelValue
watch(() => props.modelValue, (newValue) => {
  text.value = newValue;
});


// Function to check if an element is scrollable
function isScrollable(el) {
  return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
}

const handleInput = (event) => {
  if (props.autoResize && props.maxRows) {
    const el = event.target;

    if (isScrollable(el) && props.maxRows > el.rows) {
      el.rows += 1;
    }
    if (!el.value) {
      el.rows = props.rows;
    }
  }

  text.value = event.target.value;
  emit('update:modelValue', text.value);
}
</script>

<template>
  <textarea v-model="text" @input="handleInput" :id="inputId" :rows="rows" :cols="cols" :placeholder="placeholder"
    class="v-textbox" :class="[fluid ? 'w-full' : '', 'w-full', noResize ? 'resize-none' : '', inputClass]"
    :style="inputStyle">
  </textarea>
</template>


<style scoped>
.v-textbox {
  @apply outline-none border rounded-md border-slate-400 bg-soft-gray-2 py-2 px-3 focus:bg-white transition-colors shadow-sm;
}
</style>

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
  if (newValue === '') {
    resetTextareaRows();
  }
});

// Function to reset textarea rows
const resetTextareaRows = () => {
  const textarea = document.getElementById(props.inputId);
  if (textarea) {
    textarea.rows = props.rows;
  }
};

const handleInput = (event) => {
  if (props.autoResize && props.maxRows) {
    const el = event.target;

    // Reset the rows to the initial value to get accurate scrollHeight
    el.rows = props.rows;

    // Calculate the new height based on scrollHeight
    const newRows = Math.min(Math.ceil(el.scrollHeight / 40), props.maxRows); // 24 is a typical line height in px

    // Set the new rows value
    el.rows = newRows;
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

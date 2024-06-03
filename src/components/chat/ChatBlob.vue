<template>
  <div :class="[
      ' p-2 text-[0.9rem] cs-2:text-sm rounded-lg w-fit max-w-[80%] cs-2:max-w-[50%]',
      user === 'sender' ? 'bg-primary justify-self-end rounded-br-none text-white' : '',
      user === 'receiver' ? 'bg-accent/20 rounded-bl-none text-primary' : ''
    ]">
    <div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde magni exercitationem aliquam aperiam officia neque
        ipsum dolorem.
      </div>

      <div class="flex items-center justify-end gap-4">
        <p class="text-[0.65rem] text-right">10:45PM</p>

        <div v-if="user === 'sender'" class="text-accent">
          <span class="pi pi-check" style="font-weight: 600; font-size: 0.75rem"></span>
          <span v-if="seen" class="pi pi-check -translate-x-2" style="font-weight: 600; font-size: 0.75rem"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: String,
    required: true
  },
  sent: {
    type: Boolean
  },
  seen: {
    type: Boolean
  }
});
</script>
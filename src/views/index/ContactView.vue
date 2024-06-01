<script setup>
import ContactUsForm from '@/components/contact/ContactUsForm.vue';
import socials from '@/data/socials.js';
const steps = [
  { id: 1, detail: 'Send us a message properly stating your issue or your opinion on how to serve you better.' },
  { id: 2, detail: 'Wait for a reply within 24 hours.' },
  { id: 3, detail: 'If you haven’t gotten a reply, contact us directly through our social media platforms.' }
]

</script>

<template>
  <section class="py-10">
    <h1 class="font-bold text-2xl text-center">Contact Us</h1>

    <div class="mt-10 pb-10 grid gap-10 px-5 lg:px-20 lg:gap-20 lg:grid-cols-2">
      <div class="lg:pr-10">
        <p class="text-center lg:text-left">
          Lorem ipsum dolor sit amet consectetur. Varius faucibus a risus fermentum lectus. Tristique maecenas justo non
          elementum lectus integer dictum suspendisse lacus non.
        </p>

        <div class="flex items-center justify-center gap-3 flex-wrap mt-3 lg:justify-normal">
          <a v-for="social in socials" :key="social.name" :href="social.link">
            <span :class="[social.icon, 'p-2 rounded hover:bg-soft-blue']" style="font-size: 1.3rem"></span>
          </a>
        </div>
      </div>
    </div>

    <div class="relative bg-primary py-10 px-5 grid gap-5 md:grid-cols-2 lg:pb-20 lg:px-20 lg:gap-20">
      <div class="lg:pr-10">
        <h1 class="font-bold text-2xl text-white">Follow these steps</h1>

        <ul class="text-white text-sm mt-5">
          <li v-for="step, index in steps" :key="step.id" class="flex gap-5">
            <div class="flex flex-col items-center">
              <div class="flex-shrink-0 w-4 aspect-square bg-white border-[4px] border-accent rounded-full"></div>
              <div :class="[index === steps.length - 1 ? 'hidden': 'bg-accent w-[1px] h-full']"></div>
            </div>

            <div class="flex gap-2 pb-10">
              <p>{{ step.id }}.</p>
              <p>{{ step.detail }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="lg:absolute lg:right-20 lg:-top-40">
        <ContactUsForm />
      </div>
    </div>

  </section>
</template>


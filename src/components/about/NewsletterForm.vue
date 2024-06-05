<script setup></script>

<template>
  <section class="bg-primary px-5 py-10 grid place-content-center text-white">
    <div class="max-w-[32rem] grid gap-6 place-content-center">
      <h1 class="font-bold text-2xl text-center">Suscribe to our Newsletter</h1>

      <p class="text-center">
        Stay updated with our latest updates, new features and exciting packages by inputting your
        email below.
      </p>

      <div class="flex justify-center">
        <label for="email" class="hidden"></label>
        <input
          type="email"
          id="email"
          class="bg-transparent border rounded-l px-2 py-2 outline-none"
        />

        <button
          type="button"
          class="flex items-center justify-center gap-2 rounded-r border border-white bg-white text-primary font-semibold px-5 py-1"
        >
          <span class="text-sm">Submit</span>
          <span class="pi pi-arrow-right" style="font-size: 0.75rem; font-weight: bolder"></span>
        </button>
      </div>
    </div>
  </section>
</template>

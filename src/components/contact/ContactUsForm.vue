<template>
  <div
    class="bg-white py-8 px-5 rounded md:py-10 md:px-8 md:max-w-[30rem] lg:shadow-lg lg:shadow-primary"
  >
    <div>
      <h3 class="font-bold">Get in touch with us.</h3>
      <p class="font-light">We value your opinion</p>
    </div>

    <form class="mt-6 grid gap-5 md:grid-cols-2">
      <input type="text" placeholder="First Name" class="contact-form" />

      <input type="text" placeholder="Last Name" class="contact-form" />

      <input type="email" placeholder="Email" class="contact-form" />

      <input type="text" placeholder="Phone Number" class="contact-form" />

      <textarea
        cols="30"
        rows="7"
        placeholder="Message"
        style="resize: none"
        class="md:col-span-2 contact-form"
      ></textarea>

      <button
        type="submit"
        class="flex items-center justify-center gap-2 rounded-md transition-colors bg-primary hover:bg-primary-lighter text-white px-5 py-2.5"
      >
        <span>Send</span>
        <span class="pi pi-send"></span>
      </button>
    </form>
  </div>
</template>

<style scoped>
input.contact-form,
textarea.contact-form {
  @apply outline-none border border-stone-400 rounded-md p-2 transition-colors hover:shadow focus:border-primary-lighter placeholder:text-text-light;
}
</style>

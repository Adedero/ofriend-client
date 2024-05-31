<script setup>
const faqs = [
  {
    question: "How does Ofriend Edu work?",
    answer: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
  },
  {
    question: "Can i get free courses?",
    answer: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
  },
  {
    question: "Do you offer earning opportunities to learners?",
    answer: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
  }
]
</script>

<template>
  <section class="p-5 md:p-10 bg-soft-blue">
    <h1 class="font-bold text-2xl text-center">Frequently Asked Questions.</h1>

    <div class="mt-8">
      <ul class="grid gap-5 mt-5 lg:px-20 xl:px-32">
        <li v-for="q in faqs" :key="q" class="grid gap-1">
          <p class="font-semibold">{{ q.question }}</p>
          <p>{{ q.answer }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

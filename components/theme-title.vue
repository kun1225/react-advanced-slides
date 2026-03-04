<template>
  <div
    class="chapter-title relative flex justify-center items-center w-full h-full"
  >
    <p
      v-if="number"
      class="!leading-none absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-[500px] font-bold font-antonio text-primary-highlight -skew-x-16 whitespace-nowrap opacity-25"
    >
      {{ `CH.${number}` }}
    </p>

    <h1>
      <slot />
    </h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  number: string;
}>();
</script>

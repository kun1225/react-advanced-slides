<template>
  <div
    :class="`card py-8 rounded-lg shadow-lg origin-center ${props.class || ''}`"
  >
    <header
      v-if="$slots.header"
      class="mb-6 text-xl text-center text-[var(--secondary)] font-semibold"
    >
      <span
        v-if="headerNumber"
        class="inline-block text-2xl -skew-x-16 font-bold"
        >{{ headerNumber }}.</span
      >
      <slot name="header" />
    </header>

    <div class="whitespace-wrap px-6 w-fit mx-auto">
      <slot name="default" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  headerNumber?: number;
  class?: string;
}>();
</script>

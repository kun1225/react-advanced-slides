<template>
  <div class="flex items-end gap-6 -translate-y-4">
    <div>
      <p
        v-if="props?.number"
        class="!my-0 !leading-none font-antonio font-black text-[var(--primary-highlight)] text-[140px] tracking-[-0.15em] -skew-x-16"
      >
        {{ `${props.number} .` }}
      </p>
    </div>
    <div class="flex flex-col items-start gap-1">
      <span class="text-mute text-3xl text-left">{{ props.subtitle }}</span>
      <h1 class="!my-0 !leading-none !text-7xl whitespace-nowrap">
        <slot />
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  number: string;
  subtitle: string;
}>();
</script>

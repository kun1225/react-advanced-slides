<template>
  <p
    v-if="props?.number"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !my-0 !leading-none font-sansation font-black text-[var(--primary)] text-[480px] italic opacity-10 whitespace-nowrap"
  >
    {{ `${props.number}.` }}
  </p>

  <h1
    :class="
      cn(
        '!my-0 !text-6xl !leading-[1.4em] whitespace-nowrap font-serif font-black !color-white',
        props?.class
      )
    "
    style="
      filter: drop-shadow(rgba(8, 227, 255, 0.95) 0px 0px 2.42238px)
        drop-shadow(rgba(39, 231, 255, 0.75) 0px 0px 12.1119px)
        drop-shadow(rgba(39, 231, 255, 0.44) 0px 0px 36.3357px);
    "
  >
    <slot />
  </h1>
</template>

<script setup lang="ts">
import { cn } from '../snippets/external';

const props = defineProps<{
  number: string;
  subtitle: string;
  class: string;
}>();
</script>

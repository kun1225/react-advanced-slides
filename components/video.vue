<template>
  <SlidevVideo
    :src="src"
    :controls="controls"
    :autoplay="autoplay"
    :loop="loop"
    :muted="muted"
    w="100%"
    h="90%"
    mt="4"
  >
    <slot v-if="!src" />
  </SlidevVideo>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    width?: string;
    src?: string;
  }>(),
  {
    controls: true,
    autoplay: true,
    loop: true,
    muted: true,
  }
);
</script>

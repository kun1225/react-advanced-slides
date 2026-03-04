<template>
  <div
    class="slidev-layout three-columns grid grid-cols-3 grid-rows-[auto_1fr] gap-x-6"
  >
    <header class="three-columns-header col-span-3">
      <slot name="default" />
    </header>

    <div class="column-1">
      <slot name="column-1" />
    </div>
    <div class="column-2">
      <slot name="column-2" />
    </div>
    <div class="column-3">
      <slot name="column-3" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

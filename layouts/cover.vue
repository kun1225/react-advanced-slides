<template>
  <div class="slidev-layout cover relative">
    <p
      class="absolute -z-10 top-[38.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[600px] text-[var(--primary-highlight)] font-antonio opacity-8 tracking-[-0.02em] font-black"
    >
      REACT
    </p>
    <slot />
    <p class="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-primary">
      @this.web
    </p>
  </div>
</template>

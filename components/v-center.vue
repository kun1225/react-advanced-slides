<template>
  <div
    ref="container"
    class="h-full grow flex flex-col justify-center"
    :style="{ height: `${centerHeight}px` }"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const container = ref(null);
const centerHeight = ref(0);
let resizeObserver = null;

const calculateHeight = () => {
  const containerEl = container.value;
  if (!containerEl || !containerEl.parentElement) return;

  const parentEl = containerEl.parentElement;
  const parentStyle = getComputedStyle(parentEl);
  const parentInnerHeight = parentEl.clientHeight;

  const paddingTop = parseFloat(parentStyle.paddingTop);
  const paddingBottom = parseFloat(parentStyle.paddingBottom);
  const totalPadding = paddingTop + paddingBottom;

  const siblings = Array.from(parentEl.children).filter(
    (child) => child !== containerEl
  );
  const siblingsHeightWithMargin = siblings.reduce((total, sibling) => {
    const siblingStyle = getComputedStyle(sibling);
    const marginTop = parseFloat(siblingStyle.marginTop);
    const marginBottom = parseFloat(siblingStyle.marginBottom);
    // offsetHeight 包含 height + padding + border
    return total + sibling.offsetHeight + marginTop + marginBottom;
  }, 0);

  centerHeight.value = parentInnerHeight - siblingsHeightWithMargin;
};

onMounted(() => {
  // 為了確保所有樣式和元素都已就緒，延遲執行是必要的
  // 使用 requestAnimationFrame 會比 setTimeout(..., 0) 在時機上更適合畫面繪製
  requestAnimationFrame(() => {
    calculateHeight();

    // 監聽父元素尺寸變化
    if (container.value?.parentElement) {
      resizeObserver = new ResizeObserver(calculateHeight);
      resizeObserver.observe(container.value.parentElement);
    }
  });
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<template>
  <div flex-1 border-box of-auto class="scroll-view">
    <slot></slot>
  </div>
</template>
<style>
.slidev-layout {
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
.scroll-view::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.scroll-view::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.scroll-view::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.scroll-view::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.scroll-view:not(:hover)::-webkit-scrollbar-thumb {
  background: transparent;
}
</style>

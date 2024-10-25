<template>
  <header class="h-38 flex items-center justify-between relative header">
    <div class="bar h-full flex-1"></div>
    <div class="close">
      <i
        class="iconfont icon-guanbijiantou font-bold text-20 cursor-pointer hover:bg-gray-2 rounded-3 p-3"
        @click="minimizeWindow"
      ></i>
    </div>
  </header>
</template>

<script setup lang="ts">
const minimizeWindow = () => {
  console.log('minimizeWindow');

  window.ipcRenderer.send('minimize-window');
};
</script>

<style lang="scss" scoped>
.header {
  &::after {
    position: absolute;
    content: '';
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 5px;
    background: #ccc;
    border-radius: 10px;
  }

  .bar {
    -webkit-app-region: drag; /* 使整个窗口可拖拽 */
  }
}
</style>

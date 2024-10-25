<template>
  <div class="h-40 line-height-40 mb-10">
    <span
      v-for="item in option"
      :key="item.value"
      :class="{ actived: modelValue === item.value }"
      class="relative after:bottom-[-30%] after:left-[50%] after:translate-x-[-50%] after:w-[0] after:h-[2px] after:bg-[#409eff] after:border-radius-[2px] after:content-[''] after:absolute"
      @click="handleClick(item)"
    >
      <i
        class="iconfont text-22 cursor-pointer hover:bg-gray-2 rounded-3 p-5"
        :class="item.label"
      ></i>
    </span>
  </div>
</template>

<script setup lang="ts">
interface IOption {
  label: string;
  value: string;
}

defineProps<{
  option: IOption[];
  modelValue: string;
}>();

const $emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function handleClick(item: IOption) {
  $emit('update:modelValue', item.value);
}
</script>

<style lang="scss" scoped>
.actived::after {
  width: 68%;
  transition: width 0.3s;
}

.clear {
  background-color: #ccc;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>

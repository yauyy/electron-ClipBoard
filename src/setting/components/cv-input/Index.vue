<template>
  <div class="cv-input-wrap">
    <input
      v-model.trim="modelValue"
      type="text"
      placeholder="快捷键"
      class="h-32 w-180 rounded-8 border-1 px-10 border-gray text-16 cv-input"
      @blur="onBlur"
    />
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel('modelValue', { required: true });

const $emit = defineEmits(['onBlur']);

const onBlur = (event: any) => {
  $emit('onBlur', event.target.value);
};
</script>

<style lang="scss" scoped>
.cv-input {
  outline: none;
  border-style: solid;
  &:focus {
    border-color: #5ca1ff;
  }
}
</style>

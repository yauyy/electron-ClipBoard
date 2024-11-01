<template>
  <div>
    <fieldset class="rounded-10 px-18 py-20">
      <legend class="font-bold">设置</legend>
      <div class="flex items-center">
        <div class="mr-10 text-15">开机后自动启动</div>
        <cv-checkbox v-model="isAutoOpen" @change="onChange" />
      </div>
    </fieldset>

    <fieldset class="rounded-10 px-18 py-20 mt-20">
      <legend class="font-bold">快捷键</legend>
      <div class="flex items-center">
        <div class="mr-10 text-15">打开面板</div>
        <cv-input v-model="fastKeyboard" @onBlur="onBlur" />
      </div>
    </fieldset>

    <div class="text-center mt-30">
      <cv-button @click="reset">恢复初始化</cv-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import CvCheckbox from './components/cv-checkbox/Index.vue';
import CvInput from './components/cv-input/Index.vue';
import CvButton from './components/cv-button/Index.vue';

const isAutoOpen = ref(window.localStorage.getItem('isAutoOpen') === 'true');

const fastKeyboard = ref(
  window.localStorage.getItem('fastKeyboard') || 'ctrl+shift+v'
);

const onBlur = (val: string) => {
  const regex = /^[a-zA-Z\+]+$/;
  if (!regex.test(val)) {
    alert('请输入有效的英文字母');

    nextTick(() => {
      fastKeyboard.value = '';
    });

    return;
  }
  window.localStorage.setItem('fastKeyboard', val.toLocaleLowerCase());
};

const onChange = (val: boolean) => {
  window.localStorage.setItem('isAutoOpen', val.toString());
};

const reset = () => {
  window.localStorage.setItem('isAutoOpen', 'false');
  window.localStorage.setItem('fastKeyboard', 'ctrl+shift+v');
  isAutoOpen.value = false;
  fastKeyboard.value = 'ctrl+shift+v';
};
</script>

<style scoped lang="scss"></style>

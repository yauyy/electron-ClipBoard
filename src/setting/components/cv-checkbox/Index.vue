<template>
  <div>
    <input
      v-model="checked"
      class="checkbox checkbox-switch"
      id="switch"
      type="checkbox"
      @change="handleChange"
    />
    <label class="checkbox-btn" for="switch"></label>
  </div>
</template>

<script setup lang="ts">
const checked = defineModel('modelValue', { required: true });
const $emit = defineEmits(['change']);

const handleChange = (e: Event) => {
  $emit('change', (e.target as HTMLInputElement).checked);
};
</script>

<style lang="scss" scoped>
.checkbox {
  display: none;
  &,
  &:after,
  &:before,
  & *,
  & *:after,
  & *:before,
  & + .checkbox-btn {
    box-sizing: border-box;
    &::selection {
      background: none;
    }
  }

  + .checkbox-btn {
    outline: 0;
    display: block;
    width: 58px;
    height: 30px;
    position: relative;
    cursor: pointer;
    user-select: none;
    &:after,
    &:before {
      position: relative;
      display: block;
      content: '';
      width: 50%;
      height: 100%;
    }

    &:after {
      left: 0;
    }

    &:before {
      display: none;
    }
  }

  &:checked + .checkbox-btn:after {
    left: 50%;
  }
}

.checkbox-switch {
  + .checkbox-btn {
    background: #fbfbfb;
    border-radius: 2em;
    padding: 2px;
    transition: all 0.4s ease;
    border: 1px solid #e8eae9;
    &:after {
      border-radius: 2em;
      background: #fbfbfb;
      transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
        padding 0.3s ease, margin 0.3s ease;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
    }

    &:hover:after {
      will-change: padding;
    }

    &:active {
      box-shadow: inset 0 0 0 2em #e8eae9;
      &:after {
        padding-right: 0.8em;
      }
    }
  }

  &:checked + .checkbox-btn {
    background: #5ca1ff;
    &:active {
      box-shadow: none;
      &:after {
        margin-left: -0.8em;
      }
    }
  }
}
</style>

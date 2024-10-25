<template>
  <div>
    <NoData v-if="!dataList.length" />
    <ClipboardCellGroup v-else>
      <ClipboardCell
        v-for="item in dataList"
        :key="item.id"
        :item
        isCollect
        @markCollect="
          clipboardStore.markCollect(
            item,
            !item.isCollect ? addCollect : removeCollect
          )
        "
        @del="clipboardStore.removeClipboard"
      />
    </ClipboardCellGroup>
  </div>
</template>

<script setup lang="ts">
import { useCollectStore, useClipboardStore } from '@/store/index';
import NoData from './no-data.vue';
import ClipboardCellGroup from './clipboard-cell-group.vue';
import ClipboardCell from './clipboard-cell.vue';
import { computed } from 'vue';

const clipboardStore = useClipboardStore();
const { addCollect, removeCollect } = useCollectStore();

const dataList = computed(() => clipboardStore.clipboardList);
</script>

<style lang="scss" scoped></style>

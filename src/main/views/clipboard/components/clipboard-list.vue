<template>
  <div>
    <NoData v-if="!dataList.length" />
    <ClipboardCellGroup v-else>
      <ClipboardCell
        v-for="item in dataList"
        :key="item.id"
        :item
        isCollect
        @markCollect="markCollect"
        @del="clipboardStore.removeClipboard"
      />
    </ClipboardCellGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IClipboardItem } from '../../../types';
import { useCollectStore, useClipboardStore } from '@/store/index';
import NoData from './no-data.vue';
import ClipboardCellGroup from './clipboard-cell-group.vue';
import ClipboardCell from './clipboard-cell.vue';

const clipboardStore = useClipboardStore();
const { addCollect } = useCollectStore();

const dataList = computed(() => clipboardStore.clipboardList);

const markCollect = (item: IClipboardItem) => {
  const shouldAddCollect = !item.isCollect ? addCollect : void 0;
  clipboardStore.markCollect(item, shouldAddCollect);
};
</script>

<style lang="scss" scoped></style>

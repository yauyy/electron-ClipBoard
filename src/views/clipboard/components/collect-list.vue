<template>
  <div>
    <NoData v-if="!collectStore.collectDataList.length" />
    <ClipboardCellGroup v-else>
      <ClipboardCell
        v-for="item in collectStore.collectDataList"
        :key="item.id"
        :item
        @del="collectStore.removeCollect"
      />
    </ClipboardCellGroup>
  </div>
</template>

<script setup lang="ts">
import { useCollectStore } from '@/store/index';
import NoData from './no-data.vue';
import ClipboardCell from './clipboard-cell.vue';
import ClipboardCellGroup from './clipboard-cell-group.vue';

const collectStore = useCollectStore();
</script>

<style lang="scss" scoped></style>

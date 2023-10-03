<template>
  <el-table 
    border
    class='sku-table'
    :data='props.data'
  >
    <el-table-column
      v-for='column in skuTableColumns'
      :key='column.prop'
      :label='column.label'
      :prop='column.prop'
    >
      <template #default='columnProps'>
        <slot v-bind='{cell:columnProps.row[column.prop],...columnProps}' />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">

import { ElTable, ElTableColumn } from 'element-plus'
import { watch, ref } from 'vue'

export interface SkuTableXAxis {
  prop: string
  label: string
  slot?: string
}

export interface SkuTableCell {
  yAxis: string
  [key: string]: any
}

export interface SkuTableProps {
  title?: string
  xAxis?: SkuTableXAxis[]
  data?: SkuTableCell[]
}

const props = withDefaults(
  defineProps<SkuTableProps>(), 
  { title: '', xAxis: () => [], yAxis: () => [], data: () => [] }
)

const skuTableColumns = ref<SkuTableXAxis[]>([])
const skuTableData = ref<SkuTableCell[]>([])

watch(
  [() => props.title, () => props.xAxis],
  () => {
    skuTableColumns.value = [{ label: props.title, prop: 'yAxis', slot: 'yAxis' }, ...props.xAxis]  
    console.log(skuTableColumns.value)
  },
  {
    immediate: true
  }
)

</script>

<style scoped>
.sku-table:deep(.el-table__cell){
  padding: 0;
  height: 40px;
}

.sku-table:deep(.cell) {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0;
}

</style>
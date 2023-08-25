<template>
  <el-table
    class='sku-table'
    :data='skuData'
  >
    <el-table-column
      :label='props.title'
      prop='yAxis'
    >
      <template #default='{row}'>
        {{ row.yAxis.label }}
      </template>
    </el-table-column>
    <el-table-column
      v-for='column in props.xAxis'
      :key='column.prop'
      :align='column.align ?? "center"'
      :label='column.label'
      :prop='column.prop'
    >
      <template #default='{row}'>
        <div
          v-if='Array.isArray(row[column.prop])'
          class='sku-table-cell-wrap'
        >
          <sku-table-cell
            v-for='(item,index) in row[column.prop]'
            :key='index'
            :background-color='item.backgroundColor'
            :editable='item.editable'
            :model-value='item.value'
          />
        </div>
        <div v-else>
          <sku-table-cell />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">

import { ElTable, ElTableColumn } from 'element-plus'
import { watch, ref } from 'vue'

import SkuTableCell from './sku-table-cell.vue'

interface AxisItem {
  label: string
  prop: string
  slot?: string
}

interface XAxisItem extends AxisItem{
  align?: string
}

type YAxisItem = AxisItem

interface SkuTableCellProps{
  value?: string
  editable?: boolean | ((value: string) => string)
  backgroundColor?: string
}

interface SkuTable {
  title: string
  xAxis?: XAxisItem[]
  yAxis?: YAxisItem[]
  data?: Record<string, SkuTableCellProps[]>[]
}

const props = withDefaults(
  defineProps<SkuTable>(), 
  { 
    xAxis: () => [], 
    yAxis: () => [],
    data: () => [], 
  }
)

const skuData = ref<Record<string, SkuTableCellProps[] | AxisItem>[]>([])

watch(
  () => props.data, 
  () => {
    initSkuData()
  }, 
  {
    immediate: true
  }
)

function initSkuData() {
  const data: Record<string, SkuTableCellProps[] | AxisItem>[] = []
  for (let i = 0;i < props.yAxis.length;i++) {
    const row = props.data[i]
    let r = { yAxis: props.yAxis[i] }
    if (row) {
      r = { ...r, ...row }
    }
    data.push(r)
  }
  skuData.value = data 
}
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
}

.sku-table-cell-wrap{
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
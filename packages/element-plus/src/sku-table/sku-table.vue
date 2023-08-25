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
            v-model='item.value'
            :background-color='item.backgroundColor'
            :editable='item.editable'
            :placeholder='item.placeholder'
            @update:model-value='cellChange'
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

import SkuTableCell, { SkuTableCellProps } from './sku-table-cell.vue'

interface AxisItem {
  label: string
  prop: string
  slot?: string
}

interface XAxisItem extends AxisItem{
  align?: string
}

type YAxisItem = AxisItem

interface SkuTableProps {
  title: string
  xAxis?: XAxisItem[]
  yAxis?: YAxisItem[]
  modelValue?: Record<string, SkuTableCellProps[]>[]
}

const props = withDefaults(
  defineProps<SkuTableProps>(), 
  { 
    xAxis: () => [], 
    yAxis: () => [],
    modelValue: () => [], 
  }
)

const emits = defineEmits<{(e: 'update:modelValue', value: Record<string, SkuTableCellProps[]>[]): void}>()

const skuData = ref<Record<string, SkuTableCellProps[] | AxisItem>[]>([])

watch(
  () => props.modelValue, 
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
    const row = props.modelValue[i]
    let r = { yAxis: props.yAxis[i] }
    if (row) {
      r = { ...r, ...row }
    }
    data.push(r)
  }
  skuData.value = data 
}

function cellChange() {
  const data: Record<string, SkuTableCellProps[]>[] = []
  for (const [index, item] of props.modelValue.entries()) {
    data[index] = item
  }
  emits('update:modelValue', data)
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
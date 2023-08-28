<template>
  <sku-table
    v-model='skuData'
    :title='title'
    :x-axis='xAxis'
    :y-axis='yAxisColumns'
  />
</template>

<script setup lang="ts">
import { SkuTable, SkuTableAxisItem, SkuTableCellEditableValue, SkuTableValue, SkuTableCellProps } from '@example/element-plus'
import { computed, onMounted, ref } from 'vue'

const title = ref('')
const xAxis = ref<SkuTableAxisItem[]>([])
const yAxis = ref<SkuTableAxisItem[]>([])
const skuData = ref<SkuTableValue[]>([])

const yAxisColumns = computed(() => {
  const columns: SkuTableAxisItem[] = []
  for (const [index, item] of yAxis.value.entries()) {
    let total = 0
    for (const stockItem of Object.values(skuData.value[index])) {
      const item = stockItem[0]
      if (item.editable) {
        total += Number(item.value)
      }
    }
    columns.push({ label: `${item.label}（${total}/件）`, prop: '' })
  }

  return columns
})

onMounted(() => {
  loadData()
})

async function loadData() {
  const { data } = await import('./data.json')
  title.value = data.name
  const xAxisMap: Record<string, any> = {}
  const yAxisMap: Record<string, any> = {}
  const rows: Record<string, any> = {}
  for (const item of data.goodsItemsList) {
    const sku = JSON.parse(item.specJson)
    const size = sku[0]
    const color = sku[1]
    const sizeId = size.value_id
    const colorId = color.value_id
    xAxisMap[sizeId] = { label: size.value, prop: `${size.value_id}` }
    yAxisMap[colorId] = { label: color.value, prop: `${color.value_id}`, slot: `${color.value_id}` }
    const rowItem: SkuTableCellProps = { value: '', placeholder: `${item.stock}`, meta: item }
    if (item.stock < 0) {
      rowItem.backgroundColor = '#f56c6c'
      rowItem.color = '#fff'
    }
    if (item.stock > 0) {
      rowItem.backgroundColor = '#1890ff'
      rowItem.color = '#fff'
    }
    rowItem.editable = editable
    if (!rows[colorId]) {
      rows[colorId] = { [sizeId]: [rowItem] }
    } else {
      rows[colorId] = { ...rows[colorId], [sizeId]: [rowItem] }
    }
  }
  xAxis.value = Object.values(xAxisMap)
  yAxis.value = Object.values(yAxisMap)
  skuData.value = Object.values(rows)
}
function editable(value: string): SkuTableCellEditableValue {
  const v = Number(value)
  if (v < 0) {
    return { value: '0', error: '数量不能小于0' }
  }
  return { value }
}
</script>

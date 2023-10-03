<template>
  <sku-table2
    :data='props.data'
    title='系列'
    :x-axis='props.columns'
  >
    <template
      #default='{column,row,$index}'
    >
      <span v-if="column.property === 'yAxis'">
        {{ row[column.property] }}
      </span>
      <template v-else-if='props.step==="default"'>
        <span>{{ row[column.property].stock }}</span>
        /
        <span>{{ row[column.property].freezeStock }}</span>
        /
        <span>{{ row[column.property].waitingStock }}</span>
      </template>
      <template v-else-if='props.step==="start"'>
        <input
          class='sku-table-input'
          :value='inputData[`${column.property}_${$index}`]'
          @input='valueChange(column.property,$event)'
        >
      </template>
      <template v-else-if='props.step==="check"'>
        <span>{{ checkedData[`${column.property}_${$index}`] }}</span>
      </template>
    </template>
  </sku-table2>
</template>

<script setup lang="ts">
import { SkuTable2, SkuTableXAxis } from '@example/element-plus'
import { watch, ref } from 'vue'

interface InventoryTableRow{
  yAxis: string
  [key: string]: {
    stock: number
    freezeStock: number
    waitingStock: number
  } | string
}

interface InventoryTableProps {
  step?: 'default' | 'start' | 'check'
  columns?: SkuTableXAxis[]
  data?: InventoryTableRow[]
}

const props = withDefaults(
  defineProps<InventoryTableProps>(), 
  { step: 'default', columns: () => [], data: () => [] }
)

const inputData = ref<Record<string, string>>({})

const checkedData = ref<Record<string, string>>({})

watch(() => props.step, () => {
  if (props.step === 'check') {
    for (const [index, item] of props.data.entries()) {
      for (const prop in item) {
        if (prop !== 'yAxis') {
          const inputStock = inputData.value[`${prop}_${index}`]
          const checkStock = Number(inputStock ?? 0) - Number(item[prop].stock) + Number(item[prop].freezeStock)
          checkedData.value[`${prop}_${index}`] = checkStock.toString() 
        }
      }
    }  
  }
}, { immediate: true })

function valueChange(key: string, value: Event) {
  inputData.value[key] = (value.target as HTMLInputElement).value
}

</script>

<style scoped>

.sku-table-input{
  outline: none;
  border: none;
  width: 100%;
  background-color: transparent;
  text-align: center;
}
</style>
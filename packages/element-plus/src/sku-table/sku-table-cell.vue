<template>
  <div
    class='sku-table-cell'
    :style='{backgroundColor:props.backgroundColor}'
  >
    <input
      v-if='props.editable'
      :value='inputValue'
      @blur='valueBlur'
      @input='valueChange'
    >
    <span v-else>{{ inputValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
export interface SkuTableCellProps {
    modelValue?: string
    editable?: boolean | ((value: string) => string)
    backgroundColor?: string
}

const props = withDefaults(
  defineProps<SkuTableCellProps>(), 
  {
    modelValue: '--',
    editable: false,
    backgroundColor: '',
  }
)

const emits = defineEmits<{(e: 'update:modelValue', value: string): void}>()

const inputValue = ref('')

watch(() => props.modelValue, 
  () => {
    inputValue.value = props.modelValue
  },
  {
    immediate: true
  }
)

function valueChange(e: Event) {
  const target = e.target as HTMLInputElement
  const number = getNumber(target.value)
  target.value = number === undefined ? inputValue.value : number
  if (typeof props.editable === 'function') {
    target.value = props.editable(target.value)
  }
  inputValue.value = target.value
  emits('update:modelValue', inputValue.value)
}

function valueBlur(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.value === '-') {
    target.value = '0'
  }
  inputValue.value = target.value
  emits('update:modelValue', inputValue.value)
}

function getNumber(value: string) {
  let numberValue = value
  const regex = /^-?\d+(\.\d+)?$/
  if (value === '') {
    return '0'
  } else if (numberValue === '0-' || numberValue === '-') {
    return '-'
  } else if (!regex.test(numberValue)) {
    return
  } 
  return Number(numberValue).toString()
}

</script>

<style>
.sku-table-cell{
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.sku-table-cell input{
  outline: none;
  border: none;
  width: 100%;
  background-color: transparent;
  text-align: center;
}
</style>
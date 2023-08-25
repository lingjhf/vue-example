<template>
  <div class='sku-table-cell'>
    <div
      
      v-if='props.editable'
      class='sku-table-input'
      :style='{backgroundColor:props.backgroundColor}'
    >
      <el-tooltip
        :content='errorMessage'
        :visible='!!errorMessage'
      >
        <input
       
          :placeholder='props.placeholder'
          :value='inputValue'
          @blur='valueBlur'
          @input='valueChange'
        >
      </el-tooltip>
    </div>
    <span v-else>{{ inputValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { ElTooltip } from 'element-plus'
import { ref, watch, } from 'vue'

interface SkuTableCellEditableValue {
  value: string
  error?: string
}

export interface SkuTableCellProps {
    modelValue?: string
    placeholder?: string
    editable?: boolean | ((value: string) => SkuTableCellEditableValue)
    backgroundColor?: string
}

const props = withDefaults(
  defineProps<SkuTableCellProps>(), 
  {
    modelValue: '--',
    placeholder: undefined,
    editable: false,
    backgroundColor: '',
  }
)

const emits = defineEmits<{(e: 'update:modelValue', value: string): void}>()

const inputValue = ref('')
const errorMessage = ref('')

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
    const { value, error } = props.editable(target.value)
    errorMessage.value = error ? error : ''
    target.value = value
  }
  inputValue.value = target.value
  emits('update:modelValue', inputValue.value)
}

function valueBlur(e: Event) {
  const target = e.target as HTMLInputElement
  if (typeof props.editable === 'function') {
    const { value, error } = props.editable(target.value)
    errorMessage.value = error ? error : ''
    target.value = value
  }
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
    if (props.placeholder !== undefined) {
      return ''
    }
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
.sku-table-input{
  display: flex;
  align-items: center;
  height: 100%;
}
.sku-table-cell-error{
  line-height: 16px;
  font-size: 12px;
  color: #F56C6C;
}
</style>
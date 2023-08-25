<template>
  <div class='sku-table-cell'>
    <div
      v-if='props.editable'
      class='sku-table-input-wrap'
    >
      <div
        class='sku-table-input'
        :style='{backgroundColor:props.backgroundColor}'
      >
        <input
       
          :placeholder='props.placeholder'
          :value='inputValue'
          @blur='valueBlur'
          @input='valueChange'
        >
      </div>
      <div
        v-if='errorMessage'
        class='sku-table-cell-error'
      >
        {{ errorMessage }}
      </div>
    </div>
    <span v-else>{{ inputValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface SkuTableCellEditableValue {
  value: string
  error: string
}

export interface SkuTableCellProps {
    modelValue?: string
    placeholder?: string
    editable?: boolean | ((value: string) => string)
    backgroundColor?: string
}

const props = withDefaults(
  defineProps<SkuTableCellProps>(), 
  {
    modelValue: '--',
    placeholder: '',
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
    try {
      target.value = props.editable(target.value)
      errorMessage.value = ''
    } catch (e) {
      const err = e as Error
      if (errorMessage.value != err.message) {
        errorMessage.value = err.message
      }
      target.value = inputValue.value
      return
    }
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
    return ''
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
.sku-table-input-wrap{
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
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
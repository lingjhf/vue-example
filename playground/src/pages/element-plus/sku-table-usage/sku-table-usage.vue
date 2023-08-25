<template>
  <div>
    <sku-table
      v-model='data'
      title='测试-110'
      :x-axis='xAxis'
      :y-axis='yAxis'
    />
  </div>
</template>

<script setup lang="ts">
import { SkuTable } from '@example/element-plus'
import { ref } from 'vue'
const xAxis = [
  {
    label: '58/S', prop: 'a',
  },
  {
    label: '64/M', prop: 'b'
  },
  {
    label: '70/L', prop: 'c'
  },
  {
    label: '76/XL', prop: 'd'
  }
]

const yAxis = [
  {
    label: '白色', prop: '1'
  },
  {
    label: '肤色', prop: '2'
  },
  {
    label: '黑色', prop: '3'
  },
  {
    label: '黑色A款', prop: '4'
  }
]

const data = ref([
  {
    a: [{
      value: '100',
      editable(value: string) {
        if (Number(value) > 200) {
          return '200'
        }
        return value
      },
      backgroundColor: '#1890ff'
    }],
    b: [
      {
        value: '200',
        editable: (value: string) => {
          if (Number(value) < 0) {
            return '0'
          }
          return value
        },
        backgroundColor: '#1890ff'
      },
      {
        value: '200',
        editable: true,
        backgroundColor: '#f56c6c'
      }
    ],
    c: [{
      value: '100',
      backgroundColor: '#f56c6c'
    }],
  }
])

</script>

<style scoped>

</style>
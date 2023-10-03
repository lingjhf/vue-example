<template>
  <div>
    <h2>盘点</h2>
    <inventory-table
      :columns='inventoryColumns'
      :data='inventoryData'
      step='start'
    />

    <!-- <h2>客服下单</h2>
    <h3>新订单</h3>
    <new-order-sku-table />
    <h3>预售单</h3>
    <pre-sale-order-sku-table /> -->
  </div>
</template>

<script setup lang="ts">
import InventoryTable from './inventory-table.vue'
import NewOrderSkuTable from './new-order-sku-table.vue'
import PreSaleOrderSkuTable from './pre-sale-order-sku-table.vue'

const inventoryColumns = [
  {
    label: '70A',
    prop: '70A'
  },
  {
    label: '70B',
    prop: '70B'
  },
  {
    label: '70C',
    prop: '70C'
  }
]

const inventoryData = [
  {
    yAxis: '肤色',
    '70A': { stock: 20, freezeStock: 10, waitingStock: 0 },
    '70B': { stock: 0, freezeStock: 0, waitingStock: 0 },
    '70C': { stock: 0, freezeStock: 0, waitingStock: 0 },
  },
  {
    yAxis: '黑色',
    '70A': { stock: 0, freezeStock: 0, waitingStock: 0 },
    '70B': { stock: 0, freezeStock: 0, waitingStock: 0 },
    '70C': { stock: 0, freezeStock: 0, waitingStock: 0 },
  }
]

</script>

<style scoped>

</style>
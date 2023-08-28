<template>
  <div>
    <h2>客服下单</h2>
    <h3>新订单</h3>
    <new-order-sku-table />
    <h3>预售单</h3>
    <pre-sale-order-sku-table />
  </div>
</template>

<script setup lang="ts">
import NewOrderSkuTable from './new-order-sku-table.vue'
import PreSaleOrderSkuTable from './pre-sale-order-sku-table.vue'

</script>

<style scoped>

</style>
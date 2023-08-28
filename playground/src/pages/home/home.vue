<template>
  <scaffold class='h-screen'>
    <template #header>
      <div class='h-full relative'>
        <el-divider
          class='bottom-0 z-99 m-0! absolute!'
        >
          Vue Example
        </el-divider>
      </div>
    </template>
    <template #aside>
      <!-- <el-menu
        class='h-full'
        :default-active='activeMenu'
        router
      >
        <el-sub-menu index='elementPlus'>
          <template #title>
            Element Plus组件
          </template>
          <el-menu-item index='/element-plus/sku-table'>
            Sku Table
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index='x6'>
          <template #title>
            Antv x6组件
          </template> 
          <el-menu-item index='OrganizationChart'>
            组织架构图
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index='echarts'>
          <template #title>
            Echarts组件
          </template>
          <el-menu-item index='lineChart'>
            平滑曲线图
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index='amap'>
          <template #title>
            高德地图组件
          </template>
          <el-menu-item />
        </el-sub-menu>
      </el-menu> -->
    </template>
    <template #main>
      <router-view />
    </template>
  </scaffold>
</template>

<script setup lang="ts">
import { Scaffold } from '@example/element-plus'
import { ElMenu, ElSubMenu, ElMenuItem, ElDivider } from 'element-plus'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeMenu = ref('')

watch(
  () => route.path, 
  () => {
    activeMenu.value = route.path
  },
  {
    immediate: true
  }
)

</script>

<style scoped>

</style>
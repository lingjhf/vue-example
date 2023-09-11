<template>
  <div class='h-screen'>
    <div class='h-60px box-border border border-b border-solid border-[var(--el-border-color)]'>
      <div class='flex items-center ml-[10px] h-full'>
        <span class='ml-[16px] mr-[8px]'>Vue Example</span>
      </div>
    </div>
    <div class='flex items-center'>
      <div class='h-full w-200px flex-shrink-0'>
        <el-scrollbar class='h-full'>
          <!-- <el-menu
            class='h-[calc(100vh-60px)]'
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
              <el-menu-item index='/x6/organization-chart'>
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
        </el-scrollbar>
      </div>

      <el-scrollbar>
        <div class='w-[calc(100vw-200px)] h-[calc(100vh-60px)]'>
          <router-view />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMenu, ElSubMenu, ElMenuItem, ElScrollbar } from 'element-plus'
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
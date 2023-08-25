<template>
  <el-container>
    <el-header class='p-0!'>
      <slot name='header' />
    </el-header>
    <el-container>
      <el-aside width='200px'>
        <slot name='aside' />
      </el-aside>
      <el-main>
        <slot name='main' />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ElContainer, ElHeader, ElAside, ElMain } from 'element-plus'
</script>
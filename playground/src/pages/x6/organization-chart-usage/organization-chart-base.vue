<template>
  <div class=' h-full w-full flex  justify-center items-center'>
    <div class='example-area  flex flex-col items-center'>
      <div class='my-4'>
        <el-radio-group v-model='direction'>
          <el-radio label='LR'>
            左到右
          </el-radio>
          <el-radio label='RL'>
            右到左
          </el-radio>
          <el-radio label='TB'>
            上到下
          </el-radio>
          <el-radio label='BT'>
            下到上
          </el-radio>
        </el-radio-group>
      </div>
      <organization-chart
        :data='data'
        :direction='direction'
        :render-edge='renderEdge'
        :render-node='renderNode'
        :set-graph='setGraph'
        style='width: 100%; height: 100%'
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import { Shape, Edge, Graph } from '@antv/x6'
import { OrganizationChart, OrganizationNode, OrganizationChartDirection } from '@example/x6'
import { ElRadioGroup, ElRadio } from 'element-plus'
import { ref } from 'vue'

const data: OrganizationNode[] = [
  {
    key: '1',
    meta: {
      title: '技术部/863344',
    },
    children: [
      {
        key: '1-1',
        meta: {
          title: '小红/787',
        },
        children: [
          {
            key: '1-1-1',
            meta: {
              title: '张晓敏/100',
            },
            children: [
              {
                key: '1-1-1-1',
                meta: {
                  title: '鱿鱼/158',
                },
              },
              {
                key: '1-1-1-2',
                meta: {
                  title: 'DJ/652',
                },
              },
            ],
          },
        ],
      },
      {
        key: '1-2',
        meta: {
          title: '李白/123',
        },
        children: [
          {
            key: '1-2-1',
            meta: {
              title: '胡海/321',
            },
          },
          {
            key: '1-2-2',
            meta: {
              title: '伊一/63212',
            },
            children: [
              {
                key: '1-2-2-1',
                meta: {
                  title: '花哈哈/96523',
                },
              },
              {
                key: '1-2-2-2',
                meta: {
                  title: '护手霜/555321',
                },
              },
              {
                key: '1-2-2-3',
                meta: {
                  title: '生地黄/56635',
                },
              },
              {
                key: '1-2-2-4',
                meta: {
                  title: '四季豆卡萨丁/63215',
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

const direction = ref<OrganizationChartDirection>('LR')

function setGraph(graph: Graph) {
  graph.zoomTo(0.8).enableMouseWheel().enablePanning()
  graph.mousewheel.options.mousewheel.modifiers = ['ctrl', 'meta']
}

function renderNode(node: OrganizationNode) {
  return new Shape.Rect({
    width: 100,
    height: 40,
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
        style: {
          strokeWidth: 0,
        },
      },
      {
        tagName: 'text',
        selector: 'label',
        textContent: node.meta.title,
        style: {
          fill: 'blue',
        },
      },
    ],
  })
}

function renderEdge(edge: Edge<Edge.Properties>) {
  edge.setZIndex(-1)
  edge.setAttrs({
    line: {
      strokeWidth: 2,
      stroke: '#A2B1C3',
      sourceMarker: null,
      targetMarker: null,
    },
  })
}
</script>

<style>
.example-area {
  width: 80%;
  height: 80%;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
</style>

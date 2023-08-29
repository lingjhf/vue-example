<template>
  <div class=' h-full w-full flex  justify-center items-center'>
    <div class='example-area  flex flex-col items-center'>
      <div class='my-4 flex items-center w-full px-4 box-border'>
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
        <div class='w-[200px] ml-auto'>
          <el-slider
            v-model='zoom'
            :format-tooltip='zoomFormatTooltip'
            :max='maxZoom'
            :min='minZoom'
            :step='zoomStep'
            @input='zoomChange'
          />
        </div>
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
import { ElRadioGroup, ElRadio, ElSlider } from 'element-plus'
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

let graph: Graph
const minZoom = 0.25
const maxZoom = 2
const zoomStep = 0.08
const zoom = ref(1)
const direction = ref<OrganizationChartDirection>('LR')

function zoomFormatTooltip (val: number) {
  let v = Math.round(val * 100)
  if (v > maxZoom * 100) {
    v = maxZoom * 100
  } else if (v < minZoom * 100) {
    v = minZoom * 100
  }
  return `${v}%`
}

function zoomChange(val: number | number[]) {
  if (!Array.isArray(val)) {
    graph.zoomTo(val)
  }
}

function setGraph(value: Graph) {

  value.zoomTo(zoom.value).enableMouseWheel().enablePanning()
  value.mousewheel.options.mousewheel.modifiers = ['ctrl', 'meta']
  value.mousewheel.options.mousewheel.guard = (e) => {
    e.preventDefault()
    if (!e.ctrlKey && !e.metaKey) {
      return false
    }
    const z = value.zoom()
    if (e.deltaY < 0 && z >= maxZoom) {
      return false
    }
    if (e.deltaY > 0 && z <= minZoom) {
      return false
    }
    return true
  }
  value.on('scale', ({ sy }) => {
    zoom.value = sy
  })
  graph = value
}

function renderNode(node: OrganizationNode) {
  return new Shape.Rect({
    width: 100,
    height: 100,
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

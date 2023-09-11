<template>
  <div class='h-full w-full'>
    <div ref='containerRef' />
  </div>
</template>

<script setup lang="ts">
import { Graph, Node, Edge, Shape, Cell } from '@antv/x6'
import * as dagre from 'dagre'
import { nextTick, shallowRef, watch, ref } from 'vue'

export interface OrganizationNode {
  id: string;
  data: any;
  children: OrganizationNode[];
}
const minZoom = 0.25
const maxZoom = 2
const zoom = ref(1)
let graph: Graph
const containerRef = shallowRef<HTMLDivElement>()
const direction = ref('LR')
const data = ref([
  {
    id: '1',
    data: {
      title: '技术部/863344',
    },
    children: [
      {
        id: '1-1',
        data: {
          title: '小红/787',
        },
        children: [
          {
            id: '1-1-1',
            data: {
              title: '张晓敏/100',
            },
            children: [
              {
                id: '1-1-1-1',
                data: {
                  title: '鱿鱼/158',
                },
                children: []
              },
              {
                id: '1-1-1-2',
                data: {
                  title: 'DJ/652',
                },
                children: []
              },
            ],
          },
        ],
      },
      {
        id: '1-2',
        data: {
          title: '李白/123',
        },
        children: [
          {
            id: '1-2-1',
            data: {
              title: '胡海/321',
            },
            children: []
          },
          {
            id: '1-2-2',
            data: {
              title: '伊一/63212',
            },
            children: [
              {
                id: '1-2-2-1',
                data: {
                  title: '花哈哈/96523',
                },
                children: []
              },
              {
                id: '1-2-2-2',
                data: {
                  title: '护手霜/555321',
                },
                children: []
              },
              {
                id: '1-2-2-3',
                data: {
                  title: '生地黄/56635',
                },
                children: []
              },
              {
                id: '1-2-2-4',
                data: {
                  title: '四季豆卡萨丁/63215',
                },
                children: []
              },
            ],
          },
        ],
      },
    ],
  },
])

watch(
  data,
  () => {
    nextTick(() => {
      if (!graph) {
        graph = createGraph()
        graph.resetCells(generateCells(data.value))
        autoLayout()
      }
    })
  },
  {
    immediate: true,
  }
)

function createGraph() {
  const graph = new Graph({
    container: containerRef.value,
    autoResize: true,
    interacting: false,
  })

  graph.zoomTo(zoom.value).enableMouseWheel().enablePanning()
  graph.mousewheel.options.mousewheel.modifiers = ['ctrl', 'meta']
  graph.mousewheel.options.mousewheel.guard = (e) => {
    e.preventDefault()
    if (!e.ctrlKey && !e.metaKey) {
      return false
    }
    const z = graph.zoom()
    if (e.deltaY < 0 && z >= maxZoom) {
      return false
    }
    if (e.deltaY > 0 && z <= minZoom) {
      return false
    }
    return true
  }
  graph.on('scale', ({ sy }) => {
    zoom.value = sy
  })
  return graph
}

function generateCells(tree: OrganizationNode[], parent?: Node) {
  let cells: Cell[] = []
  for (const item of tree) {
    const node = createNode(item)
    cells.push(node)
    if (parent) {
      cells.push(createEdge({ cell: parent.id }, { cell: node.id }))
    }
    if (item.children.length > 0) {
      cells = [...cells, ...generateCells(item.children, node)]
    }
  }
  return cells
}

function createNode(node: OrganizationNode) {
  const wrap = new Shape.HTML({ 
    width: 100, 
    height: 100, 
    data: node.data,
  })
  return wrap
}

function createEdge(source: Edge.TerminalCellLooseData, target: Edge.TerminalCellLooseData) {
  const edge = graph.createEdge({ source, target })
  edge.setZIndex(-1)
  edge.setAttrs({
    line: {
      strokeWidth: 2,
      stroke: '#A2B1C3',
      targetMarker: {
        name: 'ellipse',
        rx: 4, 
        ry: 4, 
      },
    },
  })
  edge.setConnector('rounded')

  return edge
}

function autoLayout() {
  const nodes = graph.getNodes()
  const edges = graph.getEdges()
  const layout = new dagre.graphlib.Graph()
  layout.setGraph({ rankdir: direction.value, nodesep: 100, ranksep: 100 })
  layout.setDefaultEdgeLabel(() => ({}))
  for (const node of nodes) {
    const size = node.size()
    layout.setNode(node.id, { width: size.width, height: size.height })
  }
  for (const edge of edges) {
    const source = edge.getSource() as Edge.TerminalCellLooseData
    const target = edge.getTarget() as Edge.TerminalCellLooseData
    layout.setEdge(source.cell as string, target.cell as string)
  }
  dagre.layout(layout)
  for (const id of layout.nodes()) {
    const layoutNode = layout.node(id)
    const graphNode = graph.getCellById(id) as Node
    if (graphNode) {
      graphNode.position(layoutNode.x, layoutNode.y, { silent: true })
    }
  }
  for (const edge of edges) {
    switch (direction.value) {
      case 'LR':
        setEdgeVerticesLR(edge)
        break
      case 'RL':
        setEdgeVerticesRL(edge)
        break
      case 'TB':
        setEdgeVerticesTB(edge)
        break
      case 'BT':
        setEdgeVerticesBT(edge)
        break
    }
  }
}

function setEdgeVerticesLR(edge: Edge<Edge.Properties>) {
  const source = edge.getSourceNode()!.getBBox()
  const target = edge.getTargetNode()!.getBBox()
  const gap = target.x - source.x - source.width
  const fix = source.width
  const x = source.x + fix + gap / 2
  edge.setVertices([
    { x, y: source.center.y },
    { x, y: target.center.y },
  ], { silent: true })
}

function setEdgeVerticesRL(edge: Edge<Edge.Properties>) {
  const source = edge.getSourceNode()!.getBBox()
  const target = edge.getTargetNode()!.getBBox()
  const gap = source.x + source.width - target.x - target.width
  const x = source.x - gap / 2
  edge.setVertices([
    { x, y: source.center.y },
    { x, y: target.center.y },
  ])
}

function setEdgeVerticesTB(edge: Edge<Edge.Properties>) {
  const source = edge.getSourceNode()!.getBBox()
  const target = edge.getTargetNode()!.getBBox()
  const gap = target.y - source.y - source.height
  const y = source.y + source.height + gap / 2
  edge.setVertices([
    { x: source.center.x, y },
    { x: target.center.x, y },
  ])
}

function setEdgeVerticesBT(edge: Edge<Edge.Properties>) {
  const source = edge.getSourceNode()!.getBBox()
  const target = edge.getTargetNode()!.getBBox()
  const gap = source.y + source.height - target.y - target.height
  const y = source.y - gap / 2
  edge.setVertices([
    { x: source.center.x, y },
    { x: target.center.x, y }
  ])
}

</script>

<style scoped>

</style>
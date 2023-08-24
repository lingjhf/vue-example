<template>
  <div ref='containerRef' />
</template>

<script setup lang="ts">
import { Graph, Cell, Node, Edge } from '@antv/x6'
import * as dagre from 'dagre'
import { nextTick, shallowRef, watch } from 'vue'

export interface OrganizationNode {
  key: string;
  meta: any;
  children?: OrganizationNode[];
}

interface OrganizationFlatNode {
  key: string;
  parent?: OrganizationFlatNode;
  meta: any;
  graphNode: Node<Node.Properties>;
}

interface NodeTerminalData {
  cell: string;
}

const props = withDefaults(
  defineProps<{
    data?: OrganizationNode[];
    direction?: 'LR' | 'RL' | 'TB' | 'BT';
    nodesep?: number;
    ranksep?: number;
    setGraph?: (graph: Graph) => void;
    renderNode: (node: OrganizationNode) => Node<Node.Properties>;
    renderEdge: (edge: Edge<Edge.Properties>) => void;
  }>(),
  {
    direction: 'LR',
    nodesep: 16,
    ranksep: 30,
    setGraph: undefined,
    data: () => [],
  }
)

let graph: Graph
const containerRef = shallowRef<HTMLDivElement>()

watch(
  () => props.data,
  () => {
    nextTick(() => {
      if (!graph) {
        graph = new Graph({
          container: containerRef.value,
          interacting: false,
        })
        props.setGraph?.(graph)
      }
      initNodes(props.data)
    })
  },
  {
    immediate: true,
  }
)

watch([() => props.direction, () => props.nodesep, () => props.ranksep], () => {
  autoLayout()
})

function initNodes(tree: OrganizationNode[]) {
  const rawNodes = treeToList(tree)
  const nodes: Node[] = []
  const edges: Edge[] = []
  for (const node of rawNodes) {
    if (node.parent) {
      nodes.push(node.graphNode)
      edges.push(createEdge(node.parent.graphNode, node.graphNode))
    } else {
      nodes.push(node.graphNode)
    }
  }
  graph.resetCells([...nodes, ...edges])
  autoLayout()
}

//自动布局
function autoLayout() {
  const nodes = graph.getNodes()
  const edges = graph.getEdges()
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', nodesep: props.nodesep, ranksep: props.ranksep })
  g.setDefaultEdgeLabel(() => ({}))

  const width = 260
  const height = 88
  nodes.forEach((node) => {
    g.setNode(node.id, { width, height })
  })

  edges.forEach((edge) => {
    const source = edge.getSource() as NodeTerminalData
    const target = edge.getTarget() as NodeTerminalData
    g.setEdge(source.cell, target.cell)
  })

  dagre.layout(g)

  g.nodes().forEach((id) => {
    const node = graph.getCellById(id) as Node
    if (node) {
      const pos = g.node(id)
      node.position(pos.x, pos.y)
    }
  })

  edges.forEach((edge) => {
    const source = edge.getSourceNode()!
    const target = edge.getTargetNode()!
    const sourceBBox = source.getBBox()
    const targetBBox = target.getBBox()

    if (sourceBBox.y !== targetBBox.y) {
      const gap = targetBBox.x - sourceBBox.x - sourceBBox.width

      const fix = sourceBBox.width
      const x = sourceBBox.x + fix + gap / 2
      edge.setVertices([
        { x, y: sourceBBox.center.y },
        { x, y: targetBBox.center.y },
      ])
    }
  })
}

function createEdge(source: Cell, target: Cell) {
  const edge = graph.createEdge({
    source: { cell: source.id },
    target: { cell: target.id },
  })
  props.renderEdge(edge)
  return edge
}

function treeToList(
  tree: OrganizationNode[],
  parent?: OrganizationFlatNode
): OrganizationFlatNode[] {
  const nodes: OrganizationFlatNode[] = []
  for (const node of tree) {
    const parentNode = {
      key: node.key,
      parent,
      meta: node.meta,
      graphNode: props.renderNode(node),
    }
    nodes.push(parentNode)
    if (Array.isArray(node.children) && node.children.length > 0) {
      nodes.push(...treeToList(node.children, parentNode))
    }
  }
  return nodes
}
</script>

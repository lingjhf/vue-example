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

export type OrganizationChartDirection = 'LR' | 'RL' | 'TB' | 'BT'

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
    direction?: OrganizationChartDirection;
    nodeSep?: number;
    rankSep?: number;
    autoResize?: boolean;
    setGraph?: (graph: Graph) => void;
    renderNode: (node: OrganizationNode) => Node<Node.Properties>;
    renderEdge: (edge: Edge<Edge.Properties>) => void;
  }>(),
  {
    direction: 'LR',
    nodeSep: 16,
    rankSep: 30,
    autoResize: true,
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
          autoResize: props.autoResize,
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

watch(
  [() => props.direction, () => props.nodeSep, () => props.rankSep],
  () => {
    nextTick(() => {
      autoLayout()
    })
  }, 
  {
    immediate: true
  }
)

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
  g.setGraph({ rankdir: props.direction, nodesep: props.nodeSep, ranksep: props.rankSep })
  g.setDefaultEdgeLabel(() => ({}))
  nodes.forEach((node) => {
    const size = node.getSize()
    g.setNode(node.id, { width: size.width, height: size.height })
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
      node.position(pos.x, pos.y, { silent: true })
    }
  })

  edges.forEach((edge) => {
    switch (props.direction) {
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
  })
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
  ])
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

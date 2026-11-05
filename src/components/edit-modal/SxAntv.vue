<template>
	<div
		id="container"
		class="antvContainer"
		style="width: 100%; height: 100%"
	></div>
</template>
<script setup lang="ts">
import G6 from '@antv/g6'
import { ref, onMounted } from 'vue'
import { queryworkflowsimpledescription } from 'api/useCommon'
const data = ref({})
const props = defineProps({
	workflow_id: Number,
})
const isOpen = ref<boolean>(false)

let graph = ref(null)
let zoom = ref(null)

const fetchGraphData = async () => {
	queryworkflowsimpledescription({ id: props.workflow_id }).then((result) => {
		if (result.code === 1) {
			let nodes = []
			let edges = []
			result.data.workflow_state_info.map((stateItem) =>
				nodes.push({
					id: String(stateItem.id),
					name: stateItem.name,
					conf: stateItem.name,
					// dataType: 'sql',
					dataType: 'alps',
					// type: 'rect',
					// label: stateItem.name
				})
			)
			result.data.workflow_transition_info.map((transitionItem) => {
				if (transitionItem.condition_expression !== '[]') {
					let condition_expression_obj = JSON.parse(transitionItem.condition_expression)
					nodes.push({
						id: `condition_${transitionItem.id}`,
						name: '条件表达式',
						// dataType: 'sql',
						dataType: 'alps',
						type: 'diamond',
						label: '条件表达式',
					})
					edges.push({
						source: String(transitionItem.source_state_id),
						target: `condition_${transitionItem.id}`,
						label: transitionItem.name,
					})
					condition_expression_obj.map((conditionItem) => {
						edges.push({
							source: `condition_${transitionItem.id}`,
							target: String(conditionItem.target_state_id),
							label: conditionItem.expression,
						})
					})
				} else {
					edges.push({
						source: String(transitionItem.source_state_id),
						target: String(transitionItem.destination_state_id),
						label: transitionItem.name,
					})
				}
			})
			console.log(
				JSON.parse(
					JSON.stringify({
						nodes,
						edges,
					})
				)
			)
			data.value = {
				nodes,
				edges,
			}

			G6.registerNode(
				'sql',
				{
					drawShape(cfg, group) {
						const rect = group.addShape('rect', {
							attrs: {
								x: -75,
								y: -25,
								width: 150,
								height: 50,
								radius: 10,
								stroke: '#5B8FF9',
								fill: '#C6E5FF',
								lineWidth: 3,
							},
							name: 'rect-shape',
						})
						if (cfg.name) {
							group.addShape('text', {
								attrs: {
									text: cfg.name,
									x: 0,
									y: 0,
									fill: '#00287E',
									fontSize: 14,
									textAlign: 'center',
									textBaseline: 'middle',
									fontWeight: 'bold',
								},
								name: 'text-shape',
							})
						}
						return rect
					},
				},
				'single-node'
			)
			const minimap = new G6.Minimap()
			const container = document.getElementById('container')
			console.dir(container)

			const width = container.clientWidth
			const height = container.parentNode.clientHeight - 130
			graph.value = new G6.Graph({
				container: 'container',
				width,
				height,
				plugins: [minimap],
				layout: {
					type: 'dagre',
					ranksep: 40,
					controlPoints: true,
				},
				defaultNode: {
					type: 'sql',
					style: {
						radius: 200,
						offset: 45,
						endArrow: true,
						lineWidth: 2,
						stroke: '#C2C8D5',
					},
				},
				// defaultEdge: {
				// 	type: 'polyline',
				// 	style: {
				// 		radius: 20,
				// 		offset: 45,
				// 		endArrow: true,
				// 		lineWidth: 2,
				// 		stroke: '#C2C8D5',
				// 	},
				// },
				defaultEdge: {
					type: 'polyline',
					style: {
						stroke: 'rgb(211, 211, 211)',
						shadowBlur: 1,
						shadowOffsetY: 1,
						lineDash: [0, 0],
						radius: 20,
						cursor: 'default',
						startArrow: {
							path: '',
						},
						shadowOffsetX: 1,
						endArrow: true,
						// endArrow: {
						// 	$arrowType: 'diy',
						// 	$path: 'M 0,0 L 10,5 L 10,-5 Z',
						// 	$compute: (e) => e,
						// 	path: 'M 0,0 L 10,5 L 10,-5 Z',
						// 	d: 5,
						// 	fill: '#00ff00',
						// 	stroke: '#ff0000',
						// },
					},
					labelCfg: {
						position: 'middle',
						style: {
							textAlign: 'center',
							textBaseline: 'middle',
							fontStyle: 'normal',
							fontSize: 12,
						},
						refX: 0,
						autoRotate: true,
						refY: 10,
					},
				},
				nodeStateStyles: {
					selected: {
						stroke: '#d9d9d9',
						fill: '#5394ef',
					},
					hover: {
						stroke: 'red',
						lineWidth: 3,
					},
				},
				edgeStateStyles: {
					hover: {
						stroke: 'blue',
						lineWidth: 3,
					},
				},
				modes: {
					default: ['drag-canvas', 'zoom-canvas', 'click-select', 'drag-node'],
				},
				// fitView: true
			})
			graph.value.data(data.value)
			graph.value.render()
			zoom.value = graph.value.getZoom()
			graph.value.zoom(zoom.value / 2)

			graph.value.on('node:mouseenter', (evt) => {
				graph.value.setItemState(evt.item, 'hover', true)
			})

			graph.value.on('node:mouseleave', (evt) => {
				graph.value.setItemState(evt.item, 'hover', false)
			})

			graph.value.on('edge:mouseenter', (evt) => {
				graph.value.setItemState(evt.item, 'hover', true)
			})

			graph.value.on('edge:mouseleave', (evt) => {
				graph.value.setItemState(evt.item, 'hover', false)
			})
			//自适应
			// 在渲染和动画完成后调用
			graph.value.fitCenter()

			// document.querySelector('#container').addEventListener(
			//   'mouseenter',
			//   () => {
			//     document.querySelector('.ant-modal-wrap').style.overflow = 'hidden';
			//   },
			//   false
			// );
			// document.querySelector('#container').addEventListener(
			//   'mouseleave',
			//   () => {
			//     document.querySelector('.ant-modal-wrap').style.overflow = 'auto';
			//   },
			//   false
			// );
		} else {
			// message.error(result.msg);
		}
	})
}

onMounted(async () => {
	// await fetchGraphData();
	await open()
})
async function open() {
	if (!isOpen.value) {
		isOpen.value = true
		await fetchGraphData()
	}
}

const destoryG6 = () => {
	console.log('g6销毁')
	zoom.value = null
	graph.value.destroy()
	graph.value = null
}

open()

//抛出事件
defineExpose({
	open,
	destoryG6,
})
</script>
<style lang="scss" scoped>
.antvContainer {
	height: 100%;
}
</style>

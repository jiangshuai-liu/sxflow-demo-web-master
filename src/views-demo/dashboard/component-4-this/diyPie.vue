<template>
	<div class="autoPie">
		<div
			:id="props.useIdName + 'pie'"
			class="autoPieChart"
		></div>

		<div class="usePieList">
			<div
				class="usePieItem"
				v-for="(item, index) in echartData"
				:key="index"
			>
				<div
					class="colorLine"
					:style="`background : ${colorList[index]}`"
				></div>

				<div
					class="titleAndNum"
					@click="selectRate(item)"
				>
					<p>
						{{ item['name'] }}
					</p>
					<span>{{ item['percent'] }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
let colorList = [
	'#ff7f50',
	'#87cefa',
	'#da70d6',
	'#32cd32',
	'#6495ed',
	'#ff69b4',
	'#ba55d3',
	'#cd5c5c',
	'#ffa500',
	'#40e0d0',
	'#1e90ff',
	'#ff6347',
	'#7b68ee',
	'#00fa9a',
	'#ffd700',
	'#6b8e23',
	'#ff00ff',
	'#3cb371',
	'#b8860b',
	'#30e0e0',
]

const emits = defineEmits(['selectRate'])
const props = defineProps({
	useIdName: {
		type: String,
		default: '',
	},
})
let echartData = ref([])
let myChart
let timeTicket: any = null

let diyOption = ref({
	backgroundColor: '#fff',
	color: colorList,
	title: [
		{
			top: 'center',
			right: 'center',
			text: '',
			textStyle: {},
		},
	],
	series: [
		{
			type: 'pie',
			radius: ['65%', '90%'],
			center: ['50%', '50%'],
			data: [],
			hoverAnimation: true,
			itemStyle: {
				normal: {
					borderColor: '#ffffff',
					borderWidth: 1,
				},
			},
			emphasis: {
				scaleSize: 15,
			},
			labelLine: {
				show: false,
			},
			label: {
				show: false,
			},
		},
	],
})

const selectRate = (item) => {
	emits('selectRate', item)
}

const setChartData = (data: never[]) => {
	diyOption.value.series[0].data = data
	echartData.value = data
	myChart.setOption(diyOption.value)
}

const autoHover = (myChart, option, num, time) => {
	let defaultData = {
		//设置默认值
		time: 2000,
		num: 100,
	}
	if (!time) {
		time = defaultData.time
	}
	if (!num) {
		num = defaultData.num
	}
	let count = 0
	// let count = 0

	timeTicket && clearInterval(timeTicket)
	timeTicket = setInterval(function () {
		myChart.dispatchAction({
			type: 'downplay',
			seriesIndex: 0, //serieIndex的索引值   可以触发多个
		})
		myChart.dispatchAction({
			type: 'highlight',
			seriesIndex: 0,
			dataIndex: count,
		})
		myChart.dispatchAction({
			type: 'showTip',
			seriesIndex: 0,
			dataIndex: count,
		})
		count++

		if (count >= num) {
			count = 0
		}
	}, time)
	myChart.on('mouseover', function (params) {
		clearInterval(timeTicket)
		myChart.dispatchAction({
			type: 'downplay',
			seriesIndex: 0,
		})
		myChart.dispatchAction({
			type: 'highlight',
			seriesIndex: 0,
			dataIndex: params.dataIndex,
		})
		myChart.dispatchAction({
			type: 'showTip',
			seriesIndex: 0,
			dataIndex: params.dataIndex,
		})
		count = params.dataIndex
	})
	myChart.on('mouseout', function () {
		timeTicket && clearInterval(timeTicket)
		timeTicket = setInterval(function () {
			myChart.dispatchAction({
				type: 'downplay',
				seriesIndex: 0, //serieIndex的索引值   可以触发多个
			})
			myChart.dispatchAction({
				type: 'highlight',
				seriesIndex: 0,
				dataIndex: count,
			})
			myChart.dispatchAction({
				type: 'showTip',
				seriesIndex: 0,
				dataIndex: count,
			})
			count++
			if (count >= num) {
				count = 0
			}
		}, defaultData.time)
	})
}

const resizeEcharts = () => {
	myChart.resize()
}

const initChart = (data) => {
	const diyDiv = document.getElementById(props.useIdName + 'pie')
	myChart = echarts.init(diyDiv)

	setChartData(data)
	myChart.on('highlight', (event) => {
		let name = echartData.value[event.dataIndex]?.name
		let value = echartData.value[event.dataIndex]?.percent
		diyOption.value.title[0].text = '{name|' + name + '}\n{val|' + value + '}'
		diyOption.value.title[0].textStyle = {
			rich: {
				name: {
					fontSize: 14,
					align: 'center',
					fontWeight: '400',
					padding: [10, 0],
					color: '#606266',
				},
				val: {
					fontSize: 32,
					align: 'center',
					fontWeight: 'bold',
					color: '#1D2129',
				},
			},
		}
		myChart.setOption(diyOption.value)
		window.addEventListener('resize', resizeEcharts)
	})
	autoHover(myChart, diyOption.value, echartData.value.length, 3000)
}

const destoryChart = () => {
	window.removeEventListener('resize', resizeEcharts)
	timeTicket && clearInterval(timeTicket)
	timeTicket = null

	myChart.dispose()
	myChart = null
}

onMounted(() => {
	// 基于准备好的dom，初始化echarts实例
	// 绘制图表
})

onUnmounted(() => {
	console.log('unmounted')
	destoryChart()
})

defineExpose({
	initChart,
	destoryChart,
})
</script>
<style lang="scss" scoped>
p {
	margin: 0;
	padding: 0;
}
.autoPie {
	display: flex;
}
.autoPieChart {
	height: 300px;
	width: 300px;
	margin: 0 auto;
}

.usePieList {
	width: 280px;
	height: 322px;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	overflow-x: hidden;

	&::-webkit-scrollbar {
		width: 3px;
		height: 8px;
	}
}

.usePieItem {
	width: 280px;
	height: 44px;
	background: #fafafa;
	border-radius: 4px 4px 4px 4px;
	margin-bottom: 8px;
	display: flex;
	justify-content: space-between;
	padding: 8px 12px;
	box-sizing: border-box;
}

.colorLine {
	width: 4px;
	height: 28px;
	background: #eb423f;
	border-radius: 100px;
	border: 1px solid rgba(255, 255, 255, 0.5);
	margin-right: 12px;
}
.titleAndNum {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-family: Microsoft YaHei UI, Microsoft YaHei UI;
	font-weight: 400;
	font-size: 14px;
	color: #303133;
	cursor: pointer;
	span {
		font-family: Helvetica Neue, Helvetica Neue;
		font-weight: bold;
		font-size: 16px;
	}
}
</style>

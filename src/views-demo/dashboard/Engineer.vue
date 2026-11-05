<template>
	<div class="dashboardPage">
		<sx-title title="数据监控看板">
			<template #titleBtn>
				<div
					class="timeBox"
					style="width: 400px"
				>
					<el-date-picker
						style="width: 400px"
						v-model="searchForm.timeList"
						value-format="YYYY-MM-DD HH:mm:ss"
						type="datetimerange"
						range-separator="至"
						start-placeholder="起始日期"
						end-placeholder="结束日期"
						@change="changeTime"
					/>
				</div>
			</template>
		</sx-title>
		<div class="stateTotal">
			<p class="chartTitle commonChartTitle">事项总量监控</p>

			<div class="numPic">
				<img
					:src="lczs"
					alt="事项总览"
				/>
				<div class="numPicNum">
					{{ commonData.allCount }}
				</div>
			</div>
			<div
				class="stateTotalLine"
				:style="getLineStyle()"
			></div>
			<div class="doubleNum">
				<div class="titleNum">
					填报事项总数&nbsp;<span>{{ commonData.fillingCount }}</span>
				</div>
				<div class="titleNum">
					审核事项总数&nbsp;<span>{{ commonData.relationCount }}</span>
				</div>
			</div>
		</div>

		<div class="blockFour">
			<div class="commonBlock">
				<p class="chartTitle commonChartTitle">待办事项监控</p>

				<div id="dblc"></div>
			</div>
			<div class="commonBlock">
				<p class="chartTitle commonChartTitle">已办结事项监控</p>
				<div
					id="lcbj"
					class="lcbjList"
				>
					<div
						class="lcbjItem"
						v-for="(item, index) in commonData.finishflow"
						:key="index"
					>
						<div class="wordsLine">
							<div class="titleWords">{{ item.name }}</div>
							<div class="rateNum">
								办结率&nbsp;<span>{{ item.percent }}</span>
							</div>
						</div>
						<div class="greyLine">
							<div
								class="colorLine"
								:style="`width: ${item.percent}`"
							></div>
						</div>
					</div>
				</div>
			</div>
			<div class="commonBlock">
				<p class="chartTitle commonChartTitle">填报事项监控</p>
				<diy-pie
					:useIdName="'cjlc'"
					:echartData="cjlcChartData"
					ref="cjlcChartRef"
				/>
			</div>
			<div class="commonBlock">
				<p class="chartTitle commonChartTitle">审核事项监控</p>
				<div id="splc"></div>
				<diy-pie
					:useIdName="'splc'"
					ref="splcChartRef"
				/>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import SxTitle from 'coms/common/SxTitle.vue'
import * as echarts from 'echarts'
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { queryflowinfo, querydutyflow } from 'api/dashboard'
import diyPie from './component-4-this/diyPie.vue'

let commonData = ref({
	relationCount: null,
	finishflow: [],
	allCount: null,
	fillingCount: null,
})

const lczs = new URL(`../../assets/index/ico_lczs.png`, import.meta.url).href
let dblcChart
const cjlcChartRef = ref(null)
const splcChartRef = ref(null)
const dblcOption = ref({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			// 坐标轴指示器，坐标轴触发有效
			type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
		},
	},
	grid: {
		left: '9%',
		right: '4%',
		bottom: '14%',
		top: '16%',
		containLabel: true,
	},
	xAxis: {
		type: 'category',
		data: [],
		axisLine: {
			lineStyle: {
				color: '#86909C',
			},
		},
		axisTick: {
			show: false,
		},
		axisLabel: {
			textStyle: {
				fontFamily: 'Microsoft YaHei',
				color: '#86909C',
			},
			width: 40, //将内容的宽度固定
			overflow: 'truncate', //超出的部分截断
			truncate: '...', //截断的部分用...代替
			interval: 0,
		},
	},

	yAxis: {
		type: 'value',
		name: '单位',
		nameLocation: 'end',
		nameTextStyle: {
			align: 'right',
			// align: 'left',
		},
		axisLine: {
			show: false,
		},
		splitLine: {
			show: true,
			lineStyle: {
				type: 'dashed',
				color: '#86909C',
			},
		},
		axisLabel: {
			textStyle: {
				color: '#86909C',
			},
		},
	},

	series: [
		{
			// name: '1',
			type: 'bar',
			barWidth: '15%',
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: '#FFB546',
						},
						{
							offset: 1,
							color: '#FFB27F',
						},
					]),
					barBorderRadius: [6, 6, 0, 0],
				},
			},
			data: [],
		},
	],
})

const splcChartData = ref([])
const cjlcChartData = ref([])

let searchForm = ref({
	timeList: [],
	userType: 'option',
	startDate: '',
	endDate: '',
})

const resizeEcharts = () => {
	dblcChart.resize()
}

const getLineStyle = (): string => {
	const rate = (commonData.value.fillingCount / commonData.value.allCount) * 100
	const whiteRateStrat = rate < 99.8 ? rate : 100
	const whiteRateEnd = whiteRateStrat == 100 ? whiteRateStrat : whiteRateStrat + 0.2
	const str = `background: linear-gradient(115deg, red, red ${rate + '%'}, white ${whiteRateStrat + '%'}, white ${whiteRateEnd + '%'}, blue ${
		whiteRateEnd + '%'
	}, blue);`
	return str
}

const changeTime = () => {
	if (searchForm.value.timeList.length) {
		searchForm.value = {
			...searchForm.value,
			startDate: searchForm.value.timeList[0],
			endDate: searchForm.value.timeList[1],
		}
	}
	init(searchForm.value)
}

const init = async (form = { userType: 'option' }) => {
	await destoryEcharts()
	await queryflowinfo(form).then((res) => {
		console.log(res.data)
		const data = res.data
		commonData.value = {
			relationCount: data.relationCount,
			finishflow: data.finishflow,
			allCount: data.allCount,
			fillingCount: data.fillingCount,
		}
		splcChartData.value = data.confirmflow.map((item) => {
			return {
				...item,
				value: Number(item.percent.slice(0, -1)),
			}
		})
		cjlcChartData.value = data.fillingflow.map((item) => {
			return {
				...item,
				value: Number(item.percent.slice(0, -1)),
			}
		})
		setTimeout(() => {
			console.log(splcChartData, 'splcChartData')

			cjlcChartData.value.length && cjlcChartRef.value.initChart(cjlcChartData.value)
			splcChartData.value.length && splcChartRef.value.initChart(splcChartData.value)
		}, 500)
	})
	await querydutyflow(form).then((res) => {
		let XUse = []
		let YUse = []
		res.data.forEach((item) => {
			XUse.push(item.name)
			YUse.push(item.dutycount)
		})

		dblcOption.value.xAxis.data = XUse
		dblcOption.value.series[0].data = YUse

		// 基于准备好的dom，初始化echarts实例
		const dblcDiv = document.getElementById('dblc')
		dblcChart = echarts.init(dblcDiv)
		nextTick(() => {
			dblcChart.setOption(dblcOption.value)

			window.addEventListener('resize', resizeEcharts)
		})
	})
}

const destoryEcharts = () => {
	dblcChart && dblcChart.dispose()
	dblcChart = null

	window.removeEventListener('resize', resizeEcharts)
}

onMounted(() => {
	// console.log('dashboards')
	init()
})
onUnmounted(() => {
	destoryEcharts()
})
</script>
<style lang="scss" scoped>
p {
	padding: 0;
	margin: 0;
}
.stateTotalLine {
	height: 16px;
	width: 100%;
	border-radius: 8px;
	// position: relative;
	overflow: hidden;
}

:deep(.SxTitle p) {
	font-size: 20px;
	font-weight: bold;
}
.commonChartTitle {
	height: 40px;
	line-height: 40px;
	font-weight: bold;
	font-size: 16px;
	color: #303133;
}
.stateTotal {
	height: 236px;
	background: #ffffff;
	border-radius: 8px;
	padding: 24px 32px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;

	.doubleNum {
		display: flex;
		justify-content: space-between;
		font-weight: 400;
		font-size: 14px;
		color: #606266;
		margin-top: 19px;
		span {
			font-family: Helvetica Neue, Helvetica Neue;
			font-weight: bold;
			font-size: 18px;
			color: #303133;
		}
	}

	.titleNum {
		display: flex;
		align-items: center;
	}
}

.numPic {
	font-family: Helvetica Neue, Helvetica Neue;
	font-weight: bold;
	font-size: 32px;
	color: #1d2129;
	margin: 16px 0;
	display: flex;
	align-items: center;
	img {
		width: 56px;
		height: 56px;
		margin-right: 16px;
	}
}

.blockFour {
	margin-top: 24px;
	display: flex;
	flex-wrap: wrap;
	gap: 32px;
	.commonBlock {
		width: calc(50% - 16px);
		height: 407px;
		background: #ffffff;
		border-radius: 8px;
		padding: 24px 32px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		& > div {
			flex: 1;
		}
	}
}

.lcbjList {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: auto;
	&::-webkit-scrollbar {
		width: 0px;
	}
	.lcbjItem {
		display: flex;
		flex-direction: column;
		height: 61px;
		margin-bottom: 5px;
	}
	.wordsLine {
		display: flex;
		justify-content: space-between;
		font-family: Microsoft YaHei UI, Microsoft YaHei UI;
		font-weight: 400;
		font-size: 14px;
		color: #303133;
		height: 28px;
	}
	.rateNum {
		text-align: right;
		display: flex;
		align-items: center;
		span {
			font-family: Helvetica Neue, Helvetica Neue;
			font-weight: bold;
			font-size: 18px;
		}
	}

	.greyLine {
		margin-top: 11px;
		height: 6px;
		background: #e6e8eb;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	}

	.colorLine {
		position: absolute;
		left: 0;
		top: 0;
		border-radius: 8px;
		height: 6px;
		background: linear-gradient(270deg, #ff832a 0%, #f58d7b 100%);
	}
}
</style>

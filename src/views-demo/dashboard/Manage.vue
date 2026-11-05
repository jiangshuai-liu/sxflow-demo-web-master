<template>
	<div class="dashboardPage">
		<sx-title title="数据分析看板">
			<template #titleBtn>
				<div
					class="timeBox"
					style="width: 400px"
				>
					<el-date-picker
						style="width: 400px"
						v-model="timeList"
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
		<div class="blockDouble">
			<div class="commonBlock">
				<div class="chartTitle commonChartTitle">
					<p>事项总量分析</p>

					<el-radio-group
						v-model="chartDateList.lczsDate"
						@change="changeChartDate('lczs')"
					>
						<el-radio-button
							label="年度"
							value="year"
						/>
						<el-radio-button
							label="季度"
							value="quarter"
						/>
						<el-radio-button
							label="月度"
							value="month"
						/>
					</el-radio-group>
				</div>

				<div
					class="commonDiv"
					id="lczs"
				></div>
			</div>
			<div class="commonBlock">
				<div class="chartTitle commonChartTitle">
					<p>已办结事项分析</p>

					<el-radio-group
						v-model="chartDateList.lcbjDate"
						@change="changeChartDate('lcbj')"
					>
						<el-radio-button
							label="年度"
							value="year"
						/>
						<el-radio-button
							label="季度"
							value="quarter"
						/>
						<el-radio-button
							label="月度"
							value="month"
						/>
					</el-radio-group>
				</div>

				<div
					id="lcbj"
					class="commonDiv"
				></div>
			</div>
		</div>
		<div class="blockOne">
			<div class="commonBlock">
				<div class="chartTitle commonChartTitle">
					<p>业务热度分析</p>

					<el-radio-group
						v-model="chartDateList.lcrdDate"
						@change="changeChartDate('lcrd')"
					>
						<el-radio-button
							label="年度"
							value="year"
						/>
						<el-radio-button
							label="季度"
							value="quarter"
						/>
						<el-radio-button
							label="月度"
							value="month"
						/>
					</el-radio-group>
				</div>
				<el-tabs
					v-model="activeName"
					class="demo-tabs"
					@tab-click="handleClick"
				>
					<el-tab-pane
						:label="item.name"
						:name="item.id"
						v-for="item in tabList"
						:key="item.id"
					>
					</el-tab-pane>
				</el-tabs>
				<div
					id="lcrd"
					class="commonDiv"
				></div>
			</div>
		</div>

		<div class="blockDoubleBottom">
			<div class="commonBlock">
				<div class="commonBlocks">
					<p class="chartTitle commonChartTitle">填报事项分析</p>
					<diy-pie
						:useIdName="'cjlc'"
						ref="cjlcChartRef"
						@selectRate="getFillingRank"
					/>
				</div>
				<div class="commonBlocks rightBlock">
					<p class="chartTitle commonChartTitle">
						{{ commonData.fillingTitle }}
					</p>
					<div
						id="lcbj"
						class="lcbjList"
					>
						<div
							class="lcbjItem"
							v-for="(item, index) in commonData.fillingflowranking"
							:key="index"
						>
							<div :class="{ commonNum: true, indexNum: index > 2, firNum: index == 0, secNum: index == 1, thrNum: index == 2 }">
								{{ index + 1 }}
							</div>
							<div class="mainTitleLine">
								<div class="wordsLine">
									{{ item.name }}
								</div>
								<div class="lineNumber">
									<div class="greyLine">
										<div
											class="colorLine"
											:style="`width: ${item.persent}%`"
										></div>
									</div>
									<div class="rateNum">
										{{ item.number }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="commonBlock">
				<div class="commonBlocks">
					<p class="chartTitle commonChartTitle">审批事项分析</p>
					<div id="splc"></div>
					<diy-pie
						:useIdName="'splc'"
						ref="splcChartRef"
						@selectRate="getconfireRank"
					/>
				</div>
				<div class="commonBlocks rightBlock">
					<p class="chartTitle commonChartTitle">
						{{ commonData.confireTitle }}
					</p>
					<div
						id="lcbj"
						class="lcbjList"
					>
						<div
							class="lcbjItem"
							v-for="(item, index) in commonData.confireflowranking"
							:key="index"
						>
							<div :class="{ commonNum: true, indexNum: index > 2, firNum: index == 0, secNum: index == 1, thrNum: index == 2 }">
								{{ index + 1 }}
							</div>
							<div class="mainTitleLine">
								<div class="wordsLine">
									{{ item.name }}
								</div>
								<div class="lineNumber">
									<div class="greyLine">
										<div
											class="colorLine"
											:style="`width: ${item.persent}%`"
										></div>
									</div>
									<div class="rateNum">
										{{ item.number }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import SxTitle from 'coms/common/SxTitle.vue'
import * as echarts from 'echarts'
import { ref, onMounted, nextTick, onUnmounted, reactive } from 'vue'
import {
	queryflowinfo,
	queryfinishflowbyadmin,
	queryallflowbyadmin,
	queryallworkflowbyadmin,
	queryflowheatbyadmin,
	queryfillingflowranking,
	queryconfireflowranking,
} from 'api/dashboard'
import diyPie from './component-4-this/diyPie.vue'
import { chartUseFunction } from '@/utils/common'
import { commonDateType, chartDateListType, manageChartType } from '@/types/dashboard'

import type { TabsPaneContext } from 'element-plus'
let timeList = ref([])

let commonData = ref({
	relationCount: null,
	finishflow: [],
	fillingflowranking: [],
	confireflowranking: [],
	fillingTitle: '',
	confireTitle: '',
})

const chartNameList = ['lczs', 'lcbj', 'lcrd']

let tabList = ref([])
let chartList = {
	lczsChart: null,
	lcbjChart: null,
	lcrdChart: null,
}

let chartDateList = reactive<chartDateListType<commonDateType>>({
	lczsDate: 'year',
	lcbjDate: 'year',
	lcrdDate: 'year',
})
let optionList = reactive({
	lczsOption: {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
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
								color: '#EB3F53',
							},
							{
								offset: 1,
								color: '#FF6F5C',
							},
						]),
						barBorderRadius: [4, 4, 0, 0],
					},
				},
				data: [],
			},
		],
	},
	lcbjOption: {
		grid: {
			top: '8%',
			left: '1%',
			right: '1%',
			bottom: '8%',
			containLabel: true,
		},
		legend: {
			itemGap: 50,
			data: ['已办结事项分析'],
			textStyle: {
				color: '#f9f9f9',
				borderColor: '#fff',
			},
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			axisLine: {
				//坐标轴轴线相关设置。数学上的x轴
				show: true,
				lineStyle: {
					color: '#86909C',
				},
			},
			axisLabel: {
				//坐标轴刻度标签的相关设置
				textStyle: {
					fontFamily: 'Microsoft YaHei',
					color: '#86909C',
				},
			},
			data: [],
		},
		yAxis: [
			{
				type: 'value',
				min: 0,
				// max: 140,
				splitNumber: 7,
				splitLine: {
					show: true,
					lineStyle: {
						type: 'dashed',
						color: '#86909C',
					},
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
					margin: 20,
					textStyle: {
						color: '#86909C',
					},
				},
				axisTick: {
					show: false,
				},
			},
		],
		series: [
			{
				name: '流程办结',
				type: 'line',
				smooth: true, //是否平滑曲线显示
				symbolSize: 10,
				symbol: 'circle',
				showSymbol: true,
				lineStyle: {
					normal: {
						color: '#FF832A', // 线条颜色
					},
				},

				itemStyle: {
					normal: {
						color: '#FF832A',
					},
				},
				tooltip: {
					show: false,
				},
				areaStyle: {
					//区域填充样式
					normal: {
						color: new echarts.graphic.LinearGradient(
							0,
							0,
							0,
							1,
							[
								{
									offset: 0,
									color: 'rgba(255, 131, 42, 1)',
								},
								{
									offset: 1,
									color: 'rgba(255, 131, 42, 0)',
								},
							],
							false
						),
					},
				},
				data: [],
			},
		],
	},
	lcrdOption: {
		grid: {
			top: '8%',
			left: '1%',
			right: '1%',
			bottom: '8%',
			containLabel: true,
		},
		legend: {
			itemGap: 50,
			data: ['流程热度'],
			textStyle: {
				color: '#f9f9f9',
				borderColor: '#fff',
			},
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			axisLine: {
				//坐标轴轴线相关设置。数学上的x轴
				show: true,
				lineStyle: {
					color: '#86909C',
				},
			},
			axisLabel: {
				//坐标轴刻度标签的相关设置
				textStyle: {
					fontFamily: 'Microsoft YaHei',
					color: '#86909C',
				},
			},

			data: [],
		},
		yAxis: [
			{
				type: 'value',
				min: 0,
				// max: 140,
				splitNumber: 7,
				splitLine: {
					show: true,
					lineStyle: {
						type: 'dashed',
						color: '#86909C',
					},
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
					margin: 20,
					textStyle: {
						color: '#86909C',
					},
				},
				axisTick: {
					show: false,
				},
			},
		],
		series: [
			{
				name: '流程办结',
				type: 'line',
				symbolSize: 10,
				symbol: 'circle',
				showSymbol: true,
				lineStyle: {
					normal: {
						color: '#FF832A', // 线条颜色
					},
				},

				itemStyle: {
					normal: {
						color: '#FF832A',
					},
				},
				tooltip: {
					show: false,
				},
				areaStyle: {
					//区域填充样式
					normal: {
						color: new echarts.graphic.LinearGradient(
							0,
							0,
							0,
							1,
							[
								{
									offset: 0,
									color: 'rgba(255, 131, 42, 1)',
								},
								{
									offset: 1,
									color: 'rgba(255, 131, 42, 0)',
								},
							],
							false
						),
					},
				},
				data: [],
			},
		],
	},
})

let initCommonChart
let destroyChart
let changeCommonChart

const cjlcChartRef = ref(null)
const splcChartRef = ref(null)

const splcChartData = ref([])
const cjlcChartData = ref([])

const activeName = ref<number | null>(null)

const handleClick = (tab: TabsPaneContext, event: Event) => {
	activeName.value = tab.props.name as number
	changeChartDate('lcrd')
}

const changeChartDate = async (type: manageChartType) => {
	console.log(chartDateList[`${type}Date`])

	let dataObj: any = {}

	if (type == 'lcrd') {
		dataObj.id = activeName.value
	}

	await changeChartOption(type, { dateTag: chartDateList[`${type}Date`], ...dataObj })

	setTimeout(() => {
		changeCommonChart(type, optionList[`${type}Option`])
	}, 500)
}

const changeChartOption = (type: manageChartType, obj: { dateTag: commonDateType; startDate?: string; endDate?: string; id?: number }) => {
	let url
	switch (type) {
		case 'lczs':
			url = queryallflowbyadmin
			break
		case 'lcbj':
			url = queryfinishflowbyadmin
			break
		case 'lcrd':
			url = queryflowheatbyadmin
			break

		default:
			break
	}
	obj.startDate = timeList.value[0]
	obj.endDate = timeList.value[1]
	url(obj).then((res) => {
		if (type != 'lcrd') {
			let seriesData = []
			let xAxisData = []
			res.data.forEach((item) => {
				xAxisData.push(item.rq)
				seriesData.push(item.sum)
			})
			optionList[`${type}Option`].series[0].data = seriesData
			optionList[`${type}Option`].xAxis.data = xAxisData
		} else {
			let seriesData = []
			let xAxisData = []
			res.data.forEach((item) => {
				xAxisData.push(item.rq)
				seriesData.push(item.sum)
			})
			optionList[`${type}Option`].series[0].data = seriesData
			optionList[`${type}Option`].xAxis.data = xAxisData
		}
	})
}

const getFillingRank = (intoObj: { id?: number; name?: string } = {}) => {
	const obj: any = {
		id: intoObj?.id || cjlcChartData.value[0].id,
	}

	commonData.value.fillingTitle = intoObj?.name || cjlcChartData.value[0].name
	if (timeList.value.length) {
		obj.startDate = timeList.value[0]
		obj.endDate = timeList.value[1]
	}
	queryfillingflowranking(obj).then((res) => {
		commonData.value.fillingflowranking = res.data
	})
}

const getconfireRank = (intoObj: { id?: number; name?: string } = {}) => {
	const obj: any = {
		id: intoObj?.id || splcChartData.value?.[0]?.id,
	}

	commonData.value.confireTitle = intoObj?.name || splcChartData.value?.[0]?.name
	if (timeList.value.length) {
		obj.startDate = timeList.value[0]
		obj.endDate = timeList.value[1]
	}
	queryconfireflowranking(obj).then((res) => {
		commonData.value.confireflowranking = res.data
	})
}

const init = async () => {
	await queryflowinfo({}).then((res) => {
		console.log(res.data)
		const data = res.data

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

		getFillingRank()
		getconfireRank()
	})

	await changeChartOption('lcbj', { dateTag: chartDateList.lcbjDate })
	await changeChartOption('lczs', { dateTag: chartDateList.lczsDate })

	const initLastStep = () => {
		changeChartOption('lcrd', { dateTag: chartDateList.lcrdDate, id: activeName.value })

		setTimeout(() => {
			splcChartRef.value.initChart(splcChartData.value)
			cjlcChartRef.value.initChart(cjlcChartData.value)
			initFirChart()
			initCommonChart()
		}, 500)
	}
	if (tabList.value.length) {
		initLastStep()
	} else {
		queryallworkflowbyadmin().then((res) => {
			tabList.value = res.data
			activeName.value = activeName.value || res.data[0].id
			initLastStep()
		})
	}
}

const initFirChart = () => {
	const chartUse = chartUseFunction(chartNameList, chartList, optionList)
	initCommonChart = chartUse.initCommonChart
	destroyChart = chartUse.destroyChart
	changeCommonChart = chartUse.changeCommonChart
}

const destoryEcharts = () => {
	destroyChart()
	initCommonChart = null
	destroyChart = null
	changeCommonChart = null
	splcChartRef.value.destoryChart()
	cjlcChartRef.value.destoryChart()
}

const changeTime = async () => {
	await destoryEcharts()
	await init()
}

onMounted(async () => {
	await init()
})
onUnmounted(() => {
	destroyChart()
})
</script>
<style lang="scss" scoped>
.stateTotalLine {
	height: 16px;
	width: 100%;
	background: linear-gradient(115deg, red, red 19.9%, white 19.9%, white 20.1%, blue 20.1%, blue);
	border-radius: 8px;
	position: relative;
	overflow: hidden;
	margin-top: 16px;
	margin-bottom: 19px;
}

:deep(.SxTitle p) {
	font-size: 20px;
	font-weight: bold;
}
.commonChartTitle {
	font-weight: bold;
	font-size: 16px;
	color: #303133;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.stateTotal {
	height: 236px;
	background: #ffffff;
	border-radius: 8px;
	padding: 32px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;

	.doubleNum {
		display: flex;
		justify-content: space-between;
		font-weight: 400;
		font-size: 14px;
		color: #606266;
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
	img {
		width: 56px;
		height: 56px;
	}
}

.blockOne {
	margin-top: 24px;
	.commonBlock {
		width: 100%;
		height: 511px;
		background: #ffffff;
		border-radius: 8px;
		padding: 24px 32px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.commonDiv {
			flex: 1;
		}
	}
}
.blockDouble {
	display: flex;
	flex-wrap: wrap;
	gap: 32px;
	.commonBlock {
		width: calc(50% - 16px);
		height: 390px;
		background: #ffffff;
		border-radius: 8px;
		padding: 24px 32px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.commonDiv {
			flex: 1;
		}
	}
}
.blockDoubleBottom {
	margin-top: 24px;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: 32px;
	.commonBlock {
		width: 100%;
		height: 390px;
		background: #ffffff;
		border-radius: 8px;
		padding: 24px 32px;
		box-sizing: border-box;
		display: flex;
		.commonDiv {
			flex: 1;
		}
	}
	.commonBlocks {
		flex: 1;
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
		justify-content: space-between;
		align-items: center;
		height: 61px;
		margin-bottom: 5px;
	}
	.commonNum {
		width: 40px;
		height: 40px;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: Helvetica Neue, Helvetica Neue;
		font-weight: 400;
		font-size: 14px;
		color: #ffffff;
		flex-shrink: 0;
		margin-right: 24px;
	}

	.firNum {
		background-image: url(../../assets/index/icopm1.png);
	}
	.secNum {
		background-image: url(../../assets/index/icopm2.png);
	}
	.thrNum {
		background-image: url(../../assets/index/icopm3.png);
	}
	.indexNum {
		background-image: url(../../assets/index/icopm4.png);
	}
	.mainTitleLine {
		flex: 1;
		display: flex;
		flex-direction: column;
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

	.colorLine {
		position: absolute;
		left: 0;
		top: 0;
		border-radius: 8px;
		height: 6px;
		background: linear-gradient(270deg, #ff832a 0%, #f58d7b 100%);
	}
}

:deep(.el-tabs__nav-wrap:after) {
	display: none;
}

.lineNumber {
	display: flex;
	justify-content: space-between;
	align-items: center;
	// margin-top: 11px;

	.rateNum {
		font-family: Helvetica Neue, Helvetica Neue;
		font-weight: bold;
		font-size: 18px;
		width: 70px;
		text-align: right;
		color: #606266;
	}
	.greyLine {
		flex: 1;
		height: 6px;
		background: #e6e8eb;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	}
}

.rightBlock {
	margin-left: 20px;
}
</style>

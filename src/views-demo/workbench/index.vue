<template>
	<div class="workbenchPage">
		<div
			class="topList"
			v-if="!!usePageSelf"
		>
			<div class="cardList">
				<div
					:class="{
						cardItem: true,
						active: cardCheck.id == item.id || workFlowId == item.id,
					}"
					v-for="(item, index) in usePageSelf.useList"
					:key="index"
					@click="changeCheckGetList(item)"
				>
					<img
						class="cardIco"
						:src="userTitle"
						alt=""
					/>
					<div class="titleAndNums">
						<el-tooltip
							class="box-item"
							effect="dark"
							:content="item.name"
							placement="top"
						>
							<p class="cardTitle">{{ item.name }}</p>
						</el-tooltip>

						<p class="cardNums"><span>待办业务</span>{{ item.duty }}</p>
					</div>
				</div>
			</div>
			<div class="pagerScroll">
				<div
					v-for="item in usePageSelf.totalPage"
					:key="item"
					@click="usePageSelf.getPageList(item, sxPagenetionCallback)"
					:class="{ pageDot: true, active: usePageSelf.page == item }"
				></div>
			</div>
		</div>

		<router-view
			@initCard="initCard"
			@addOpen="addModalOpen"
			:workFlowId="workFlowId"
		/>

		<add-modal
			ref="addModalRef"
			@getList="getList"
		/>
		<sx-add-modal
			ref="sxAddModalRef"
			@getList="getList"
		/>
		<cy-add-modal
			ref="cyAddModalRef"
			@getList="getList"
		/>
		<gbsb-add-modal
			ref="gbsbAddModalRef"
			@getList="getList"
		/>
	</div>
</template>
<script setup lang="ts">
import addModal from 'coms/add-modal/index.vue'
import sxAddModal from './component-4-this/sx/add-modal/index.vue'
import cyAddModal from './component-4-this/cy/add-modal/index.vue'
import gbsbAddModal from './component-4-this/gbsb/add-modal/index.vue'
import useStore from '@/store'
import { ref, reactive, onMounted, computed, nextTick, onUnmounted } from 'vue'
import { querydutyflowlist, queryrelationworkflowlist } from 'api/useCommon'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { hasWorkflowId, sxPagenationSelf, findKeyByValue } from '@/utils/common'
import emitter from '@/utils/emitter'
import { querydutysumbyworkflowid } from 'api/workbench'
import { DiyModalEnmus } from '@/enums/diyModal'
import { TypeForFlowEnmus } from '@/enums/WorkflowType'

const { workbench } = useStore()

const addModalRef = ref(null)
const sxAddModalRef = ref(null)
const cyAddModalRef = ref(null)
const gbsbAddModalRef = ref(null)
let usePageSelf = ref<any>(null)

const diyModalList = ref({
	addModalRef,
	sxAddModalRef,
	cyAddModalRef,
	gbsbAddModalRef,
})
const router = useRouter()
const route = useRoute()
const userTitle = new URL(`../../assets/index/gztPic.png`, import.meta.url).href

let tableHeight = ref(570)
let cardList = ref([])
let cardCheck = ref<{ id?: number; name?: string; duty?: number }>({})
let workFlowId = ref(null)

const getList = (getCard = false) => {
	nextTick(() => {
		emitter.emit('send-getList', getCard)
	})
}

onBeforeRouteUpdate((to, from) => {
	if (from.path.indexOf('/workbench/workbenchs/commonpage') > -1 && to.path.indexOf('/workbench/workbenchs/commonpage') > -1) {
		nextTick(() => {
			getList()
		})
	}
})

const changeCheckGetList = (item) => {
	if (item.id != cardCheck.value.id) {
		cardCheck.value = item
		workFlowId.value = item.id
		workbench.setWorkflowId(item.id)
		let hasType = hasWorkflowId(item.id)
		if (hasType.isHasType) {
			if (hasType.url == `/workbench/workbenchs/commonpage`) {
				router.push(`/workbench/workbenchs/commonpage/${item.id}`)
			} else {
				router.push(hasType.url)
			}
		} else {
			router.push(`/workbench/workbenchs/commonpage/${item.id}`)
		}
	} else {
		cardCheck.value = {}
		workFlowId.value = null
		workbench.setWorkflowId(null)
		router.push('/workbench/workbenchs/commonpage/useid')
	}
}

const addModalOpen = () => {
	let hasType = hasWorkflowId(workFlowId.value)
	if (hasType.isHasType) {
		const useModal = diyModalList.value[DiyModalEnmus['w' + workFlowId.value]]
		useModal.open(workFlowId.value)
	} else {
		addModalRef.value.open(workFlowId.value)
	}
}

const sxPagenetionCallback = () => {
	usePageSelf.value.useList.forEach((item, index) => {
		querydutysumbyworkflowid({
			workflow_id: item.id,
		}).then((resq) => {
			usePageSelf.value.useList[index] = {
				...item,
				...resq.data,
			}
		})
	})
}

const initCard = () => {
	queryrelationworkflowlist({}).then((res) => {
		console.log(res, 'list')
		if (!route.params?.id) {
			const useKey = Number(findKeyByValue(TypeForFlowEnmus, route.path).slice(1))

			cardList.value = res.data
			cardCheck.value = cardList.value.filter((item) => {
				return item.id == workFlowId.value
			})?.[0]

			usePageSelf.value = sxPagenationSelf(res.data, 5, useKey)
		} else {
			usePageSelf.value = sxPagenationSelf(res.data, 5, Number(route.params?.id))

			if (!cardCheck.value) {
				cardCheck.value = {
					id: 0,
					name: '全部流程',
					duty: 0,
				}
			}
		}

		sxPagenetionCallback()
		nextTick(() => {
			getList()
		})
	})
}

onMounted(() => {
	workFlowId.value = workbench.workflowId
	console.log(workbench.workflowId, 'workbench.workflowId', JSON.stringify(workbench.workflowId))

	initCard()
	const mainHeight = document?.querySelector('.ThingsListMain')?.clientHeight || 0
	const navHeight = document?.querySelector('.UseNavPage')?.clientHeight || 0
	const btnsHeight = document?.querySelector('.btns')?.clientHeight || 0
	const searchHieght = document?.querySelector('.searchBox')?.clientHeight || 0
	let useHeight = mainHeight - navHeight - btnsHeight - searchHieght - 64
	tableHeight.value = useHeight
})
onUnmounted(() => {})
</script>
<style lang="scss" scoped>
.workbenchPage {
	width: 100%;
	min-height: 100%;
	height: auto;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.cardList {
	display: flex;
	align-items: center;
	gap: 12px;
	width: 100%;

	.cardItem {
		cursor: pointer;
		display: flex;
		width: 20%;
		height: 84px;
		flex-shrink: 0;
		background: #ffffff;
		border-radius: 8px 8px 8px 8px;
		padding: 11px 20px;
		box-sizing: border-box;
		font-family: Microsoft YaHei UI, Microsoft YaHei UI;
		.titleAndNums {
			flex: 1;
			overflow: hidden;
			p {
				margin: 0;
			}
		}
		img {
			width: 48px;
			height: 60px;
			flex-shrink: 0;
			border-radius: 50%;
			margin-right: 10px;
		}
	}
	.cardTitle {
		font-weight: 700;
		font-size: 16px;
		color: #303133;
		line-height: 28px;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-bottom: 4px;
	}
	.cardNums {
		font-weight: 400;
		font-size: 14px;
		color: #eb423f;
		span {
			color: #909399;
			margin-right: 10px;
		}
	}
	.cardItem.active {
		background: linear-gradient(180deg, #e53c3c 0%, #f86a6a 100%);
		box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.08), 0px 12px 32px 4px rgba(0, 0, 0, 0.04);
		.cardTitle {
			color: #ffffff;
		}
		.cardNums {
			color: #ffffff;
			span {
				color: #ffffff;
			}
		}
	}
}

.workbenchTable {
	flex: 1;
	padding: 24px;
	box-sizing: border-box;
	border-radius: 8px;
	background: #ffffff;
	min-height: 526px;
}

.comBtnIco {
	width: 16px;
	height: 16px;
	margin-right: 5px;
	background-size: 16px 16px;
}

.demo-form-inline .el-input {
	--el-input-width: 220px;
}

.demo-form-inline .el-select {
	--el-select-width: 220px;
}

:deep(.common-tabs .el-tabs__nav-wrap:after) {
	background-color: transparent;
}

.pagerScroll {
	width: auto;
	display: flex;
	gap: 8px;
	margin-top: 10px;
	flex-shrink: 0;
	.active {
		width: 36px;
		background: rgba(243, 97, 97, 1);
	}
}
.pageDot {
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background: rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.15);
	cursor: pointer;
}

.topList {
	margin-bottom: 14px;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 106px;
}
</style>

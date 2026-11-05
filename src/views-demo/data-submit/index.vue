<template>
	<div class="workbenchPage">
		<div
			class="topList"
			v-if="usePageSelf"
		>
			<div class="cardList">
				<div
					@click="changeActiveCard(item)"
					:class="{ cardItem: true, active: activeCard?.id == item.id }"
					v-for="(item, index) in usePageSelf.useList"
					:key="index + 'sbcard'"
				>
					<div class="imgBorderRadius">
						<img
							class="cardIco"
							:src="userTitle"
							alt=""
						/>
					</div>
					<!-- <div class="titleAndNums"> -->
					<p class="cardTitle">
						<el-tooltip
							class="box-item"
							effect="dark"
							:content="item.name"
							placement="top-start"
						>
							{{ item.name }}
						</el-tooltip>
					</p>
					<!-- </div> -->
				</div>
			</div>
			<div class="pagerScroll">
				<div
					v-for="item in usePageSelf.totalPage"
					:key="item"
					@click="usePageSelf.getPageList(item)"
					:class="{ pageDot: true, active: usePageSelf.page == item }"
				></div>
			</div>
		</div>
		<router-view
			v-if="isRun"
			@addMain="addMain"
			:workFlowId="activeCard.id"
			ref="useRouterView"
		></router-view>

		<add-modal
			ref="addModalRef"
			@getList="getList"
		/>
		<add-cj-modal
			ref="addCjModalRef"
			@getList="getList"
		/>
		<add-rbadw-modal
			ref="addRbacdwModalRef"
			@getList="getList"
		/>
		<add-bzf-modal
			ref="addBzfModalRef"
			@getList="getList"
		/>
		<add-yjy-modal
			ref="addYjyModalRef"
			@getList="getList"
		/>
	</div>
</template>
<script setup lang="ts">
import addModal from 'coms/add-modal/index.vue'
import addCjModal from './component-4-this/cj/addModal.vue'
import addRbadwModal from './component-4-this/rbacDw/addModal.vue'
import addBzfModal from './component-4-this/bzf/addModal.vue'
import addYjyModal from './component-4-this/yjy/addModal.vue'
import { sxPagenationSelf } from '@/utils/common'
import { ref, nextTick, watch, onMounted } from 'vue'
import { querymyfillingworkflowlist } from 'api/useCommon'
import { useRouter, useRoute } from 'vue-router'
import { hasWorkflowId, findKeyByValue } from '@/utils/common'
import emitter from '@/utils/emitter'
import { DiySubmitModalEnmus } from '@/enums/diyModal'
import { TypeForFlowDatasubmitEnmus } from '@/enums/WorkflowType'

const userTitle = new URL(`../../assets/index/jstbPic.png`, import.meta.url).href

const addModalRef = ref(null)
const addCjModalRef = ref(null)
const addRbacdwModalRef = ref(null)
const addBzfModalRef = ref(null)
const addYjyModalRef = ref(null)

const useRouterView = ref(null)

const diyModalList = ref({
	addModalRef,
	addCjModalRef,
	addRbacdwModalRef,
	addBzfModalRef,
	addYjyModalRef,
})

const router = useRouter()
const route = useRoute()
let activeCard = ref<any>({})
let usePageSelf = ref<any>(null)
let isRun = ref(false)
const thisPath = '/datasubmit/datasubmits/commonPage/'

const getList = (getCard = false, changeMore = false) => {
	nextTick(() => {
		emitter.emit('send-getList', { getCard, changeMore })
	})
}

watch(
	route,
	(value) => {
		if (value.path.indexOf(thisPath) > -1) {
			getList(false, true)
		}
	},
	{
		// 初始化立即执行
		immediate: true,
		deep: true,
	}
)

const addMain = () => {
	let hasType = hasWorkflowId(activeCard.value.id, 3)

	if (hasType.isHasType || route.params.id == '337') {
		console.log(123123123, activeCard.value.id, DiySubmitModalEnmus)

		const useModal = diyModalList.value[DiySubmitModalEnmus['w' + activeCard.value.id]]
		useModal.open(activeCard.value.id)
	} else {
		addModalRef.value.open(activeCard.value.id, true)
	}
}

const changeActiveCard = (item) => {
	activeCard.value = item
	selectUrl(item)
}

const selectUrl = (item) => {
	let hasType = hasWorkflowId(item.id, 3)
	if (hasType.isHasType) {
		router.push(hasType.url)
	} else {
		router.push(`${thisPath}${item.id}`)
	}
	isRun.value = true
}
const initCard = (first = false) => {
	querymyfillingworkflowlist().then((res) => {
		if (!route.params?.id) {
			const useKey = Number(findKeyByValue(TypeForFlowDatasubmitEnmus, route.path).slice(1))
			activeCard.value = res.data.filter((item) => item.id == useKey)[0]
			selectUrl(activeCard.value)
			usePageSelf.value = sxPagenationSelf(res.data, 5, useKey)
		} else {
			usePageSelf.value = sxPagenationSelf(res.data, 5, Number(route.params?.id))

			if (route.params?.id == 'useid') {
				activeCard.value = usePageSelf.value.useList[0]
				selectUrl(activeCard.value)
			} else {
				activeCard.value = usePageSelf.value.useList.filter((item) => item.id == route.params?.id)[0]
				setTimeout(() => {
					isRun.value = true
					if (first) {
						getList(false, true)
					}
				}, 1000)
			}
		}
	})

	// console.log(useRouterView, 'useRouterView')
}
onMounted(() => {
	initCard(true)
})
</script>
<style lang="scss" scoped>
.workbenchPage {
	width: 100%;
	min-height: 100%;
	height: auto;
	overflow: auto;
	display: flex;
	flex-direction: column;
}
.topList {
	margin-bottom: 32px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-image: url(../../assets/index/tab_bg.png);
	background-size: cover;
	height: 110px;
	padding: 16px 24px 18px;
	box-sizing: border-box;
}
.cardList {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	flex: 1;
	width: 100%;
	overflow: hidden;
	.cardItem {
		display: flex;
		cursor: pointer;
		width: calc((100% - 48px) / 5);
		height: 56px;
		background: #ffffff;
		border-radius: 8px 8px 8px 8px;
		padding: 12px 18px;
		align-items: center;
		box-sizing: border-box;
		overflow: hidden;
		font-family: Microsoft YaHei UI, Microsoft YaHei UI;

		.imgBorderRadius {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			margin-right: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f36161;
		}
		img {
			width: 20px;
			height: 20px;
		}
	}
	.cardTitle {
		font-weight: 400;
		font-size: 16px;
		color: #303133;
		margin: 0;
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.cardItem.active {
		background: linear-gradient(180deg, #e53c3c 0%, #f86a6a 100%);
		box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.08), 0px 12px 32px 4px rgba(0, 0, 0, 0.04);
		.cardTitle {
			color: #ffffff;
			font-weight: 700;
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
</style>

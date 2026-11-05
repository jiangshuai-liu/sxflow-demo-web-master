<template>
	<div class="workbenchPage">
		<div class="workbenchSearch">
			<div class="stateList">
				<div class="stateTitle">所属业务</div>
				<div :class="{ stateTab: true, stateTabOpen: isOpen }">
					<div class="stateTabUse">
						<div
							:class="{ stateItem: true, activeItem: checkItem.id == item.id }"
							v-for="(item, index) in cardList"
							:key="index"
							@click="changeCheckGetList(item)"
						>
							{{ item.name }}
						</div>
					</div>
				</div>
				<div class="submitBtns stateBtn">
					<p
						@click="isOpen = !isOpen"
						v-if="showButton"
					>
						{{ isOpen ? '收起' : '展开' }}<el-icon :class="isOpen ? 'isOpenArrow' : 'isCloseArrow'"><ArrowDown /></el-icon>
					</p>
				</div>
			</div>
		</div>
		<router-view :workFlowId="workFlowId" />
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { querymyfillingworkflowlist } from 'api/useCommon'
import useStore from '@/store'
import emitter from '@/utils/emitter'
import { useRouter, useRoute } from 'vue-router'
import { hasWorkflowId, findKeyByValue } from '@/utils/common'
import { TypeForFlowSubmitSearchEnmus } from '@/enums/WorkflowType'

const { relatedme } = useStore()
let showButton = ref(false)
const router = useRouter()
const route = useRoute()
const isOpen = ref(false)
let workFlowId = ref(null)
let cardList = ref([])
let checkItem = ref<{ id?: number; name?: string }>({})

const thisPath = '/datasearch/submitsearch/commonPage/'

watch(
	route,
	(value) => {
		if (value.path.indexOf(thisPath) > -1) {
			nextTick(() => {
				emitter.emit('send-getList')
			})
		}
	},
	{
		// 初始化立即执行
		immediate: true,
		deep: true,
	}
)

const changeCheckGetList = (item) => {
	console.log(item)

	if (item.id != checkItem.value.id) {
		checkItem.value = item
		workFlowId.value = item.id
		relatedme.setWorkflowId(item.id)
		relatedme.setWorkflowObj(item)
		let hasType = hasWorkflowId(item.id, 4)
		if (hasType.isHasType) {
			router.push(hasType.url)
		} else {
			let usePath = thisPath

			router.push(`${usePath}${item.id}`)
		}
	}
}

const initCard = (fun = null, first = false) => {
	querymyfillingworkflowlist().then((res) => {
		cardList.value = res.data
		if (!route.params?.id) {
			const useKey = findKeyByValue(TypeForFlowSubmitSearchEnmus, route.path).slice(1)
			checkItem.value = res.data.filter((item) => item.id == useKey)[0]
		} else if (route.params?.id == 'useid') {
			changeCheckGetList(res.data[0])
		} else {
			checkItem.value = res.data.filter((item) => item.id == route.params?.id)[0]
			if (first) {
				emitter.emit('send-getList')
			}
		}
		workFlowId.value = checkItem.value.id

		// console.log(checkItem, 'checkItem')
		if (fun) {
			fun()
		}
	})
}

const $ = (className) => {
	return document.querySelector('.' + className)
}

const checkOpen = () => {
	nextTick(() => {
		const stateTabUse = $('stateTabUse').clientHeight
		if (stateTabUse > 28) {
			showButton.value = true
		}
	})
}
const init = async () => {
	await initCard(checkOpen, true)
}
onMounted(() => {
	init()
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

.workbenchSearch {
	background: #ffffff;
	border-radius: 8px 8px 0px 0px;
	// padding: 12px 12px 3px 24px;
	padding: 12px 12px 0px 24px;
	box-sizing: border-box;
	min-height: 40px;
	margin-bottom: 0;
}

.stateList {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.stateTab {
	flex: 1;
	height: 36px;
	padding: 4px 0;
	box-sizing: border-box;
	overflow: hidden;
}

.stateTitle {
	height: 36px;
	line-height: 36px;
	margin-right: 12px;
	width: 58px;
}

.stateTabOpen {
	height: auto;
}
.stateTabUse {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}
.stateBtn {
	justify-content: flex-end;
	align-items: flex-start;
	margin: 0;
	p {
		cursor: pointer;
		color: #eb423f;
		height: 36px;
		line-height: 36px;
	}

	.el-icon {
		margin-left: 5px;
	}
}

:deep(.common-tabs .el-tabs__nav-wrap:after) {
	background-color: transparent;
}

.stateItem {
	cursor: pointer;
	height: 28px;
	display: flex;
	align-items: center;
	padding: 3px 12px;
	box-sizing: border-box;
	font-size: 14px;
}

.isOpenArrow {
	transform: rotate(180deg);
	transition: transform 0.5s;
}
.isCloseArrow {
	transition: transform 0.5s;
}

.activeItem {
	background: #f36161;
	border-radius: 4px 4px 4px 4px;
	color: #ffffff;
}
</style>

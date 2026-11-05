<template>
	<div class="workbenchPage">
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
	</div>
</template>
<script setup lang="ts">
import addModal from 'coms/add-modal/index.vue'
import addCjModal from './component-4-this/cj/addModal.vue'
import addRbadwModal from './component-4-this/rbacDw/addModal.vue'
import addBzfModal from './component-4-this/bzf/addModal.vue'
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { hasWorkflowId, findKeyByValue } from '@/utils/common'
import emitter from '@/utils/emitter'
import { DiySubmitModalEnmus } from '@/enums/diyModal'

const addModalRef = ref(null)
const addCjModalRef = ref(null)
const addRbacdwModalRef = ref(null)
const addBzfModalRef = ref(null)

const useRouterView = ref(null)

const diyModalList = ref({
	addModalRef,
	addCjModalRef,
	addRbacdwModalRef,
	addBzfModalRef,
})

const route = useRoute()
let activeCard = ref<any>({})
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

	if (hasType.isHasType) {
		const useModal = diyModalList.value[DiySubmitModalEnmus['w' + activeCard.value.id]]
		useModal.open(activeCard.value.id)
	} else {
		addModalRef.value.open(activeCard.value.id, true)
	}
}

const initCard = () => {
	activeCard.value = { id: route.params?.id }
	isRun.value = true
	getList(false, true)
}
onMounted(() => {
	initCard()
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
</style>

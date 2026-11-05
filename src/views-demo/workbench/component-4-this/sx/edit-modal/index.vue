<template>
	<el-drawer
		v-model="isShow"
		direction="rtl"
		:before-close="handleClose"
		size="60%"
		modal-class="editModal"
	>
		<template #header>
			<div class="sxDrawerTitle">事项详情</div>
		</template>

		<el-tabs
			v-model="activeName"
			class="demo-tabs"
			@tab-click="handleClick"
		>
			<el-tab-pane
				label="业务数据"
				name="form"
			>
				<template v-if="activeName == 'form' && formItemList.length">
					<el-form
						:model="mainFormData"
						label-width="150px"
						:rules="rules"
						ref="ruleFormRef"
						label-position="top"
					>
						<UseLowCode
							:form="form"
							v-model:mainFormData="mainFormData"
							:formItemList="formItemList"
							:injectionForm="injectionForm"
						>
							<template #hylx>
								<input
									type="text"
									style="width: 100%; border: 1px solid #cccccc; padding-left: 6px; border-radius: 6px"
									:value="checkList.join('/ ')"
								/>
								<el-checkbox-group v-model="checkList">
									<el-checkbox
										v-for="item in hylxList"
										:key="item.id"
										:value="item.name"
										>{{ item.name }}</el-checkbox
									>
								</el-checkbox-group>
							</template>
						</UseLowCode>
					</el-form>
				</template>
			</el-tab-pane>
			<el-tab-pane
				label="操作记录"
				name="state"
			>
				<SxLog
					v-if="activeName == 'state'"
					:id="id"
				/>
			</el-tab-pane>
			<el-tab-pane
				label="流程进度"
				name="edit"
			>
				<SxSteps
					v-if="activeName == 'edit'"
					:id="id"
				/>
			</el-tab-pane>
			<el-tab-pane
				label="流程图示"
				name="graph"
			>
				<SxAntv
					v-if="activeName == 'graph'"
					:workflow_id="workflow_id"
				/>
			</el-tab-pane>
		</el-tabs>

		<template
			#footer
			v-if="activeName == 'form'"
		>
			<div
				class="saveBtn"
				v-if="formItemList.length"
			>
				<common-footer>
					<template #close>
						<el-button
							type="primary"
							color="#EBEDF0"
							@click="closeDrawer"
							>关闭</el-button
						>
					</template>
					<template #submit>
						<template v-if="!isState">
							<!-- <el-button
								v-if="transition.length > 0"
								type="primary"
								color="#EB423F"
								@click="onSubmitValidate(ruleFormRef, onSave, {})"
								>临时保存</el-button
							> -->
							<el-button
								v-for="item in transition"
								:key="item.transition_id"
								type="primary"
								color="#EB423F"
								@click="onSubmitValidate(ruleFormRef, onSubmit, item)"
								>{{ item.transition_name }}</el-button
							>
						</template>
					</template>
				</common-footer>
				{{ transition }}
			</div>
		</template>
	</el-drawer>
</template>
<script setup lang="ts">
import { ref, provide } from 'vue'
import { commonHook, commonFormFun } from '@bksx/sxflow'
import { submitCom } from '@/utils/common'
import { handleflow } from 'api/useCommon'
import type { TabsPaneContext } from 'element-plus'
import SxSteps from './SxSteps.vue'
import SxAntv from 'coms/edit-modal/SxAntv.vue'
import SxLog from './commonTimeLine.vue'
import { queryordermeetinglist, querymatter, handlematter } from 'api/diy-api/index'

const activeName = ref('form')
const emits = defineEmits(['getList'])
const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}

let hylxList = ref([])
let checkList = ref([])
let {
	isShow,
	form,
	id,
	centerObj,
	mainFormData,
	formItemList,
	workflow_id,
	transition,
	column_size,
	rules,
	ruleFormRef,
	isState,
	ids,
	isReturn,
	injectionForm,
	ticketId,
} = commonHook()
let commonSubmit
let onSubmitValidate
provide('workflow_id', workflow_id)
provide('isState', isState)
provide('transition', transition)
const handleClose = (done: () => void) => {
	closeDrawer()
	done()
}

let useUrl = ref(handlematter)
const closeFun = () => {
	closeDrawer()
}
const open = ({
	workflowIdUse,
	idUse,
	ticketId = null,
	staging = null,
}: {
	workflowIdUse: number
	idUse: number
	ticketId?: number
	staging?: number
}): void => {
	console.log('open', workflowIdUse, idUse)
	isShow.value = true

	getJchylList()

	const returnObj = submitCom(mainFormData, closeFun, useUrl.value, true)
	onSubmitValidate = returnObj.onSubmitValidate
	commonSubmit = returnObj.commonSubmit
	querymatter({ id: idUse, ticketId, staging }).then((res) => {
		console.log(res, 'initflow')
		workflow_id.value = res.data.workflow_id
		id.value = res.data.id

		ids.value = res.data.ids || []
		//1
		injectionForm.value = {
			ids: ids.value,
		}
		//2?
		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size, injectionForm)
		transition.value = res.data.transition
		rules.value = commonForm.rulesq
		mainFormData.value = commonForm.mainFormDatas
		formItemList.value = commonForm.formItemLists
		isState.value = commonForm.isState
		console.log(mainFormData.value, formItemList.value, form.value)
		console.log(ruleFormRef.value, 'ruleFormRef')

		if (mainFormData.value.hylx?.length) {
			checkList.value = []
			const result = []
			mainFormData.value.hylx.map((item) => {
				const existIndex = hylxList.value.findIndex((i) => item == i.id)
				if (existIndex != -1) {
					checkList.value.push(hylxList.value[existIndex].name)
				}
			})
		} else {
			checkList.value = []
		}
	})
}

const getJchylList = () => {
	queryordermeetinglist().then((res) => {
		hylxList.value = res.data.value
	})
}

const closeDrawer = () => {
	transition.value = []
	rules.value = {}
	mainFormData.value = {}
	formItemList.value = []
	ids.value = []
	id.value = ''
	isState.value = false
	isShow.value = false
	activeName.value = 'form'
	emits('getList', true)
}

const onSave = (item) => {
	const result = []
	checkList.value.map((item) => {
		const existIndex = hylxList.value.findIndex((i) => item == i.name)
		if (existIndex != -1) {
			result.push(hylxList.value[existIndex].id)
		}
	})
	mainFormData.value.hylx = result
	let form = {
		workflow_id: workflow_id.value,
		transition_id: 0,
		...mainFormData.value,
		id: id.value,
		ids: ids.value.length > 0 ? ids.value : null,
		staging: true,
	}
	console.log(centerObj.value, 'centerObj.value')
	console.log(mainFormData.value, 'mainFormData.value')

	commonSubmit(form, true)
}

const onSubmit = (item) => {
	const result = []
	checkList.value.map((item) => {
		const existIndex = hylxList.value.findIndex((i) => item == i.name)
		if (existIndex != -1) {
			result.push(hylxList.value[existIndex].id)
		}
	})
	mainFormData.value.hylx = result
	let form = {
		workflow_id: workflow_id.value,
		transition_id: Number(item.transition_id),
		...mainFormData.value,
		id: id.value,
		ids: ids.value.length > 0 ? ids.value : null,
	}
	console.log(centerObj.value, 'centerObj.value')
	console.log(mainFormData.value, 'mainFormData.value')

	commonSubmit(form)
}

defineExpose({
	open,
})
</script>
<style lang="scss" scoped>
.demo-tabs {
	height: 100%;

	border-top: 2px solid #e4e7ed;
	overflow: auto;
	:deep(.el-tabs__content) {
		overflow: auto;
	}
}
.el-tab-pane {
	min-height: 100%;
}
</style>

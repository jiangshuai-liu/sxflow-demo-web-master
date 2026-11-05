<template>
	<el-drawer
		v-model="isShow"
		direction="rtl"
		:before-close="handleClose"
		size="60%"
		modal-class="editModal"
	>
		<template #header>
			<div class="sxDrawerTitle">编辑事项</div>
		</template>

		<el-form
			:model="mainFormData"
			label-width="150px"
			:rules="rules"
			ref="ruleFormRef"
		>
			<UseLowCode
				:form="form"
				v-model:mainFormData="mainFormData"
				:formItemList="formItemList"
			/>
		</el-form>

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
			</div>
		</template>
	</el-drawer>
</template>
<script setup lang="ts">
import { ref, provide } from 'vue'
import { ElMessageBox } from 'element-plus'
import { commonHook, commonFormFun } from '@bksx/sxflow'
import { submitCom, getCookieInternalData } from '@/utils/common'
import { initflow, saveflow, handleflow, queryfillingdatabyid } from 'api/useCommon'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('form')

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}

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
	return
	ElMessageBox.confirm('Are you sure you want to close this?')
		.then(() => {
			done()
		})
		.catch(() => {})
}
const emits = defineEmits(['getList'])
let useUrl = ref(saveflow)
const closeFun = () => {
	closeDrawer()
	emits('getList')
}
const open = ({ workflowId, useId }: { workflowId: number; useId: number }): void => {
	console.log('open', workflowId, useId)
	isShow.value = true
	const returnObj = submitCom(mainFormData, closeFun, useUrl.value, true)
	onSubmitValidate = returnObj.onSubmitValidate
	commonSubmit = returnObj.commonSubmit
	initflow({ name: '_w' + workflowId, ids: [useId] }).then((res) => {
		console.log(res, 'queryfillingdatabyid')
		workflow_id.value = res.data.workflow_id
		id.value = useId
		ids.value = [useId]
		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		transition.value = res.data.transition
		rules.value = commonForm.rulesq
		mainFormData.value = commonForm.mainFormDatas
		formItemList.value = commonForm.formItemLists
		isState.value = commonForm.isState

		console.log(mainFormData.value, formItemList.value, form.value)

		console.log(ruleFormRef.value, 'ruleFormRef')
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
}

const onSubmit = (item) => {
	let form = {
		// ...centerObj.value,
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
}
.el-tab-pane {
	min-height: 100%;
}
</style>

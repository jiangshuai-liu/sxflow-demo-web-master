<template>
	<el-drawer
		v-model="isShow"
		direction="rtl"
		:before-close="handleClose"
		size="60%"
		modal-class="editModal"
	>
		<template #header>
			<div class="sxDrawerTitle">{{ props.title }}</div>
		</template>
		<el-form
			:model="mainFormData"
			label-width="150px"
			:rules="rules"
			ref="ruleFormRef"
			v-if="formItemList.length"
			class="scrollClass"
			:scroll-to-error="true"
		>
			<!-- label-position="top" -->

			<UseLowCode
				:form="form"
				v-model:mainFormData="mainFormData"
				:formItemList="formItemList"
			>
				<!-- <template #r_nid>
					<div class="commonId">
						<el-input
							v-model="mainFormData.r_nid"
							:disabled="!isDiy"
							style="width: 100%"
						/>
						<el-button
							type="primary"
							v-if="!isDiy"
							@click="changeDiy"
						>
							自定义编号
						</el-button>
						<el-button
							type="primary"
							v-else
						>
							检测
						</el-button>
					</div>
				</template> -->
			</UseLowCode>
		</el-form>

		<template #footer>
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
								type="primary"
								color="#EB423F"
								@click="onlySave()"
								v-if="showSave"
								>临时保存</el-button
							> -->
							<el-button
								v-for="item in transition"
								:key="item.transition_id"
								type="primary"
								color="#EB423F"
								@click="onSubmitValidate(ruleFormRef, onSubmit, item)"
							>
								{{ item.transition_name }}
							</el-button>
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

import { inituser, saveuser } from 'api/rbac'

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
// console.log(isShow, 'isShow')

interface propsType {
	title: string
}

let isDiy = ref(false)

const changeDiy = () => {
	isDiy.value = !isDiy.value
}

const emits = defineEmits(['getList'])
const props = withDefaults(defineProps<Partial<propsType>>(), {
	title: '填报事项',
})

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

let showSave = ref(false)
let useUrl = ref(saveuser)
const closeFun = () => {
	closeDrawer()
	emits('getList')
}

let openUseCallback
const open = (workflowId: number, intoMainFormData = {}, showsave: boolean = false, openCallback = null): void => {
	isShow.value = true
	showSave.value = showsave

	openUseCallback = openCallback
	const returnObj = submitCom(mainFormData, closeFun, useUrl.value, true)
	onSubmitValidate = returnObj.onSubmitValidate
	commonSubmit = returnObj.commonSubmit
	inituser({ name: 'w' + workflowId }).then((res) => {
		workflow_id.value = res.data.workflow_id

		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		transition.value = res.data.transition
		rules.value = commonForm.rulesq
		mainFormData.value = { ...commonForm.mainFormDatas, ...intoMainFormData }

		formItemList.value = commonForm.formItemLists
		isState.value = commonForm.isState

		console.log(mainFormData.value, formItemList.value, form.value)
		// console.log(ruleFormRef.value, 'ruleFormRef')
	})
}
const closeDrawer = () => {
	transition.value = []
	rules.value = {}
	mainFormData.value = {}
	formItemList.value = []
	ids.value = []
	// form.value = {}
	isState.value = false
	showSave.value = false
	isShow.value = false
	isDiy.value = false
}

const onSubmit = (item) => {
	console.log(item, '点击保存')

	let form = {
		workflow_id: workflow_id.value,
		transition_id: Number(item.transition_id),
		...mainFormData.value,
	}
	// console.log(form, 'form')
	// return
	commonSubmit(form, false, openUseCallback)
}

const onlySave = () => {
	let form = {
		workflow_id: workflow_id.value,
		transition_id: 0,
		...mainFormData.value,
		staging: true,
	}
	commonSubmit(form, false, openUseCallback)
}

defineExpose({
	open,
})
</script>
<style lang="scss" scoped>
.commonId {
	display: flex;
	width: 100%;

	.el-button {
		margin-left: 10px;
	}
}
</style>

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
			<UseLowCode
				:form="form"
				v-model:mainFormData="mainFormData"
				:formItemList="formItemList"
			/>
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
const open = (workflowId: number, intoMainFormData: any = {}, showsave: boolean = false, openCallback = null): void => {
	isShow.value = true
	showSave.value = showsave

	openUseCallback = openCallback
	const returnObj = submitCom(mainFormData, closeFun, useUrl.value, true)
	onSubmitValidate = returnObj.onSubmitValidate
	commonSubmit = returnObj.commonSubmit
	let centerIntoMainFormData = Object.assign({}, intoMainFormData)
	// Object.hasOwn(centerIntoMainFormData, 'dd_superdid') && delete centerIntoMainFormData.dd_superdid
	console.log(centerIntoMainFormData, 'centerIntoMainFormData')
	ids.value = Object.values(centerIntoMainFormData)
	inituser({ name: 'w' + workflowId, ids: ids.value, fileds: intoMainFormData }).then((res) => {
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
}

const onSubmit = (item) => {
	let form = {
		workflow_id: workflow_id.value,
		transition_id: Number(item.transition_id),
		...mainFormData.value,
		ids: ids.value,
	}

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
<style lang="scss" scoped></style>

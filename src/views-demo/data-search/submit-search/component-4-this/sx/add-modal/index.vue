<template>
	<el-drawer
		v-model="isShow"
		direction="rtl"
		:before-close="handleClose"
		size="60%"
		modal-class="editModal"
	>
		<template #header>
			<div class="sxDrawerTitle">申请</div>
		</template>
		<el-form
			:model="mainFormData"
			label-width="150px"
			:rules="rules"
			ref="ruleFormRef"
			v-if="formItemList.length"
		>
			<UseLowCode
				:form="form"
				v-model:mainFormData="mainFormData"
				:formItemList="formItemList"
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
import { commonHook, commonFormFun } from '@bksx/sxflow'
import { ElMessageBox } from 'element-plus'
import { submitCom, getCookieInternalData, resetForm } from '@/utils/common'
import { initflow, saveflow, handleflow, deletefillingdatabyid } from 'api/useCommon'
import { queryordermeetinglist } from 'api/diy-api/index'

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
// console.log(isShow, 'isShow')

let commonSubmit
let onSubmitValidate

const emits = defineEmits(['getList'])

provide('workflow_id', workflow_id)
provide('isState', isState)
provide('transition', transition)
const handleClose = (done: () => void) => {
	done()
	// ElMessageBox.confirm('Are you sure you want to close this?')
	// 	.then(() => {
	// 		done()
	// 	})
	// 	.catch(() => {})
}

let useUrl = ref(saveflow)
const closeFun = () => {
	closeDrawer()
	emits('getList')
}
const open = (workflowId: number): void => {
	console.log('open')
	isShow.value = true
	getJchylList()

	const returnObj = submitCom(mainFormData, closeFun, useUrl.value, true)
	onSubmitValidate = returnObj.onSubmitValidate
	commonSubmit = returnObj.commonSubmit
	initflow({ name: '_w' + workflowId }).then((res) => {
		console.log(res, 'initflow')
		workflow_id.value = res.data.workflow_id

		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		transition.value = res.data.transition
		rules.value = commonForm.rulesq
		mainFormData.value = commonForm.mainFormDatas
		formItemList.value = commonForm.formItemLists
		isState.value = commonForm.isState
		console.log(mainFormData.value, formItemList.value, form.value)

		setTimeout(() => {
			resetForm(ruleFormRef.value)
		}, 500)

		if (mainFormData.value.hylx.length) {
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
	isState.value = false
	isShow.value = false
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
		// ...centerObj.value,
		workflow_id: workflow_id.value,
		transition_id: Number(item.transition_id),
		...mainFormData.value,
		// ids: ids.value.length > 0 ? ids.value : null,
	}
	console.log(centerObj.value, 'centerObj.value')
	console.log(mainFormData.value, 'mainFormData.value')

	commonSubmit(form)
}

defineExpose({
	open,
})
</script>
<style lang="scss" scoped></style>

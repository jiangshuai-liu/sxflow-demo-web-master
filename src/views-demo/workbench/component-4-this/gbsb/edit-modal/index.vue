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
					>
						<UseLowCode
							:form="form"
							v-model:mainFormData="mainFormData"
							:formItemList="formItemList"
						>
							<template #gbhmcry>
								<el-table
									class="sxTable"
									:data="mainFormData.gbhmcry"
									style="width: 100%"
									header-cell-class-name="sxTableHeader"
									header-row-class-name="sxTableHeader"
								>
									<template #empty>
										<common-empty />
									</template>

									<el-table-column
										class-name="sxTableColumn"
										prop="dwxxb_name"
										label="单位名称"
										align="center"
									>
									</el-table-column>
									<el-table-column
										class-name="sxTableColumn"
										prop="xm"
										label="姓名"
										align="center"
									/>
									<template v-if="!hasStateId('fs')">
										<el-table-column
											class-name="sxTableColumn"
											prop="btqxq"
											label="补贴期限起"
											align="center"
										>
											<template #default="scope">
												<el-date-picker
													style="width: 100%"
													v-model="scope.row.btqxq"
													value-format="YYYY-MM-DD HH:mm:ss"
													type="date"
												/>
											</template>
										</el-table-column>

										<el-table-column
											class-name="sxTableColumn"
											prop="btqxz"
											label="补贴期限止"
											align="center"
										>
											<template #default="scope">
												<el-date-picker
													style="width: 100%"
													v-model="scope.row.btqxz"
													value-format="YYYY-MM-DD HH:mm:ss"
													type="date"
												/>
											</template>
										</el-table-column>
									</template>
									<template v-if="!hasStateId('all')">
										<el-table-column
											class-name="sxTableColumn"
											prop="sqcs"
											label="申请次数"
											align="center"
										>
											<template #default="scope">
												<el-input
													v-model="scope.row.sqcs"
													style="width: 100%"
													clearable
												/>
											</template>
										</el-table-column>
										<el-table-column
											class-name="sxTableColumn"
											prop="sqbtje"
											label="申请补贴金额"
											align="center"
										>
											<template #default="scope">
												<el-input
													v-model="scope.row.sqbtje"
													style="width: 100%"
													clearable
												/>
											</template>
										</el-table-column>
									</template>

									<template v-if="hasStateId('cs')">
										<el-table-column
											class-name="sxTableColumn"
											prop="csjg"
											label="初审结果"
											align="center"
										>
											<template #default="scope">
												<el-select
													v-model="scope.row.csjg"
													style="width: 100%"
													clearable
													@change="changeShjg(scope, 'cs')"
												>
													<el-option
														v-for="item in jgoptions"
														:key="item.value"
														:label="item.label"
														:value="item.value"
													/>
												</el-select>
											</template>
											<!-- csjg_name -->
										</el-table-column>
										<el-table-column
											class-name="sxTableColumn"
											prop="csbtgyy"
											label="初审不通过原因"
											align="center"
										>
											<template #default="scope">
												<el-input
													v-model="scope.row.csbtgyy"
													style="width: 100%"
													clearable
												/>
											</template>
										</el-table-column>
									</template>
									<template v-if="hasStateId('fs')">
										<el-table-column
											class-name="sxTableColumn"
											prop="csjg_name"
											label="初审结果"
											align="center"
										>
										</el-table-column>
										<el-table-column
											class-name="sxTableColumn"
											prop="csbtgyy"
											label="初审不通过原因"
											align="center"
										>
										</el-table-column>
										<template v-if="state_id == 416">
											<el-table-column
												class-name="sxTableColumn"
												prop="fsjg"
												label="复审结果"
												align="center"
											>
												<template #default="scope">
													<el-select
														v-model="scope.row.fsjg"
														style="width: 100%"
														clearable
														@change="changeShjg(scope, 'fs')"
													>
														<el-option
															v-for="item in jgoptions"
															:key="item.value"
															:label="item.label"
															:value="item.value"
														/>
													</el-select>
												</template>
												<!-- fsjg_name -->
											</el-table-column>
											<el-table-column
												class-name="sxTableColumn"
												prop="fsbtgyy"
												label="复审不通过原因"
												align="center"
											>
												<template #default="scope">
													<el-input
														v-model="scope.row.fsbtgyy"
														style="width: 100%"
														clearable
													/>
												</template>
											</el-table-column>
										</template>

										<template v-else>
											<el-table-column
												class-name="sxTableColumn"
												prop="fsjg_name"
												label="复审结果"
												align="center"
											>
											</el-table-column>
											<el-table-column
												class-name="sxTableColumn"
												prop="fsbtgyy"
												label="复审不通过原因"
												align="center"
											>
											</el-table-column>
										</template>
									</template>

									<el-table-column
										class-name="sxTableColumn"
										fixed="right"
										label="操作"
										min-width="40"
										align="center"
										v-if="!hasStateId('all')"
									>
										<template #default="scope">
											<el-button
												link
												type="primary"
												size="small"
												@click="delTableItem(scope)"
												>删除</el-button
											>
										</template>
									</el-table-column>
								</el-table>
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
							<el-button
								v-for="item in transition"
								:key="item.transition_id"
								type="primary"
								color="#EB423F"
								@click="onSubmitValidate(ruleFormRef, onSubmit, item)"
								>{{ item.transition_name }}</el-button
							>
						</template>
						<el-button
							v-else
							type="primary"
							@click="onSubmitValidate(ruleFormRef, onSubmitState, null)"
							>提交</el-button
						>
					</template>
				</common-footer>
			</div>
		</template>
	</el-drawer>
</template>
<script setup lang="ts">
import { ref, provide } from 'vue'
import { commonHook, commonFormFun } from '@bksx/sxflow'
import { submitCom } from '@/utils/common'
import { handleflow, initflow, querydetailbyflowid } from 'api/useCommon'
import type { TabsPaneContext } from 'element-plus'
import SxSteps from 'coms/edit-modal/SxSteps.vue'
import SxAntv from 'coms/edit-modal/SxAntv.vue'
import SxLog from 'coms/edit-modal/commonTimeLine.vue'

const activeName = ref('form')
const emits = defineEmits(['getList'])
const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}

const jgoptions = [
	{
		value: '1',
		label: '通过',
	},
	{
		value: '2',
		label: '不通过',
	},
]

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
let state_id = ref(null)
provide('workflow_id', workflow_id)
provide('isState', isState)
provide('transition', transition)
const handleClose = (done: () => void) => {
	closeDrawer()
	done()
}

let useUrl = ref(handleflow)
const closeFun = () => {
	closeDrawer()
}

const changeShjg = (scope, type) => {
	if (type == 'cs') {
		if (scope.row.csjg == '1') {
			scope.row.csjg_name = '通过'
		} else if (scope.row.csjg == '2') {
			scope.row.csjg_name = '不通过'
		} else {
			scope.row.csjg_name = ''
		}
	} else {
		if (scope.row.fsjg == '1') {
			scope.row.fsjg_name = '通过'
		} else if (scope.row.fsjg == '2') {
			scope.row.fsjg_name = '不通过'
		} else {
			scope.row.fsjg_name = ''
		}
	}
}

const hasStateId = (type) => {
	const csList = [415, 417]
	const fsList = [409, 412, 414, 411, 416]
	const allList = [...csList, ...fsList]
	if (type == 'all') {
		return allList.includes(state_id.value)
	} else if (type == 'cs') {
		return csList.includes(state_id.value)
	} else if (type == 'fs') {
		return fsList.includes(state_id.value)
	}
}

const delTableItem = (scope) => {
	mainFormData.value.gbhmcry.splice(scope.$index)
}

const open = ({ workflowIdUse, idUse }: { workflowIdUse: number; idUse: number }): void => {
	console.log('open', workflowIdUse, idUse)
	isShow.value = true
	id.value = idUse
	ids.value = [idUse]
	const returnObj = submitCom(mainFormData, closeFun, useUrl.value, true)
	onSubmitValidate = returnObj.onSubmitValidate
	commonSubmit = returnObj.commonSubmit
	querydetailbyflowid({ id: idUse }).then((res) => {
		console.log(res, 'initflow')
		workflow_id.value = res.data.workflow_id
		state_id.value = res.data.state_id
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
	emits('getList', true)
}

const onSubmit = (item) => {
	let form = {
		workflow_id: workflow_id.value,
		transition_id: Number(item.transition_id),
		...mainFormData.value,
		id: id.value,
	}
	console.log(centerObj.value, 'centerObj.value')
	console.log(mainFormData.value, 'mainFormData.value')

	commonSubmit(form)
}
const onSubmitState = () => {
	console.log('submit!')
	let form = {
		workflow_id: workflow_id.value,
		transition_id: Number(mainFormData.value.transition_field),
		...mainFormData.value,
		id: id.value,
	}
	delete form.transition_field
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

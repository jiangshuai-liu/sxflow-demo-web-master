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
				label="业务信息"
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
									<el-table-column
										class-name="sxTableColumn"
										fixed="right"
										label="操作"
										min-width="40"
										align="center"
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
				label="流程进度"
				name="state"
			>
				<SxLog
					v-if="activeName == 'state'"
					:id="id"
				/>
			</el-tab-pane>
			<el-tab-pane
				label="操作记录"
				name="edit"
			>
				<SxSteps
					v-if="activeName == 'edit'"
					:id="id"
				/>
			</el-tab-pane>
			<el-tab-pane
				label="流程图"
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
import { saveflow, initflow } from 'api/useCommon'
import type { TabsPaneContext } from 'element-plus'
import SxSteps from 'coms/edit-modal/SxSteps.vue'
import SxAntv from 'coms/edit-modal/SxAntv.vue'
import SxLog from 'coms/edit-modal/commonTimeLine.vue'

const activeName = ref('form')
const emits = defineEmits(['getList'])
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
}

let useUrl = ref(saveflow)
const closeFun = () => {
	closeDrawer()
}

const delTableItem = (scope) => {
	mainFormData.value.gbhmcry.splice(scope.$index)
}

const open = ({ workflowIdUse, idUse }: { workflowIdUse: number; idUse: any[] }): void => {
	console.log('open', workflowIdUse, idUse)
	isShow.value = true
	id.value = idUse
	ids.value = idUse
	const returnObj = submitCom(mainFormData, closeFun, useUrl.value, true)
	onSubmitValidate = returnObj.onSubmitValidate
	commonSubmit = returnObj.commonSubmit
	initflow({ name: 'w' + workflowIdUse, ids: idUse }).then((res) => {
		console.log(res, 'initflow')
		workflow_id.value = res.data.workflow_id

		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		transition.value = res.data.transition
		rules.value = commonForm.rulesq
		mainFormData.value = commonForm.mainFormDatas
		formItemList.value = commonForm.formItemLists
		isState.value = commonForm.isState
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

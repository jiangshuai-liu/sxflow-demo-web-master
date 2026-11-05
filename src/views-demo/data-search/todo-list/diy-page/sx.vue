<template>
	<div class="commonPage">
		<div class="workbenchSearchCommon workbenchSearch">
			<div class="searchForm">
				<el-form
					:inline="true"
					:model="formInline"
					class="demo-form-inline"
					ref="ruleFormResetRef"
					label-width="70px"
					label-position="left"
				>
					<el-form-item
						label="事项名称"
						prop="sxName"
					>
						<el-input
							v-model="formInline.sxName"
							clearable
						/>
					</el-form-item>
					<el-form-item
						label="法律审核"
						prop="sxFlsh"
					>
						<el-select
							v-model="formInline.sxFlsh"
							clearable
						>
							<el-option
								v-for="item in yesAndNo"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>
					<el-form-item
						label="当前状态"
						prop="state_ids"
					>
						<el-select
							v-model="formInline.state_ids"
							clearable
						>
							<el-option
								v-for="item in stateList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>

					<el-form-item
						label="填报人"
						prop="createUname"
					>
						<el-input
							v-model="formInline.createUname"
							clearable
						/>
					</el-form-item>
				</el-form>
				<div class="submitBtns">
					<el-button
						:icon="RefreshRight"
						@click="resetForm(ruleFormResetRef)"
						>重置</el-button
					>
					<el-button
						class="redBtn"
						:icon="Search"
						>查询</el-button
					>
				</div>
			</div>
		</div>
		<div class="workbenchTable">
			<el-tabs
				v-model="activeName"
				class="common-tabs"
				@tab-click="handleClick"
			>
				<el-tab-pane
					label="待办事项"
					name="duty"
				>
				</el-tab-pane>
			</el-tabs>
			<el-table
				class="sxTable"
				:data="tableData"
				style="width: 100%"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
				border
			>
				<!-- height="448" -->
				<template #empty>
					<common-empty />
				</template>
				<el-table-column
					class-name="sxTableColumn"
					type="index"
					width="80"
					label="序号"
					align="center"
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="sxName"
					label="事项名称"
					align="center"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="hylxName"
					label="决策会议顺序"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					label="法律审核"
					align="center"
					show-overflow-tooltip
				>
					<template #default="scope">
						{{ scope.row.sxFlsh != '0' ? '是' : '否' }}
					</template>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="stats"
					label="当前状态"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="createUname"
					label="填报人"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="createDname"
					label="填报单位"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					fixed="right"
					label="操作"
					min-width="80"
					align="center"
				>
					<template #default="scope">
						<el-button
							link
							type="primary"
							size="small"
							@click="showItem(scope.row)"
							>查看</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<com-pagination
				ref="ComPaginationRef"
				@getPaList="getList"
			></com-pagination>
		</div>

		<edit-modal
			ref="editModalRef"
			@getList="getList"
		/>
	</div>
</template>
<script lang="ts" setup>
import editModal from '../component-4-this/sx/edit-modal/index.vue'
import ComPagination from 'coms/common/ComPagination.vue'
import emitter from '@/utils/emitter'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { resetForm, yesAndNo } from '@/utils/common'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { diyEnmus } from '@/enums/WorkflowType'
import { querydutyflowlist, queryrelationflowlist, queryworkflowstatelist } from 'api/useCommon'
import { querycommattercustomlist, querymatterstatulist } from 'api/diy-api'
const props = defineProps({
	workFlowId: {
		type: Number,
		default: 0,
	},
})

let stateList = ref([])
let activeName = ref('duty')

const emits = defineEmits(['initCard'])
const formInline = reactive({
	sxName: '',
	sxFlsh: '',
	state_ids: '',
	createUname: '',
})
const ruleFormResetRef = ref(null)

let getPa
const editModalRef = ref(null)
let tableData = ref([])
const ComPaginationRef = ref(null)

const showItem = (item) => {
	console.log(item, 'mainshow')
	console.log({ workflowIdUse: props.workFlowId, idUse: item.id })

	editModalRef.value.open({ workflowIdUse: props.workFlowId, idUse: item.id, ticketId: item.ticketId, staging: item.staging })
}

const getList = (getCard = false) => {
	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}

	let useUrl = querycommattercustomlist
	useUrl({
		page: getPa.currentPage,
		per_page: getPa.pageSize,
		category: activeName.value,
		...formInline,
		state_ids: formInline.state_ids.length ? [formInline.state_ids] : [],
	}).then((res) => {
		console.log(res.data)
		tableData.value = res.data.value
		setTimeout(() => {
			ComPaginationRef.value.setPagitionObj({
				total: res.data.total,
				currentPage: res.data.page,
				pageSize: res.data.per_page,
			})
		}, 0)

		if (getCard) {
			emits('initCard')
		}
	})
}

const handleClick = (tab, event: Event) => {
	activeName.value = tab.props.name
	getList()
}

onMounted(() => {
	getList()
	querymatterstatulist({
		type: 2,
	}).then((res) => {
		stateList.value = res.data
	})
	emitter.on('send-getList', getList)
})
onUnmounted(() => {
	console.log('romove')

	emitter.off('send-getList')
})
</script>
<style lang="scss" scoped>
.el-tabs__item {
	color: #606266;
}

.workbenchTable {
	padding: 16px 24px;
	border-radius: 8px;
	background: #ffffff;
}

.workbenchSearchCommon {
	background: #ffffff;
	border-radius: 0 0 8px 8px;
	padding: 12px 12px 3px 24px;
	box-sizing: border-box;
	min-height: 72px;
	margin-bottom: 12px;
}
</style>

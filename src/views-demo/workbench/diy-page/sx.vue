<template>
	<div class="commonPage">
		<div class="workbenchSearch">
			<el-tabs
				v-model="activeName"
				class="common-tabs"
				@tab-click="handleClick"
			>
				<el-tab-pane
					label="全部事项"
					name="duty"
				>
				</el-tab-pane>
				<!-- <el-tab-pane
					label="审核事项"
					name="relation"
				>
				</el-tab-pane> -->
			</el-tabs>

			<div class="searchForm">
				<el-form
					:inline="true"
					:model="formInline"
					class="demo-form-inline"
					ref="ruleFormResetRef"
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
							multiple
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
					<!--<el-form-item
						label="创建时间"
						prop="date"
					>
						<el-date-picker
							v-model="formInline.date"
							type="datetimerange"
							range-separator="至"
							start-placeholder="起始时间"
							end-placeholder="结束时间"
						/>
					</el-form-item> -->
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
						@click="onSearch"
						>查询</el-button
					>
				</div>
			</div>
		</div>
		<div class="workbenchTable">
			<sx-title title="查询结果">
				<template #titleBtn>
					<el-button
						type="success"
						color="#E53C3C"
						@click="addModalOpen"
						><span class="comBtnIco addIco"></span>申请</el-button
					>
				</template>
			</sx-title>
			<el-table
				class="sxTable"
				:data="tableData"
				style="width: 100%"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
				border
			>
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
							v-if="scope.row.oprations.includes('view')"
							link
							type="primary"
							size="small"
							@click="showItem(scope.row)"
							>查看</el-button
						>
						<el-button
							v-if="scope.row.oprations.includes('edite')"
							link
							type="primary"
							size="small"
							@click="showItem(scope.row)"
							>编辑</el-button
						>

						<el-popconfirm
							v-if="scope.row.oprations.includes('submit')"
							title="确定提交该条数据?"
							@confirm="submitItem(scope.row)"
							confirm-button-text="确认"
							cancel-button-text="取消"
							width="180"
						>
							<template #reference>
								<el-button
									link
									type="primary"
									size="small"
									>提交</el-button
								>
							</template>
						</el-popconfirm>
						<el-popconfirm
							v-if="scope.row.oprations.includes('retract')"
							title="确定撤回该条数据?"
							@confirm="updateItem(scope.row)"
							confirm-button-text="确认"
							cancel-button-text="取消"
							width="180"
						>
							<template #reference>
								<el-button
									link
									type="primary"
									size="small"
									>撤回</el-button
								>
							</template>
						</el-popconfirm>
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
import SxTitle from 'coms/common/SxTitle.vue'
import editModal from '../component-4-this/sx/edit-modal/index.vue'
import ComPagination from 'coms/common/ComPagination.vue'
import emitter from '@/utils/emitter'
import { ElMessage, FormInstance } from 'element-plus'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { resetForm, yesAndNo } from '@/utils/common'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { querydutyflowlist, queryrelationflowlist, queryworkflowstatelist, updateflowstate } from 'api/useCommon'
import { diyEnmus } from '@/enums/WorkflowType'
import { querymattercustomlist, querymatterstatulist, savematteratlist } from 'api/diy-api'
const props = defineProps({
	workFlowId: {
		type: Number,
		default: 0,
	},
})

let stateList = ref([])

let activeName = ref('duty')

const emits = defineEmits(['initCard', 'addOpen'])
const formInline = reactive({
	sxName: '',
	sxFlsh: '',
	state_ids: [],
	createUname: '',
})
const ruleFormResetRef = ref(null)

let getPa
const editModalRef = ref(null)
let tableData = ref([])
const ComPaginationRef = ref(null)

const addModalOpen = () => {
	emits('addOpen')
}

const submitItem = (item) => {
	savematteratlist({ id: item.id }).then((res) => {
		if (res.code == 1) {
			ElMessage({
				message: '操作成功',
				type: 'success',
			})
			getList(true)
		} else {
			ElMessage.error(`${res.data.msg || res.msg}`)
		}
	})
}

const showItem = (item) => {
	editModalRef.value.open({
		workflowIdUse: props.workFlowId,
		idUse: item.id,
		ticketId: item.ticketId,
		staging: item.staging,
	})
}

const updateItem = (row) => {
	console.log(row, '强制')

	let useForm = {
		id: row.ticketId,
		state_id: '402',
		suggestion: '撤回',
		fields: { status: '5' },
	}
	updateflowstate(useForm).then((res) => {
		if (res.code == 1 && res.data) {
			ElMessage({
				message: '操作成功',
				type: 'success',
			})
			getList(true)
		} else {
			ElMessage.error(`${res.data.msg || res.msg}`)
		}
	})
}

const getList = (getCard = false) => {
	console.log(getCard, 'getCard')

	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}

	let useUrl = querymattercustomlist
	useUrl({
		workflow_id: props.workFlowId,
		page: getPa.currentPage,
		per_page: getPa.pageSize,
		...formInline,
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

const onSearch = () => {
	getList(true)
}

const handleClick = (tab, event: Event) => {
	console.log(tab.props.name, event)
	activeName.value = tab.props.name

	getList(true)
}

onMounted(() => {
	console.log('update')
	getList()

	querymatterstatulist({
		type: 1,
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
</style>

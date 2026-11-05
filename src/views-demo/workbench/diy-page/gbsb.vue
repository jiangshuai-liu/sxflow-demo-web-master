<template>
	<div class="commonPage">
		<div class="workbenchSearch">
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
				<el-tab-pane
					label="审核事项"
					name="relation"
				>
				</el-tab-pane>
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
						prop="title"
					>
						<el-input
							v-model="formInline.title"
							clearable
						/>
					</el-form-item>
					<el-form-item
						label="创建人员"
						prop="creator"
					>
						<el-input
							v-model="formInline.creator"
							clearable
						/>
					</el-form-item>
					<el-form-item
						label="事项状态"
						prop="state_ids"
					>
						<el-select
							v-model="formInline.state_ids"
							multiple
							clearable
							collapse-tags
							collapse-tags-tooltip
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
						label="创建时间"
						prop="use_date"
					>
						<el-date-picker
							v-model="formInline.use_date"
							type="datetimerange"
							value-format="YYYY-MM-DD"
							range-separator="至"
							start-placeholder="起始时间"
							end-placeholder="结束时间"
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
					prop="title"
					label="事项名称"
					align="center"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="workflow_name"
					label="提交类型"
					align="center"
					show-overflow-tooltip
				>
					<template #default="scope">
						{{ scope.row?.workflow_info?.workflow_name }}
					</template>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="creator"
					label="提交人"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					label="提交部门"
					align="center"
					show-overflow-tooltip
				>
					<template #default="scope">
						{{ scope.row?.creator_info?.dept_info.name }}
					</template>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					label="事项状态"
					align="center"
					show-overflow-tooltip
				>
					<template #default="scope">
						<sx-tag
							:typeUseList="type2color"
							:checkId="scope.row?.state?.state_id"
							:checkName="scope.row?.state?.state_name"
						/>
					</template>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="gmt_created"
					label="提交时间"
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
							>{{ activeName == 'duty' ? '审核' : '查看' }}</el-button
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
import SxTitle from 'coms/common/SxTitle.vue'
import editModal from '../component-4-this/gbsb/edit-modal/index.vue'
import ComPagination from 'coms/common/ComPagination.vue'
import emitter from '@/utils/emitter'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { resetForm, type2color } from '@/utils/common'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { querydutyflowlist, queryrelationflowlist, queryworkflowstatelist } from 'api/useCommon'
import { diyEnmus } from '@/enums/WorkflowType'
import { querymattercustomlist } from 'api/diy-api'
const props = defineProps({
	workFlowId: {
		type: Number,
		default: 0,
	},
})

let activeName = ref('duty')
let stateList = ref([])
const emits = defineEmits(['initCard', 'addOpen'])
const formInline = reactive({
	title: '',
	creator: '',
	state_ids: [],
	use_date: [],
})
const ruleFormResetRef = ref(null)

let getPa
const editModalRef = ref(null)
let tableData = ref([])
const ComPaginationRef = ref(null)

const addModalOpen = () => {
	emits('addOpen')
}

const showItem = (item) => {
	console.log(item, 'mainshow')
	console.log({ workflowIdUse: diyEnmus.gbsb, idUse: item.id })

	editModalRef.value.open({ workflowIdUse: diyEnmus.gbsb, idUse: item.id })
}

const getList = (getCard = false) => {
	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}
	let useUrl = activeName.value == 'duty' ? querydutyflowlist : queryrelationflowlist
	useUrl({
		workflow_id: diyEnmus.gbsb,
		page: getPa.currentPage,
		per_page: getPa.pageSize,
		category: activeName.value,
		...formInline,
		start_time: formInline.use_date?.[0] || '',
		end_time: formInline.use_date?.[1] || '',
	}).then((res) => {
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
	queryworkflowstatelist({
		workflow_id: diyEnmus.gbsb,
	}).then((res) => {
		formInline.state_ids = []
		stateList.value = res.data
	})
	getList()
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

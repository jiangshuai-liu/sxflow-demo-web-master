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
						prop="title"
					>
						<el-input
							v-model="formInline.title"
							clearable
						/>
					</el-form-item>
					<!-- <el-form-item
						v-if="isAll"
						label="所属业务"
						prop="workflow_id"
					>
						<el-select
							v-model="formInline.workflow_id"
							@change="clearState"
							clearable
						>
							<el-option
								v-for="item in cardList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</el-form-item> -->

					<el-form-item
						v-if="!isAll"
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
						label="创建人员"
						prop="creator"
					>
						<el-input
							v-model="formInline.creator"
							clearable
						/>
					</el-form-item>
					<el-form-item
						label="创建时间"
						prop="use_date"
					>
						<el-date-picker
							v-model="formInline.use_date"
							type="datetimerange"
							value-format="YYYY-MM-DD HH:mm:ss"
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
						@click="getList()"
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
					name="wddb"
				>
				</el-tab-pane>
			</el-tabs>
			<el-table
				class="sxTable"
				:data="tableData"
				style="width: 100%"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
				ref="multipleTableRef"
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
					prop="title"
					label="事项名称"
					align="center"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="workflow_name"
					label="所属业务"
					align="center"
					v-if="isAll"
					show-overflow-tooltip
				>
					<template #default="scope">
						{{ scope.row?.workflow_info?.workflow_name }}
					</template>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="creator"
					label="创建人员"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					label="创建部门"
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
					label="创建时间"
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
import editModal from 'coms/edit-modal/index.vue'
import ComPagination from 'coms/common/ComPagination.vue'
import emitter from '@/utils/emitter'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { resetForm, type2color } from '@/utils/common'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { querydutyflowlist, queryrelationflowlist, queryworkflowstatelist, queryrelationworkflowlist } from 'api/useCommon'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps({
	workFlowId: {
		type: Number,
		default: 0,
	},
})

let activeName = ref('wddb')
const isAll = computed(() => route.params.id == 'useid')
let stateList = ref([])
let cardList = ref([])

const emits = defineEmits(['initCard'])
const formInline = reactive({
	title: '',
	creator: '',
	workflow_id: '',
	state_ids: [],
	use_date: [],
})
const ruleFormResetRef = ref(null)

let getPa
const editModalRef = ref(null)
let tableData = ref([])
const ComPaginationRef = ref(null)

const showItem = (item) => {
	console.log(item, 'mainshow')
	console.log({ workflowIdUse: route.params.id, idUse: item.id })

	editModalRef.value.open({ workflowIdUse: route.params.id, idUse: item.id })
}

const handleClick = (tab, event: Event) => {
	activeName.value = tab.props.name
	getList()
}

const getList = () => {
	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}
	const urlId = route.params.id != 'useid' ? route.params.id : ''
	querydutyflowlist({
		...formInline,
		workflow_id: formInline.workflow_id || urlId,
		page: getPa.currentPage,
		per_page: getPa.pageSize,
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
	})
}

const clearState = () => {
	const urlId = route.params.id != 'useid' ? route.params.id : ''
	queryworkflowstatelist({
		workflow_id: formInline.workflow_id || urlId,
	}).then((res) => {
		formInline.state_ids = []
		stateList.value = res.data
	})
}
onMounted(() => {
	console.log('update')
	if (route.params?.id) {
		getList()
	}
	if (isAll.value) {
		queryrelationworkflowlist({}).then((res) => {
			cardList.value = res.data
		})
	} else {
		clearState()
	}

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

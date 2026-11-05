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
						v-if="isAll"
						label="创建类型"
						prop="workflow_name"
					>
						<el-select
							v-model="formInline.workflow_name"
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
					label="填报事项"
					name="wcjd"
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
					:prop="item.key"
					:label="item.name"
					align="center"
					v-for="item in headerList"
					:key="item.key"
					min-width="100"
					show-overflow-tooltip
				>
				</el-table-column>
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
import editModal from 'coms/simple-show-modal/index.vue'
import ComPagination from 'coms/common/ComPagination.vue'
import emitter from '@/utils/emitter'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { resetForm } from '@/utils/common'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { queryworkflowstatelist, queryrelationworkflowlist, queryfillingdatalist, queryfillingdatakeys } from 'api/useCommon'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps({
	workFlowId: {
		type: Number,
		default: 0,
	},
})

let activeName = ref('wcjd')
const isAll = computed(() => route.params.id == 'useid')
let stateList = ref([])
let cardList = ref([])
const emits = defineEmits(['initCard'])
const formInline = reactive({
	title: '',
	creator: '',
	workflow_name: '',
	state_ids: [],
	use_date: [],
})
const ruleFormResetRef = ref(null)
let headerList = ref([])
let getPa
const editModalRef = ref(null)
let tableData = ref([])
const ComPaginationRef = ref(null)

const showItem = (item) => {
	editModalRef.value.open({ workflowId: route.params.id, id: item.id })
}

const handleClick = (tab, event: Event) => {
	activeName.value = tab.props.name
	getList()
}

const getList = () => {
	if (route.params.id == 'useid') return
	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}

	queryfillingdatakeys({ workflowId: route.params.id }).then((res) => {
		// headerList.value = res.data.filter((item) => !item.tag)
		headerList.value = res.data.filter((item) => item.tag)
	})
	let useUrl,
		useForm: any = {
			name: '_w' + route.params.id,
			page: getPa.currentPage,
			per_page: getPa.pageSize,
			...formInline,
			start_time: formInline.use_date?.[0] || '',
			end_time: formInline.use_date?.[1] || '',
		}
	switch (activeName.value) {
		case 'wcjd':
			useUrl = queryfillingdatalist
			break

		default:
			break
	}
	useUrl(useForm).then((res) => {
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
	queryworkflowstatelist({
		workflow_id: formInline.workflow_name,
	}).then((res) => {
		formInline.state_ids = []
		stateList.value = res.data
	})
}
onMounted(() => {
	if (isAll.value) {
		queryrelationworkflowlist({}).then((res) => {
			cardList.value = res.data
		})
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

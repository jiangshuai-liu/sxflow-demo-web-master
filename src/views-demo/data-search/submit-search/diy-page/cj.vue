<template>
	<div class="commonPage">
		<div class="workbenchSearchCommon workbenchSearch">
			<div class="searchForm">
				<el-form
					:inline="true"
					:model="formInline"
					class="demo-form-inline"
					ref="ruleFormResetRef"
					label-width="90px"
					label-position="left"
				>
					<el-form-item
						label="地址类型"
						prop="fwxxDzlx"
					>
						<el-input
							v-model="formInline.fwxxDzlx"
							clearable
						/>
					</el-form-item>
					<el-form-item
						label="房屋类型"
						prop="fczCzlx"
					>
						<el-select
							v-model="formInline.fczCzlx"
							clearable
							collapse-tags
							collapse-tags-tooltip
						>
							<el-option
								v-for="item in houseTypeList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>
					<el-form-item
						label="产权人姓名"
						prop="hownerFzxm"
					>
						<el-input
							v-model="formInline.hownerFzxm"
							clearable
						/>
					</el-form-item>
					<el-form-item
						label="房屋详址"
						prop="bihHlocusAdd"
					>
						<el-input
							v-model="formInline.bihHlocusAdd"
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
					label="填报事项"
					name="wdcj"
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
					prop="fwxxDzlxName"
					label="地址类型"
					align="center"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="fczCzlxName"
					label="房屋类型"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="bihRegioncodeName"
					label="所属社区"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="bihTdxzName"
					label="土地性质"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="bihHownertypeName"
					label="房屋产权类型"
					align="center"
					show-overflow-tooltip
				/>
				<!-- <el-table-column
					class-name="sxTableColumn"
					prop="createUname"
					label="出租人类型"
					align="center"
				/> -->
				<el-table-column
					class-name="sxTableColumn"
					prop="hownerFzxm"
					label="产权人姓名"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="bihHlocusAdd"
					label="房屋详址"
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
import editModal from '../component-4-this/cj/edit-modal/index.vue'
import ComPagination from 'coms/common/ComPagination.vue'
import emitter from '@/utils/emitter'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { resetForm } from '@/utils/common'
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { queryhousecollectioncustomlist, queryhousetypelist } from 'api/diy-api'

const route = useRoute()
const props = defineProps({
	workFlowId: {
		type: Number,
		default: 0,
	},
})

let houseTypeList = ref([])

let activeName = ref('wdcj')

const emits = defineEmits(['initCard'])
const formInline = reactive({
	fwxxDzlx: '',
	fczCzlx: '',
	hownerFzxm: '',
	bihHlocusAdd: '',
})
const ruleFormResetRef = ref(null)

let getPa
const editModalRef = ref(null)
let tableData = ref([])
const ComPaginationRef = ref(null)

const showItem = (item) => {
	console.log(item, 'mainshow')
	console.log({ workflowIdUse: props.workFlowId, idUse: item.id })

	editModalRef.value.open({ workflowIdUse: props.workFlowId, idUse: item.id })
}

const getList = (getCard = false) => {
	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}

	let useUrl = queryhousecollectioncustomlist
	let useForm: any = {
		workflow_id: props.workFlowId,
		page: getPa.currentPage,
		per_page: getPa.pageSize,
		...formInline,
	}
	switch (activeName.value) {
		case 'all':
			useForm.category = 'relation'
			break
		case 'wsqd':
			useForm.category = 'owner'
			break
		case 'jxzd':
			useForm.type = 'inprogress'
			useForm.category = 'relation'
			break
		case 'ybjd':
			useForm.type = 'finish'
			useForm.category = 'relation'
			break

		default:
			break
	}
	useUrl(useForm).then((res) => {
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
	console.log(tab.props.name, event)
	activeName.value = tab.props.name

	getList()
}

onMounted(() => {
	console.log('update')
	queryhousetypelist({}).then((res) => {
		console.log(res.data, 'queryhousetypelist')
		houseTypeList.value = res.data
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

.workbenchSearchCommon {
	background: #ffffff;
	border-radius: 0 0 8px 8px;
	padding: 12px 12px 3px 24px;
	box-sizing: border-box;
	min-height: 72px;
	margin-bottom: 12px;
}
</style>

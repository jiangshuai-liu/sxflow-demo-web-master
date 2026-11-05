<template>
	<div class="commonPage">
		<div class="searchForm">
			<el-form
				:inline="true"
				:model="formInline"
				class="demo-form-inline"
				ref="ruleFormResetRef"
				label-position="left"
				label-width="90"
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
					@click="getList()"
					>查询</el-button
				>
			</div>
		</div>
		<div class="workbenchTable">
			<sx-title :title>
				<template #titleBtn>
					<div>
						<el-button
							type="success"
							color="#E53C3C"
							@click="addMain"
							><span class="comBtnIco addIco"></span>新增</el-button
						>
						<el-button
							type="success"
							color="#E53C3C"
							><span class="comBtnIco efferentIco"></span>导出</el-button
						>
						<el-button
							type="success"
							color="#E53C3C"
							><span class="comBtnIco efferentIco"></span>导入</el-button
						>
					</div>
				</template>
			</sx-title>
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
					width="140"
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
						<el-button
							link
							type="primary"
							size="small"
							@click="editItem(scope.row)"
							>编辑</el-button
						>

						<el-popconfirm
							title="确定删除该条数据?"
							@confirm="delItem(scope.row)"
							confirm-button-text="确认"
							cancel-button-text="取消"
							width="180"
						>
							<template #reference>
								<el-button
									link
									type="primary"
									size="small"
									>删除</el-button
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
		<simple-show-modal ref="simpleShowModalRef" />
		<simple-edit-modal
			ref="simpleEditModalRef"
			@getList="getList"
		/>
	</div>
</template>
<script lang="ts" setup>
import sxTitle from 'coms/common/SxTitle.vue'
import simpleShowModal from 'coms/simple-show-modal/index.vue'
import simpleEditModal from 'coms/simple-edit-modal/index.vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { resetForm } from '@/utils/common'
import emitter from '@/utils/emitter'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { deletefillingdatabyid } from 'api/useCommon'
import { querydeptlist, queryhousetypelist } from 'api/diy-api'

const title = '查询结果'
const props = defineProps({
	workFlowId: {
		type: Number,
		default: 0,
	},
})

let houseTypeList = ref([])

const simpleShowModalRef = ref(null)
const simpleEditModalRef = ref(null)
const emits = defineEmits(['initCard', 'addMain'])
const formInline = reactive({
	fwxxDzlx: '',
	fczCzlx: '',
	hownerFzxm: '',
	bihHlocusAdd: '',
})

const ruleFormResetRef = ref(null)

let getPa
let tableData = ref([])
const ComPaginationRef = ref(null)

const addMain = () => {
	emits('addMain')
}

const getList = (getCard = false) => {
	console.log('commongetlist')

	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}
	console.log(props.workFlowId, props, ComPaginationRef)

	querydeptlist({
		workflow_id: props.workFlowId,
		page: getPa.currentPage,
		per_page: getPa.pageSize,
		...formInline,
	}).then((res) => {
		console.log(res.data, 'queryfillingdatalist')
		tableData.value = res.data.value
		setTimeout(() => {
			console.log(ComPaginationRef.value)

			ComPaginationRef.value &&
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
const editItem = (item) => {
	simpleEditModalRef.value.open({ workflowId: props.workFlowId, useId: item.id })
}
const showItem = (item) => {
	console.log(item)
	simpleShowModalRef.value.open({ workflowId: props.workFlowId, id: item.id })
}

const delItem = (item) => {
	const form = { workflow_id: props.workFlowId, id: item.id }
	deletefillingdatabyid(form).then((res) => {
		console.log(res)
		getList()
	})
}
onMounted(() => {
	console.log('update')
	getList()
	queryhousetypelist({}).then((res) => {
		console.log(res.data, 'queryhousetypelist')
		houseTypeList.value = res.data
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

.searchForm {
	display: flex;
	background: #ffffff;
	border-radius: 8px 8px 8px 8px;
	padding: 12px 24px 0;
	box-sizing: border-box;
	margin-bottom: 24px;

	.submitBtns {
		width: 200px;
		flex-shrink: 0;
		display: flex;
		align-items: flex-end;
		margin-bottom: 12px;
	}
}
</style>

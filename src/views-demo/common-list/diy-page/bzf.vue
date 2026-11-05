<template>
	<div class="commonPage">
		<div class="searchForm">
			<el-form
				:inline="true"
				:model="formInline"
				class="demo-form-inline"
				ref="ruleFormResetRef"
				label-position="left"
				label-width="100"
			>
				<el-form-item
					label="是否取得联系"
					prop="sfqdlx"
				>
					<el-select
						v-model="formInline.sfqdlx"
						clearable
						collapse-tags
						collapse-tags-tooltip
					>
						<el-option
							v-for="item in yesAndNoObj"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="是否就业"
					prop="sfjy"
				>
					<el-select
						v-model="formInline.sfjy"
						clearable
						collapse-tags
						collapse-tags-tooltip
					>
						<el-option
							v-for="item in yesAndNoObj"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="姓名"
					prop="xm"
				>
					<el-input
						v-model="formInline.xm"
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
						<!-- <el-button
							type="success"
							color="#E53C3C"
							@click="addMain"
							><span class="comBtnIco addIco"></span>新增</el-button
						> -->
						<!-- <el-button
							type="success"
							color="#E53C3C"
							@click="exportFile"
							><span class="comBtnIco efferentIco"></span>导出</el-button
						> -->
						<!-- <el-button
							type="success"
							color="#E53C3C"
							><span class="comBtnIco efferentIco"></span>导入</el-button
						> -->
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
					prop="xm"
					label="姓名"
					align="center"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="sjhm"
					label="手机号码"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="jzdxxzz"
					label="居住地"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="sfjyName"
					label="是否就业"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="sfqdlxName"
					label="是否取得联系"
					align="center"
					show-overflow-tooltip
				/>

				<el-table-column
					class-name="sxTableColumn"
					prop="sfqdlxWqdyyName"
					label="未取得联系原因"
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
import { resetForm, yesAndNo } from '@/utils/common'
import emitter from '@/utils/emitter'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { querybzfqnmp } from 'api/diy-api'

const yesAndNoObj = [
	{
		id: 1,
		name: '是',
	},
	{
		id: 2,
		name: '否',
	},
]

const title = '查询结果'
const props = defineProps({
	workFlowId: {
		type: Number,
		default: 0,
	},
})

const simpleShowModalRef = ref(null)
const simpleEditModalRef = ref(null)
const emits = defineEmits(['initCard', 'addMain'])
const formInline = reactive({
	sfqdlx: '',
	sfjy: '',
	xm: '',
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

	querybzfqnmp({
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

onMounted(() => {
	console.log('update')
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

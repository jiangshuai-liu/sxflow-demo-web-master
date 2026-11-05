<template>
	<div class="appInsert">
		<rbac-title title="应用列表">
			<template #titleBtn>
				<el-button
					type="primary"
					:icon="Plus"
					@click="addAppInsert"
				>
					新增应用</el-button
				>
			</template>
		</rbac-title>
		<el-table
			class="sxTable"
			:data="tableData"
			style="width: 100%"
			header-cell-class-name="sxTableHeader"
			header-row-class-name="sxTableHeader"
			ref="multipleTableRef"
			border
		>
			<!-- @selection-change="handleSelectionChange" -->

			<!-- height="448" -->
			<template #empty>
				<common-empty />
			</template>
			<!-- <el-table-column
					class-name="sxTableColumn"
					type="selection"
					width="55"
				/> -->
			<el-table-column
				class-name="sxTableColumn"
				type="index"
				width="80"
				label="序号"
				align="center"
			/>
			<el-table-column
				class-name="sxTableColumn"
				prop="proname"
				label="应用名称"
				align="center"
				min-width="100"
				show-overflow-tooltip
			>
			</el-table-column>
			<el-table-column
				class-name="sxTableColumn"
				prop="uri"
				label="应用地址"
				align="center"
				min-width="100"
				show-overflow-tooltip
			>
			</el-table-column>
			<el-table-column
				class-name="sxTableColumn"
				prop="contacts"
				label="联系人"
				align="center"
				min-width="100"
				show-overflow-tooltip
			>
			</el-table-column>
			<el-table-column
				class-name="sxTableColumn"
				prop="phone"
				label="联系电话"
				align="center"
				min-width="100"
				show-overflow-tooltip
			>
			</el-table-column>
			<el-table-column
				class-name="sxTableColumn"
				prop="createtime"
				label="接入时间"
				align="center"
				min-width="100"
				show-overflow-tooltip
			>
			</el-table-column>
			<el-table-column
				class-name="sxTableColumn"
				fixed="right"
				label="操作"
				align="center"
				width="80"
			>
				<template #default="scope">
					<el-button
						link
						type="primary"
						size="small"
						@click="showAppInsert(scope.row)"
					>
						查看
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<com-pagination
			ref="ComPaginationRef"
			@getPaList="init"
		></com-pagination>
		<add-modal
			title="新增应用"
			ref="AddModalRef"
		></add-modal>

		<rbac-edit-modal
			title="查看应用"
			ref="RbacEditModalRef"
		>
		</rbac-edit-modal>
	</div>
</template>
<script setup lang="ts">
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import AddModal from 'coms/add-modal/index.vue'
import RbacEditModal from './rbac-edit-modal/index.vue'
import { Plus } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { rbacEnums } from '@/enums/rbacEnums'
import { resetForm, sxPagenationSelf, tableHeaderFun } from '@/utils/common'
import {
	querydutyflowlist,
	queryrelationflowlist,
	queryfillingdatalist,
	deletefillingdatabyid,
	queryfillingdatakeys,
	exportfillingdata,
} from 'api/useCommon'
import { useRoute } from 'vue-router'

const route = useRoute()
const AddModalRef = ref(null)
const RbacEditModalRef = ref(null)
let tableData = ref([])
const ComPaginationRef = ref(null)
let getPa
const init = () => {
	console.log('初始化列表')
	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}
	queryfillingdatalist({
		name: '_w' + rbacEnums.appInsert,
		page: getPa.currentPage,
		per_page: getPa.pageSize,
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
	})
}

const addAppInsert = () => {
	const traslateForm = {}
	AddModalRef.value.open(rbacEnums.appInsert, traslateForm, false, () => {
		init()
	})
}

const showAppInsert = (row) => {
	// console.log(row, 'row')
	const traslateForm = { _id: row.id }
	RbacEditModalRef.value.open(rbacEnums.appInsert, traslateForm, false)
}

onMounted(() => {
	init()
}),
	RbacTitle
</script>
<style lang="scss" scoped>
.appInsert {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background: #ffffff;
	border-radius: 8px;
	padding: 16px;
	box-sizing: border-box;
	flex-shrink: 0;
}

.sxTable {
	margin-top: 10px;
}
</style>

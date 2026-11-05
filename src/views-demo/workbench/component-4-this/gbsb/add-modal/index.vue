<template>
	<div>
		<el-dialog
			v-model="dialogVisible"
			title="花名册生成"
			width="60%"
			:before-close="handleClose"
		>
			<el-table
				class="sxTable"
				:data="tableData"
				style="width: 100%"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
				ref="multipleTableRef"
				@selection-change="handleSelectionChange"
			>
				<!-- height="448" -->
				<template #empty>
					<common-empty />
				</template>
				<el-table-column
					type="selection"
					width="55"
				/>
				<el-table-column
					class-name="sxTableColumn"
					type="index"
					width="80"
					label="序号"
					align="center"
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="dwxxbName"
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
					prop="sfzhm"
					label="身份证号码"
					align="center"
				/>

				<el-table-column
					class-name="sxTableColumn"
					prop="htqsrq"
					label="劳动合同开始时间"
					align="center"
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="htjsrq"
					label="劳动合同结束时间"
					align="center"
				/>
				<!-- <el-table-column
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
							@click="submitItem(scope.row)"
							>提交</el-button
						>
					</template>
				</el-table-column> -->
			</el-table>
			<com-pagination
				ref="ComPaginationRef"
				@getPaList="getList"
			></com-pagination>
			<template #footer>
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
						<el-button
							type="primary"
							color="#EB423F"
							@click="submitItem"
							>提交</el-button
						>
					</template>
				</common-footer>
			</template>
		</el-dialog>

		<cur-add-modal
			ref="curAddModalRef"
			@getList="useGetList"
		/>
	</div>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import { querypersonnellist } from 'api/diy-api'
import curAddModal from './cur-add-modal/index.vue'

const emits = defineEmits(['getList'])
let getPa
const ComPaginationRef = ref(null)
const dialogVisible = ref(false)
let curAddModalRef = ref(null)
let tableData = ref([])
let workflowIds = ref(null)

let checkList = ref([])
let multipleTableRef = ref(null)

const closeDrawer = () => {
	dialogVisible.value = false
	tableData.value = []
}

const useGetList = () => {
	emits('getList')
}

const open = (workflowId: number): void => {
	dialogVisible.value = true
	workflowIds.value = workflowId
	nextTick(() => {
		getList()
	})
}

const getList = () => {
	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}
	querypersonnellist({
		page: getPa.currentPage,
		per_page: getPa.pageSize,
	}).then((res) => {
		console.log(res.data.value)
		tableData.value = res.data.value
		setTimeout(() => {
			ComPaginationRef.value.setPagitionObj({
				total: res.data.total,
				currentPage: res.data.page,
				pageSize: res.data.per_page,
			})
		}, 0)

		let arr2Map = {}
		checkList.value.forEach((item) => (arr2Map[item.id] = item))
		console.log(checkList.value, 'checkList.value')
		const curCheckList: any[] = JSON.parse(JSON.stringify(checkList.value))
		nextTick(() => {
			tableData.value.forEach((item, index) => {
				arr2Map[item.id] && multipleTableRef.value?.toggleRowSelection(tableData.value[index], true)
			})
			checkList.value = [...checkList.value, ...curCheckList]
		})
	})
}

const handleSelectionChange = (val) => {
	console.log(val, 'checkList')

	checkList.value = val
}

const submitItem = () => {
	curAddModalRef.value.open({ workflowIdUse: workflowIds.value, idUse: checkList.value.map((item) => item.id) })
	closeDrawer()
}

const handleClose = (done: () => void) => {
	done()
}

defineExpose({
	open,
})
</script>
<style lang="scss" scoped></style>

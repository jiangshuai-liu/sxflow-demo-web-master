<template>
	<div>
		<el-dialog
			v-model="dialogVisible"
			title="创业服务机构"
			width="60%"
			:before-close="handleClose"
		>
			<el-table
				class="sxTable"
				:data="tableData"
				style="width: 100%"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
			>
				<!-- height="448" -->
				<template #empty>
					<common-empty />
				</template>
				<!-- <el-table-column
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
					prop="jbxxJgmc"
					label="机构名称"
					align="center"
				>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="jbxxZcdz"
					label="注册地址"
					align="center"
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="jbxxTyshxydm"
					label="统一社会信用代码"
					align="center"
				/>

				<el-table-column
					class-name="sxTableColumn"
					prop="jbxxFddbr"
					label="法定代表人"
					align="center"
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
							@click="submitItem(scope.row)"
							>提交</el-button
						>
					</template>
				</el-table-column>
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
					<!-- <template #submit>
						<template v-if="!isState">
							<el-button
								v-for="item in transition"
								:key="item.transition_id"
								type="primary"
								color="#EB423F"
								@click="onSubmitValidate(ruleFormRef, onSubmit, item)"
								>{{ item.transition_name }}</el-button
							>
						</template>
					</template> -->
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
import { queryorganizationcustomlist } from 'api/diy-api'
import curAddModal from './cur-add-modal/index.vue'

const emits = defineEmits(['getList'])
let getPa
const ComPaginationRef = ref(null)
const dialogVisible = ref(false)
let curAddModalRef = ref(null)
let tableData = ref([])
let workflowIds = ref(null)

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
	queryorganizationcustomlist({
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
	})
}

const submitItem = (item) => {
	console.log(item)
	curAddModalRef.value.open({ workflowIdUse: workflowIds.value, idUse: item.id })
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

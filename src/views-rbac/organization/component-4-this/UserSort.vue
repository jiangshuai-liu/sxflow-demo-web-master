<template>
	<div class="commonBottom">
		<div class="draggable">
			<el-table
				row-key="id"
				:data="dataList"
				style="width: 100%"
				border
				class="sxTable"
				max-height="500"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
			>
				<template #empty>
					<common-empty />
				</template>
				<el-table-column
					type="index"
					width="80"
					label="序号"
					align="center"
					fixed
				>
				</el-table-column>
				<el-table-column
					prop="name"
					label="姓名"
					align="center"
				></el-table-column>
				<el-table-column
					prop="sex"
					label="性别"
					align="center"
				>
					<template #default="scope">
						{{ scope.row.sex == 1 ? '男' : scope.row.sex == 2 ? '女' : '' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="nickname"
					label="登录用户名"
					align="center"
				></el-table-column>
				<el-table-column
					prop="duty"
					label="职位"
					align="center"
				></el-table-column>
				<el-table-column
					prop="deftime"
					label="定义时间"
					align="center"
				></el-table-column>
			</el-table>
		</div>

		<div class="changeBtns">
			<el-button
				type="primary"
				@click="saveTable"
			>
				保存
			</el-button>
		</div>
	</div>
</template>
<script setup lang="ts">
import _ from 'lodash'
import useTools from 'use-tools-before'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { queryuserlist, updateuserorder } from 'api/rbac'
import type { companyIdType } from '@/types/rbac/organization'

const props = withDefaults(defineProps<companyIdType>(), {})

let dataList = ref([])

const init = () => {
	const dd_superdid = props.companyId.toString()

	const formData = { deptId: dd_superdid }
	queryuserlist(formData).then((res) => {
		dataList.value = res.data
	})
}

const saveTable = () => {
	const trueSortList = _.map(dataList.value, 'id')
	console.log(dataList.value, trueSortList)
	updateuserorder({
		uidList: trueSortList,
	}).then((res) => {
		if (res.code == 1) {
			ElMessage({
				message: '修改成功',
				type: 'success',
			})
		}
	})
}
onMounted(async () => {
	await useTools.dragTableFun().rowDrop(dataList)
	await init()
})

defineExpose({
	init,
})
</script>
<style scoped lang="scss">
.changeBtns {
	display: flex;
	justify-content: center;
	align-items: center;
}
.draggable {
	flex: 1;
}
</style>

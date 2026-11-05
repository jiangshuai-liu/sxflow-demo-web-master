<template>
	<div class="commonBottom">
		<div class="draggable">
			<el-table
				row-key="name"
				:data="dataList"
				style="width: 100%"
				border
				class="sxTable"
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
					label="单位名称"
					align="center"
				></el-table-column>
				<el-table-column
					prop="lid"
					label="单位法人码"
					align="center"
				></el-table-column>
				<el-table-column
					prop="cpname"
					label="联系人"
					align="center"
				></el-table-column>
				<el-table-column
					prop="num"
					label="电子邮件"
					align="center"
				></el-table-column>
				<el-table-column
					prop="deftime"
					label="定义时间"
					align="center"
				>
				</el-table-column>
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
import useTools from 'use-tools-before'
import _ from 'lodash'
import { onMounted, ref } from 'vue'
import { querydeptmenu, updatedeptorder } from 'api/rbac'
import type { companyIdType } from '@/types/rbac/organization'
import { ElMessage } from 'element-plus'
const props = withDefaults(defineProps<companyIdType>(), {})
let dataList = ref([])

const init = () => {
	const dd_superdid = props.companyId.toString()
	const formData = { deptId: dd_superdid }
	querydeptmenu(formData).then((res) => {
		dataList.value = res.data
	})
}

const saveTable = () => {
	const trueSortList = _.map(dataList.value, 'id')
	console.log(dataList.value, trueSortList)
	updatedeptorder({ uidList: trueSortList }).then((res) => {
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

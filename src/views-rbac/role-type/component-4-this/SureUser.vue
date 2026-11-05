<template>
	<el-dialog
		v-model="isShow"
		title="确认"
		width="60%"
		:before-close="handleClose"
		append-to="body"
	>
		<!-- modal-class="editModal" -->
		<div
			class="groupTable"
			v-for="(key, value) in data"
			:key="value"
		>
			<div class="selectHeader">{{ value }}</div>
			<el-table
				:data="key"
				style="width: 100%"
				border
				row-key="id"
				class="sxTable"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
				:show-header="false"
				ref="multipleTableRef"
			>
				<template #empty>
					<common-empty />
				</template>
				<el-table-column
					type="index"
					width="40"
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
					prop="nickName"
					label="登录用户名"
					align="center"
				></el-table-column>
				<el-table-column
					prop="sex"
					label="性别"
					align="center"
				>
				</el-table-column>
				<el-table-column
					prop="deftime"
					label="定义时间"
					align="center"
				>
				</el-table-column>
				<el-table-column
					prop="id"
					label="id"
					align="center"
				>
				</el-table-column>
			</el-table>
		</div>
		<template #footer>
			<div class="saveBtn">
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
							@click="save"
							>保存</el-button
						>
					</template>
				</common-footer>
			</div>
		</template>
	</el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { grantrolelist } from 'api/rbac'
import type { propsType } from '@/types/rbac/RoleType'
import _ from 'lodash'
import { ElMessage } from 'element-plus'

let data = ref({})
let trueData = ref([])

const props = withDefaults(defineProps<Partial<propsType>>(), {
	title: '填报事项',
})

const emits = defineEmits<{
	closeFun: []
	changeCompanyList: []
}>()
let isShow = ref(false)

const handleClose = (done: () => void) => {
	closeDrawer()
	done()
}

const closeFun = () => {
	closeDrawer()
	emits('changeCompanyList')
}

const open = async (useList: any[], userId: string) => {
	isShow.value = true

	trueData.value = useList.map((item) => item.id)
	data.value = _.groupBy(useList, 'deptName')
}

const save = () => {
	grantrolelist({ roleId: props.companyId as string, userIdList: trueData.value, type: 'promise' }).then((res) => {
		// console.log(res.data, 'res.data')
		if (res.code == 1) {
			ElMessage.success('保存成功！')
			closeDrawer()
			emits('closeFun')
		}
	})
}

const closeDrawer = () => {
	isShow.value = false
	data.value = []
}

defineExpose({
	open,
})
</script>
<style lang="scss" scoped>
.selectHeader {
	height: 30px;
	background: #f5f7fa;
	font-family: PingFang SC, PingFang SC;
	font-weight: 500;
	font-size: 16px;
	color: #606266;
	padding-left: 10px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
}

.groupTable:not(:last-child) {
	margin-bottom: 10px;
}
</style>

<template>
	<div class="commonBottom">
		<div class="searchResult">
			<div class="searchList">
				<rbac-title title="查询结果">
					<template #titleBtn>
						<div class="btns">
							<el-button
								type="primary"
								:icon="Plus"
								@click="clearCompanyFun()"
								v-if="multipleSelection.length"
							>
								取消授权
							</el-button>
							<el-button
								type="primary"
								:icon="Plus"
								@click="addUserType()"
							>
								授权用户
							</el-button>
						</div>
					</template>
				</rbac-title>
			</div>
			<el-table
				row-key="deftime"
				:data="dataList"
				style="width: 100%"
				border
				class="sxTable"
				max-height="500"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
				@selection-change="handleSelectionChange"
				ref="multipleTableRef"
			>
				<template #empty>
					<common-empty />
				</template>
				<el-table-column
					type="selection"
					width="55"
				/>
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
					prop="nickName"
					label="登录用户名"
					align="center"
				></el-table-column>
				<el-table-column
					prop="deptName"
					label="所属单位"
					align="center"
				></el-table-column>
				<el-table-column
					prop="deftime"
					label="定义时间"
					align="center"
				></el-table-column>
			</el-table>
		</div>
		<AuthUserModal
			title="角色授权用户"
			v-if="props.companyId"
			:company-id="props.companyId"
			@change-user-list="init"
			ref="AuthUserModalRef"
		/>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import _ from 'lodash'
import { Plus } from '@element-plus/icons-vue'
import { queryuserlistbygrant, grantrolelist } from 'api/rbac'
import AuthUserModal from './AuthUserModal.vue'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import type { companyIdType } from '@/types/rbac/RoleType'
import { ElMessage } from 'element-plus'

let AuthUserModalRef = ref(null)
const props = withDefaults(defineProps<companyIdType>(), {})

let dataList = ref([])
const multipleSelection = ref<any[]>([])

const addUserType = () => {
	AuthUserModalRef.value.open()
}

const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val
}

const init = () => {
	const dd_superdid = props.companyId.toString()
	const formData = { roleId: dd_superdid }
	queryuserlistbygrant(formData).then((res) => {
		dataList.value = res.data
	})
}

const clearCompanyFun = () => {
	// const formData = {
	// 	roleId: props.companyId as string,
	// 	userIdList: _.map(multipleSelection.value, 'id'),
	// 	type: 'cancel',
	// }
	console.log('formData取消授权用户')
	grantrolelist({
		roleId: props.companyId as string,
		userIdList: _.map(multipleSelection.value, 'id'),
		type: 'cancel',
	}).then((res) => {
		console.log(res.data, '清除')
		ElMessage.success(res.msg || '取消授权成功')
		changeUserList()
	})
}

const changeUserList = () => {
	init()
}
onMounted(async () => {
	await init()
})
</script>
<style lang="scss" scoped>
.saveBtn {
	float: right;
	width: 80px;
	height: 40px;
	background: #eb0000;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
}

.commonBottom {
	padding-top: 0 !important;
	border-radius: 0 0 8px 8px !important ;
}
.sxTable {
	margin-top: 10px;
}
</style>

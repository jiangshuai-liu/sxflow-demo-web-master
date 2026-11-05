<template>
	<div class="searchResult">
		<div class="searchList">
			<rbac-title title="管理员列表">
				<template #titleBtn>
					<div class="btns">
						<el-button
							type="primary"
							:icon="Plus"
							@click="clearCompanyFun()"
							v-if="multipleSelection.length"
						>
							取消指派
						</el-button>
						<el-button
							type="primary"
							:icon="Plus"
							@click="authCompanyFun()"
						>
							指派用户
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
			<!-- <el-table-column
				prop="sex"
				label="性别"
				align="center"
			>
			</el-table-column> -->
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
			<!-- <el-table-column
				prop="deftime"
				label="定义时间"
				align="center"
			></el-table-column> -->
		</el-table>
		<AuthCompanyModal
			title="指派管理员"
			v-if="props.companyId"
			:company-id="props.companyId"
			@change-company-list="changeCompanyList"
			ref="AuthCompanyModalRef"
		/>
	</div>
</template>
<script setup lang="ts">
import { companyIdType } from '@/types/rbac/organization'
import { Plus } from '@element-plus/icons-vue'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import AuthCompanyModal from './AuthCompanyModal.vue'
import { ref, watch } from 'vue'
import { queryassignuserlist, unassignadmin } from 'api/rbac'
import _ from 'lodash'
import { ElMessage } from 'element-plus'

const props = withDefaults(defineProps<companyIdType>(), {})
let dataList = ref([])
let multipleSelection = ref([])
let AuthCompanyModalRef = ref(null)

const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val
}

const clearCompanyFun = () => {
	const formData = {
		assignDeptId: props.companyId as string,
		userIdList: _.map(multipleSelection.value, 'id'),
	}
	unassignadmin(formData).then((res) => {
		console.log(res.data, '清除')
		ElMessage.success(res.msg)
		changeCompanyList()
	})
}

const changeCompanyList = () => {
	queryassignuserlist({ assignDeptId: props.companyId as string }).then((res) => {
		dataList.value = res.data
	})
}
watch(
	() => props.companyId,
	(val) => {
		if (val) {
			changeCompanyList()
		}
	},
	{
		immediate: true,
	}
)
const authCompanyFun = () => {
	AuthCompanyModalRef.value.open()
}
</script>
<style lang="scss" scoped>
.sxTable {
	margin-top: 10px;
}
</style>

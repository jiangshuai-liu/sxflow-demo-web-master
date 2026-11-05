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
								@click="authCompanyFun()"
							>
								授权单位
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
					label="单位名称"
					align="center"
				></el-table-column>
				<el-table-column
					prop="sex"
					label="单位法人码"
					align="center"
				>
				</el-table-column>
				<el-table-column
					prop="nickname"
					label="联系人"
					align="center"
				></el-table-column>
				<el-table-column
					prop="duty"
					label="联系电话"
					align="center"
				></el-table-column>
				<el-table-column
					prop="deftime"
					label="定义时间"
					align="center"
				></el-table-column>
			</el-table>
		</div>
		<AuthCompanyModal
			title="角色授权单位"
			v-if="props.companyId"
			:company-id="props.companyId"
			@change-company-list="changeCompanyList"
			ref="AuthCompanyModalRef"
		/>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElTree, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { canclegrantdeptlist, queryroledeptlist } from 'api/rbac'
import AuthCompanyModal from './AuthCompanyModal.vue'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import _ from 'lodash'
import type { companyIdType } from '@/types/rbac/RoleType'
const defaultProps = {
	children: 'children',
	label: 'label',
}
const multipleSelection = ref<any[]>([])

let AuthCompanyModalRef = ref(null)
const props = withDefaults(defineProps<companyIdType>(), {})

watch(
	() => props.companyId,
	() => {
		init()
	}
)
let dataList = ref([])

const authCompanyFun = () => {
	AuthCompanyModalRef.value.open()
}

const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val
}

const clearCompanyFun = () => {
	const formData = {
		roleId: props.companyId as string,
		deptIdList: _.map(multipleSelection.value, 'id'),
	}
	canclegrantdeptlist(formData).then((res) => {
		console.log(res.data, '清除')
		ElMessage.success(res.msg)
		changeCompanyList()
	})
}

const init = () => {
	const formData = { id: props.companyId.toString() }
	queryroledeptlist(formData).then((res) => {
		dataList.value = res.data
	})
}

const changeCompanyList = () => {
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
}

.sxTable {
	margin-top: 10px;
}
</style>

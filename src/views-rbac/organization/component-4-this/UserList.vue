<template>
	<div class="commonBottom">
		<div class="searchForm">
			<el-form
				:inline="true"
				:model="formInline"
				class="demo-form-inline"
				ref="ruleFormResetRef"
			>
				<el-form-item
					label="用户名"
					prop="yhm"
				>
					<el-input
						v-model="formInline.yhm"
						clearable
					/>
				</el-form-item>

				<el-form-item
					label="时间"
					prop="sj"
				>
					<el-date-picker
						v-model="formInline.sj"
						type="daterange"
						range-separator="-"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="YYYY-MM-DD HH:mm:ss"
					/>
				</el-form-item>
			</el-form>
			<div class="submitBtns">
				<el-button
					:icon="RefreshRight"
					@click="resetForm(ruleFormResetRef)"
				>
					重置
				</el-button>
				<el-button
					class="redBtn"
					:icon="Search"
					@click="onSearch"
				>
					查询
				</el-button>
				<!-- @click="getList(true)" -->
			</div>
		</div>
		<div class="searchResult">
			<div class="searchList">
				<rbac-title title="查询结果">
					<template #titleBtn>
						<div class="btns">
							<el-button
								type="primary"
								:icon="Plus"
								@click="addUserType('user')"
							>
								新增用户
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
				max-height="440"
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
				>
					<template #default="scope">
						<el-link
							type="primary"
							@click="authRole(scope.row, 'authrole')"
							>{{ scope.row.name }}</el-link
						>
					</template>
				</el-table-column>
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
				>
				</el-table-column>
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
				<el-table-column
					prop="num"
					label="授权角色"
					align="center"
				>
					<template #default="scope">
						<el-button
							link
							type="primary"
							size="small"
							@click="authRole(scope.row, 'authrole')"
						>
							授权角色
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script setup lang="ts">
import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import { queryuserlist } from 'api/rbac'
import { ref, reactive, onMounted } from 'vue'
import { resetForm } from '@/utils/common'
import type { companyIdType, pageTypeType, elseFormType } from '@/types/rbac/organization'
const props = withDefaults(defineProps<companyIdType>(), {})
const ruleFormResetRef = ref(null)

const formInline = reactive({
	yhm: '',
	sj: [],
})

let dataList = ref([])
const emits = defineEmits<{
	addNewOrganization: [isTop: boolean, type: pageTypeType, name: string]
	changePageType: [type: pageTypeType, elseForm?: elseFormType]
}>()

const addUserType = (type: pageTypeType) => {
	emits('addNewOrganization', false, type, '新增用户')
}

const changeList = () => {
	init()
}

const authRole = (row, tabType) => {
	// console.log(row, '授权角色')
	emits('changePageType', 'user', {
		...row,
		tabType,
		// : 'authrole'
	})
}

const onSearch = () => {
	const dd_superdid = props.companyId.toString()
	const formData = {
		deptId: dd_superdid,
		yhm: formInline.yhm,
		kssj: formInline.sj?.[0],
		jssj: formInline.sj?.[1],
	}
	queryuserlist(formData).then((res) => {
		dataList.value = res.data
	})
}

const init = () => {
	onSearch()
	// const dd_superdid = props.companyId.toString()
	// const formData = { deptId: dd_superdid }
	// queryuserlist(formData).then((res) => {
	// 	dataList.value = res.data
	// })
}

onMounted(async () => {
	await init()
})

defineExpose({
	changeList,
	init,
})
</script>
<style lang="scss" scoped>
.commonBottom {
	background: transparent;
	padding: 0;
	display: flex;
	flex-direction: column;
}

.searchForm {
	background: #ffffff;
	border-radius: 0 0 8px 8px;
	padding: 0 24px;
	box-sizing: border-box;
	.submitBtns {
		flex: 1;
		flex-shrink: 0;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		margin-bottom: 12px;
	}
}
.searchList {
	margin-bottom: 16px;
}
.searchResult {
	flex: 1;
	background: #ffffff;
	border-radius: 8px;
	padding: 16px 24px;
	margin-top: 12px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}
</style>

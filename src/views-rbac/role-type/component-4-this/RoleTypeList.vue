<template>
	<div class="RoleTypeList mainRoleManage">
		<div class="organizationHeader">
			<rbac-title :title="props.title">
				<template #titleBtn>
					<div class="btns">
						<el-button
							type="primary"
							:icon="EditPen"
							@click="editClick('roleType', '修改角色类别')"
						>
							修改
						</el-button>
						<el-button
							type="primary"
							:icon="Delete"
							@click="closeType()"
						>
							禁用
						</el-button>
						<el-button
							type="primary"
							:icon="Plus"
							@click="addUserType('roleType', '新增角色类别')"
						>
							新增角色类别
						</el-button>
					</div>
				</template>
			</rbac-title>

			<div class="searchForm">
				<el-form
					:inline="true"
					:model="formInline"
					class="demo-form-inline"
					ref="ruleFormResetRef"
				>
					<el-form-item
						label="名称"
						prop="mc"
					>
						<el-input
							v-model="formInline.mc"
							clearable
						/>
					</el-form-item>
					<el-form-item
						label="描述"
						prop="ms"
					>
						<el-input
							v-model="formInline.ms"
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
		</div>
		<div class="searchList">
			<rbac-title title="查询结果">
				<template #titleBtn>
					<div class="btns">
						<el-button
							type="primary"
							:icon="Plus"
							@click="addUserType('role', '新增角色')"
						>
							新增角色
						</el-button>
					</div>
				</template>
			</rbac-title>
			<el-table
				row-key="id"
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
					label="角色名称"
					align="center"
				></el-table-column>
				<el-table-column
					prop="desc"
					label="角色描述"
					align="center"
				></el-table-column>
				<el-table-column
					prop="deftime"
					label="定义时间"
					align="center"
				></el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script setup lang="ts">
import { Delete, EditPen, Plus, Search, RefreshRight } from '@element-plus/icons-vue'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import { resetForm } from '@/utils/common'
import { queryrolelist, updateroletypeuseful } from 'api/rbac'

import { ref, reactive, watch, onMounted } from 'vue'
import type { propsType, pageTypeType } from '@/types/rbac/RoleType'
import { ElMessage } from 'element-plus'

const props = withDefaults(defineProps<propsType>(), {})
let dataList = ref([])
const emits = defineEmits<{
	addNewOrganization: [type: pageTypeType, name: string]
	editNewOrganization: [type: pageTypeType, name: string]
	deleteCallback: []
}>()
const ruleFormResetRef = ref(null)

const formInline = reactive({
	mc: '',
	sj: [],
	ms: '',
})

const closeType = (status = '0') => {
	updateroletypeuseful({ status: status, uidList: [props.companyId as string] }).then((res) => {
		const statusName = status == '0' ? '禁用' : '启用'
		if (res.code == 1) {
			ElMessage.success(`${statusName}成功`)
			// changeCompanyForm()
			emits('deleteCallback')
		} else {
			ElMessage.error(`${statusName}失败`)
		}
	})
}
watch(
	() => props.companyId,
	(val) => {
		// console.log(val)
		init()
	},
	{
		// 初始化立即执行
		immediate: false,
		deep: true,
	}
)

const addUserType = (type: pageTypeType, name) => {
	//

	emits('addNewOrganization', type, name)
}

const editClick = (type: pageTypeType, name) => {
	emits('editNewOrganization', type, name)
}

const init = () => {
	// const dd_superdid = props.companyId.toString()
	// const formData = { rtId: dd_superdid }
	// queryrolelist(formData).then((res) => {
	// 	dataList.value = res.data
	// })
	onSearch()
}

const onSearch = () => {
	const dd_superdid = props.companyId.toString()
	const formData = { rtId: dd_superdid, mc: formInline.mc, ms: formInline.ms, kssj: formInline.sj?.[0], jssj: formInline.sj?.[1] }
	queryrolelist(formData).then((res) => {
		dataList.value = res.data
	})
}

defineExpose({
	init,
})
</script>
<style lang="scss" scoped>
.organizationHeader,
.organizationTabs,
.commonBottom {
	background: #ffffff;
	border-radius: 8px 8px 0 0;
	padding: 16px 24px 0;
	box-sizing: border-box;
}

.searchForm {
	margin-top: 10px;
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
	flex: 1;
	background: #ffffff;
	border-radius: 0 0 8px 8px;
	padding: 0 24px 16px;
	display: flex;
	flex-direction: column;
	:deep(p) {
		margin: 0;
		&::before {
			display: none;
		}
	}
}
.sxTable {
	margin-top: 10px;
	flex: 1;
}
</style>

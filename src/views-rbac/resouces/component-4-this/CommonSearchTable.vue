<template>
	<div class="commonSearchTablePage">
		<div class="organizationHeader">
			<!-- <rbac-title :title="props.title">
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
			</rbac-title> -->

			<div class="searchForm">
				<el-form
					:inline="true"
					:model="formInline"
					class="demo-form-inline"
					ref="ruleFormResetRef"
				>
					<el-form-item
						label="资源"
						prop="zymc"
					>
						<el-input
							v-model="formInline.zymc"
							clearable
						/>
					</el-form-item>

					<el-form-item
						label="时间"
						prop="zysj"
					>
						<el-date-picker
							v-model="formInline.zysj"
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
							@click="addUserType('resource', '新增资源')"
						>
							新增资源
						</el-button>
					</div>
				</template>
			</rbac-title>
			<el-table
				row-key="deftime"
				:data="dataList"
				style="width: 100%"
				border
				class="sxTable"
				max-height="610"
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
					label="资源名称"
					align="center"
				></el-table-column>
				<el-table-column
					prop="obDesc"
					label="资源描述"
					align="center"
				></el-table-column>
				<!-- <el-table-column
					prop="obAttri"
					label="资源属性"
					align="center"
				></el-table-column>
				<el-table-column
					prop="obAttri"
					label="操作名称"
					align="center"
				></el-table-column> -->
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
import type { resoucesType } from '@/types/rbac/resouces'
import { queryobjectmenu } from 'api/rbac'
import { ref, reactive, watch, onMounted } from 'vue'
import type { propsType, pageTypeType } from '@/types/rbac/RoleType'

const props = withDefaults(defineProps<Partial<propsType>>(), {
	title: '',
})
let dataList = ref([])
const emits = defineEmits<{
	addNewOrganization: [isTop: boolean, type?: resoucesType, name?: string]
	editNewOrganization: [type: resoucesType, name: string]
}>()
const ruleFormResetRef = ref(null)
const formInline = reactive({
	zymc: '',
	zysj: [],
	// workflow_id: '',
})

watch(
	() => props.companyId,
	(val) => {
		console.log(val)
		init()
	},
	{
		// 初始化立即执行
		immediate: false,
		deep: true,
	}
)

const onSearch = () => {
	// formInline
	const dd_superdid = props.companyId.toString()
	const formData = { typeId: dd_superdid, zymc: formInline.zymc, kssj: formInline.zysj?.[0], jssj: formInline.zysj?.[1] }
	queryobjectmenu(formData).then((res) => {
		dataList.value = res.data
	})
}

const addUserType = (type: resoucesType, name) => {
	//

	emits('addNewOrganization', false, type, name)
}

const editClick = (type: resoucesType, name) => {
	emits('editNewOrganization', type, name)
}

const init = () => {
	// const dd_superdid = props.companyId.toString()
	// const formData = { typeId: dd_superdid }
	// queryobjectmenu(formData).then((res) => {
	// 	dataList.value = res.data
	// })
	onSearch()
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

.commonSearchTablePage {
	flex: 1;
	display: flex;
	flex-direction: column;
}
</style>

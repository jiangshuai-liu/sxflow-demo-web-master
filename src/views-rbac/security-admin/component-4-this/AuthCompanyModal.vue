<template>
	<el-drawer
		v-model="isShow"
		direction="rtl"
		:before-close="handleClose"
		size="60%"
		modal-class="editModal"
		class="useDiyDrawer"
	>
		<template #header>
			<div class="sxDrawerTitle">{{ props.title }}</div>
		</template>
		<div class="authUserModal">
			<!-- <div class="organizationTabs">
				<el-tabs
					v-model="modalUseMode"
					class="demo-tabs"
					@tab-change="changeTab"
				>
					<el-tab-pane
						label="选择模式"
						:name="useMode.selectMode"
					></el-tab-pane>
					<el-tab-pane
						label="搜索模式"
						:name="useMode.searchMode"
					></el-tab-pane>
				</el-tabs>
			</div> -->
			<div
				class="selectMode commonMode"
				v-if="modalUseMode == useMode.selectMode"
			>
				<div class="organizationTree">
					<div class="selectHeader">组织机构</div>

					<div class="organizationSearchTree">
						<el-input
							v-model="filterText"
							placeholder="输入单位名称进行搜索"
							:prefix-icon="Search"
						/>

						<div class="includeTree">
							<el-tree
								ref="treeRef"
								style="max-width: 600px"
								class="filter-tree"
								:data="data"
								:props="defaultProps"
								default-expand-all
								:filter-node-method="filterNode"
								@node-click="handleNodeClick"
								highlight-current
							/>
							<!-- <div
								class="dataItem"
								v-for="item in data"
								:key="item.id"
								@click="getUserList(item.id)"
							>
								{{ item.name }}
							</div> -->
						</div>
					</div>
				</div>
				<div class="userList">
					<div class="selectHeader">用户</div>

					<el-table
						:data="userlist"
						style="width: 100%"
						border
						row-key="id"
						class="sxTable"
						header-cell-class-name="sxTableHeader"
						header-row-class-name="sxTableHeader"
						ref="multipleTableRef"
						@select="handleSelectionChange"
					>
						<!-- :show-header="false" -->

						<template #empty>
							<common-empty />
						</template>
						<el-table-column
							type="selection"
							width="35"
						/>
						<el-table-column
							type="index"
							width="60"
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
						<!-- <el-table-column
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
						</el-table-column> -->
						<el-table-column
							prop="id"
							label="id"
							align="center"
						>
						</el-table-column>
					</el-table>
				</div>
			</div>

			<div
				class="searchMode commonMode"
				v-else-if="modalUseMode == useMode.searchMode"
			>
				<el-input
					v-model="searchInput"
					style="width: 100%; margin-bottom: 10px"
					placeholder=""
					@change="searchToList"
				/>
				<div class="userList">
					<div class="selectHeader">用户</div>

					<el-table
						:data="searchUserList"
						style="width: 100%"
						border
						row-key="id"
						class="sxTable"
						header-cell-class-name="sxTableHeader"
						header-row-class-name="sxTableHeader"
						:show-header="false"
						ref="multipleTableRef1"
						@select="handleSelectionChange"
					>
						<template #empty>
							<common-empty />
						</template>
						<el-table-column
							type="selection"
							width="35"
						/>
						<el-table-column
							type="index"
							width="60"
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
						<!-- <el-table-column
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
						</el-table-column> -->
						<el-table-column
							prop="id"
							label="id"
							align="center"
						>
						</el-table-column>
					</el-table>
				</div>
			</div>

			<!-- <div class="useTrueTable">选中表格</div> -->
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
							color="#EBEDF0"
							@click="resetData"
							>重置</el-button
						>
						<el-button
							type="primary"
							@click="getCheckedKeys"
							>保存</el-button
						>
					</template>
				</common-footer>
			</div>
		</template>
		<sure-user
			ref="SureUserRef"
			:company-id="props.companyId"
			:dept-id="checkId"
			@close-fun="closeFun"
		></sure-user>
	</el-drawer>
</template>
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { querydepttree, queryunassignuserlist, queryuserlistsearch } from 'api/rbac'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { propsType } from '@/types/rbac/RoleType'
import _ from 'lodash'
import type { ElTree, TableInstance } from 'element-plus'
import { useMode } from '@/enums/rbacEnums'
import SureUser from './SureUser.vue'
const defaultProps = {
	children: 'children',
	label: 'name',
}
const multipleTableRef = ref<TableInstance>()
const multipleTableRef1 = ref<TableInstance>()
const multipleSelection = ref([])
interface Tree {
	[key: string]: any
}
const data = ref([])
let userlist = ref([])

let searchUserList = ref([])
let searchInput = ref('')
const filterText = ref('')
const SureUserRef = ref(null)
let modalUseMode = ref(useMode.selectMode)
const treeRef = ref<InstanceType<typeof ElTree>>()
const props = withDefaults(defineProps<Partial<propsType>>(), {
	title: '填报事项',
})
let isShow = ref(false)
let checkId = ref('')

const emits = defineEmits<{
	changeCompanyList: []
}>()

const searchToList = (value: string) => {
	// console.log(value)
	queryuserlistsearch({ roleId: props.companyId as string, name: value }).then((res) => {
		// console.log(res.data, 'data')
		searchUserList.value = res.data
		// .map((item) => ({ ...item, checked: null }))
		nextTick(() => {
			console.log(multipleSelection, 'multipleSelection')

			multipleSelection.value.length &&
				multipleSelection.value.forEach((item) => {
					multipleTableRef1.value.toggleRowSelection(item, true)
				})
		})
	})
}

const changeTab = (name) => {
	console.log(name, 'name')
	if (name == 1) {
		getUserList(data.value[0].id as string)
	} else {
		// searchUserList.value.length <= 0 &&
		searchToList(searchInput.value)
	}
}
watch(filterText, (val) => {
	treeRef.value?.filter(val)
})
const filterNode = (value: string, data: Tree) => {
	if (!value) return true
	return data.name.includes(value)
}

const handleNodeClick = (data: Tree) => {
	console.log(data, 'data')
	getUserList(data.id)
}

const handleSelectionChange = (selection: any[], row: any) => {
	console.log(multipleSelection.value, row)
	if (multipleSelection.value.length) {
		const hasRow = multipleSelection.value.some((item, index) => {
			console.log(item, row)

			if (item.id == row.id) {
				multipleSelection.value.splice(index, 1)
			}
			return item.id == row.id
		})
		console.log(hasRow, 'hasRow')

		if (!hasRow) {
			console.log(multipleSelection.value, 'before')

			multipleSelection.value.push(row)
			console.log(multipleSelection.value, 'end')
		}
	} else {
		multipleSelection.value = selection
	}
	console.log(multipleSelection.value, 'multipleSelection.value')
}

const getCheckedKeys = () => {
	console.log('点击保存')
	SureUserRef.value.open(multipleSelection.value, props.companyId)
	// grantdeptlist({ roleId: props.companyId as string, deptIdList: nums as string[] }).then((res) => {
	// 	console.log(res.data, '保存')
	// 	ElMessage.success('保存成功')
	// 	closeFun()
	// })
}
const handleClose = (done: () => void) => {
	closeDrawer()
	done()
}

const closeFun = () => {
	closeDrawer()
	emits('changeCompanyList')
}

const open = async () => {
	isShow.value = true
	const formData = {
		id: props.companyId as string,
	}

	await querydepttree(formData).then((res) => {
		data.value = res.data
	})

	await getUserList(data.value[0].id as string)
}

const getUserList = (deptId: string) => {
	checkId.value = deptId
	queryunassignuserlist({
		assignDeptId: props.companyId as string,
		deptId,
	}).then((res) => {
		userlist.value = res.data
		nextTick(() => {
			multipleSelection.value.length &&
				multipleSelection.value.forEach((item) => {
					multipleTableRef.value.toggleRowSelection(item, true)
				})
		})
	})
}

const resetData = () => {
	multipleSelection.value = []
	multipleTableRef.value?.clearSelection()
	multipleTableRef1.value?.clearSelection()
}

const closeDrawer = () => {
	resetData()
	isShow.value = false
	data.value = []
	filterText.value = ''
}

defineExpose({
	open,
})
</script>
<style lang="scss" scoped>
.treeBox {
	display: flex;
	flex-direction: column;
	margin-top: 10px;
	border-radius: 4px 4px 4px 4px;
	border: 1px solid #e4e7ed;
	flex: 1;
}

.includeTree {
	flex: 1;
	padding: 10px;
	box-sizing: border-box;
	overflow: auto;
}
.treeTitle {
	height: 48px;
	background: #f5f7fa;
	border-bottom: 1px solid #e4e7ed;
	display: flex;
	align-items: center;
	font-family: PingFang SC, PingFang SC;
	font-weight: 500;
	font-size: 16px;
	color: #606266;
	padding-left: 10px;
	box-sizing: border-box;
}

:deep(.el-tree-node__content) {
	height: 44px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.authUserModal {
	height: 100%;
	display: flex;
	flex-direction: column;

	// .commonMode {
	// 	height: 50%;
	// }
}

.useTrueTable {
	height: 35%;
	flex-shrink: 0;
}
.selectMode {
	display: flex;
	justify-content: space-between;
	border: 1px solid #e4e7ed;
	flex: 1;
	overflow: hidden;
	.organizationTree {
		width: 240px;
		flex-shrink: 0;
		border-right: 1px solid #e4e7ed;
		display: flex;
		flex-direction: column;
	}
	.organizationSearchTree {
		padding: 16px;
		box-sizing: border-box;
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		::-webkit-scrollbar {
			width: 4px;
		}
	}
}
.userList {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.selectHeader {
	height: 48px;
	flex-shrink: 0;
	background: #f5f7fa;
	border-bottom: 1px solid #e4e7ed;
	font-family: PingFang SC, PingFang SC;
	font-weight: 500;
	font-size: 16px;
	color: #606266;
	padding-left: 10px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
}
.organizationTabs {
	margin-top: 0;
	padding-top: 0;
	padding-left: 0;
	height: auto;
}

:deep(.el-table__header-wrapper .el-table-column--selection .el-checkbox) {
	display: none;
}
</style>

<template>
	<el-drawer
		v-model="isShow"
		direction="rtl"
		:before-close="handleClose"
		size="60%"
		modal-class="editModal"
	>
		<template #header>
			<div class="sxDrawerTitle">{{ props.title }}</div>
		</template>

		<el-input
			v-model="filterText"
			placeholder="输入单位名称进行搜索"
			:prefix-icon="Search"
		/>
		<div class="treeBox">
			<div class="treeTitle">单位</div>
			<div class="includeTree">
				<el-tree
					:data="data"
					show-checkbox
					node-key="id"
					:props="defaultProps"
					check-strictly
					:filter-node-method="filterNode"
					ref="treeRef"
				>
					<!-- :default-checked-keys="defaultCheckedKeys" -->
				</el-tree>
			</div>
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
							@click="resetTree"
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
	</el-drawer>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { queryroledepttree, grantdeptlist, queryroledeptlist } from 'api/rbac'
import { ElMessage, ElTree } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { propsType } from '@/types/rbac/RoleType'
import _ from 'lodash'
const defaultProps = {
	children: 'children',
	label: 'name',
	disabled: 'disabled',
}

let defaultCheckedKeys = ref([])

interface Tree {
	[key: string]: any
}
const treeRef = ref<InstanceType<typeof ElTree>>()
const data = ref([])
const filterText = ref('')

let baseSelectTree = ref([])

const props = withDefaults(defineProps<Partial<propsType>>(), {
	title: '填报事项',
})
let isShow = ref(false)

const emits = defineEmits<{
	changeCompanyList: []
}>()

watch(filterText, (val) => {
	treeRef.value?.filter(val)
})

const filterNode = (value: string, data: Tree) => {
	if (!value) return true
	return data.name.includes(value)
}
const getCheckedKeys = () => {
	const nums = treeRef.value.getCheckedKeys(false)

	grantdeptlist({ roleId: props.companyId as string, deptIdList: nums as string[] }).then((res) => {
		console.log(res.data, '保存')
		ElMessage.success('保存成功')
		closeFun()
	})
}
const handleClose = (done: () => void) => {
	closeDrawer()
	done()
}

const closeFun = () => {
	closeDrawer()
	emits('changeCompanyList')
}

//递归

const changeDataFun = (useData) => {
	const returnData = useData.map((element) => {
		// debugger
		if (element.children) {
			if (element.checked) {
				element.disabled = true
			}
			const centerReturn = changeDataFun(element.children)
			return { ...element, children: centerReturn }
		} else {
			if (element.checked) {
				element.disabled = true
			}
			return element
		}
	})

	return returnData
}

const open = () => {
	isShow.value = true
	const formData = {
		id: props.companyId as string,
	}
	queryroledepttree(formData).then((res) => {
		data.value = changeDataFun(res.data)
	})

	queryroledeptlist(formData).then((res) => {
		const treeValues = _.map(res.data, 'id')

		baseSelectTree.value = treeValues
		treeRef.value.setCheckedKeys(treeValues)
		treeValues.forEach((item) => {
			treeRef.value.setCurrentKey(item, true)
		})
	})
}

const resetTree = async () => {
	await treeRef.value.setCheckedKeys([], false)
	await treeRef.value.setCheckedKeys(baseSelectTree.value, true)
}

const closeDrawer = () => {
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
}

.includeTree {
	flex: 1;
	padding: 10px;
	box-sizing: border-box;
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
</style>

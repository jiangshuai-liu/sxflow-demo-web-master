<template>
	<div class="commonBottom">
		<!-- {{ selectTreeList }} -->
		<!-- {{ otherTree }} -->
		<!-- 授权角色 -->
		<div class="authUserPage">
			<el-tree
				:data="data"
				show-checkbox
				node-key="id"
				check-strictly
				:default-expanded-keys="parentList"
				:default-checked-keys="selectTreeList"
				:props="defaultProps"
				@check-change="otherTreeChange"
				ref="treeRef"
			>
				<template #default="{ data }">
					<span>
						<span
							:class="{
								comImgIco: true,
								nochildJsDw: !data?.isType,
								haschildJsDw: data?.isType,
							}"
						></span>
						<span class="name">
							{{ data.name }}
						</span>
					</span>
				</template>
			</el-tree>
		</div>

		<div class="btns">
			<el-button
				type="primary"
				@click="getCheckedKeys()"
			>
				保存
			</el-button>
			<el-button @click="reset()"> 重置 </el-button>
		</div>
	</div>
</template>
<script setup lang="ts">
import useTools from 'use-tools-before'
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElTree } from 'element-plus'
import { queryroledepttree, grantroles, querydeptrolelist } from 'api/rbac'
import { otherTreeFun } from '@/utils/RbacFuns'
import type { companyIdType } from '@/types/rbac/organization'
const props = withDefaults(defineProps<companyIdType>(), {})
const defaultProps = {
	children: 'children',
	label: 'name',
}

let otherTree
let parentList = ref([])
let selectTreeList = ref([])

let saveParentList = ref([])
let saveselectTreeList = ref([])

const treeRef = ref<InstanceType<typeof ElTree>>()
const data = ref([])
let checkedList = ref([])

const getCheckedKeys = () => {
	const nums = treeRef.value.getCheckedKeys(false)
	console.log(nums)
	grantroles({ deptId: props.companyId as string, roleIdList: nums as string[] }).then((res) => {
		// console.log(res.data, 'res.data')
		if (res.code == 1) {
			ElMessage.success('保存成功')
		}
	})
}

const reset = () => {
	parentList.value = saveParentList.value
	selectTreeList.value = saveselectTreeList.value
	treeRef.value?.setCheckedKeys(saveselectTreeList.value, false)
}

const init = async () => {
	await clearData()
	await querydeptrolelist({ id: props.companyId as string }).then((res) => {
		// console.log(res.data, 'res.data')
		data.value = res.data
		checkedList.value = useTools.flattenTreeData(data.value).filter((item: any) => item.checked)
		let curParentList = [] //展开所有选中的父节点
		let curselectTreeList = checkedList.value.map((item) => {
			// console.log(item, 'item')
			if (!curParentList.includes(item.parentId)) {
				curParentList.push(item.parentId)
			}
			return item.id
		})

		parentList.value = curParentList
		selectTreeList.value = curselectTreeList
		saveParentList.value = curParentList
		saveselectTreeList.value = curselectTreeList
	})
}

const clearData = () => {
	parentList.value = []
	selectTreeList.value = []
	saveParentList.value = []
	saveselectTreeList.value = []
	data.value = []
}

const otherTreeChange = (data, checked) => {
	return otherTree && otherTree(data, checked)
}

onMounted(async () => {
	await init()
	otherTree = otherTreeFun(treeRef, selectTreeList)
})

onUnmounted(() => {
	console.log('onUnmounted')

	clearData()
})
defineExpose({
	init,
})
</script>
<style lang="scss" scoped>
.btns {
	margin: 0 auto;
}
.authUserPage {
	flex: 1;
	overflow: auto;
	// &::-webkit-scrollbar {
	// 	width: 6px;
	// }
}
// .el-tree {
// }

:deep(.el-tree-node__content) {
	height: 44px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.nochildJsDw {
	background-image: url(../../../assets/index/ico_js.png);
}

.haschildJsDw {
	background-image: url(../../../assets/index/ico_jslb.png);
}
</style>

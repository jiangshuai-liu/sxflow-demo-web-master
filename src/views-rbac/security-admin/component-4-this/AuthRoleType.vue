<template>
	<div class="commonBottom">
		<!-- 授权角色类别 -->
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
			<!-- 	highlight-current -->
			<!-- nochildJsDw: !data?.isType,
							haschildJsDw: data?.isType, -->
			<template #default="{ data }">
				<span>
					<span
						:class="{
							comImgIco: true,
							haschildJsDw: true,
						}"
					></span>
					<span class="name">
						{{ data.name }}
					</span>
				</span>
			</template>
		</el-tree>

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
import { ref, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { ElMessage, ElTree } from 'element-plus'
import { queryadminroletypetree, admingrantroletype } from 'api/rbac'
import type { companyIdType } from '@/types/rbac/RoleType'
import useTools from 'use-tools-before'
import { otherTreeFun } from '@/utils/RbacFuns'
const defaultProps = {
	children: 'children',
	label: 'name',
}
const props = withDefaults(defineProps<companyIdType>(), {})
watch(
	() => props.companyId,
	() => {
		init()
	}
)
let otherTree
let parentList = ref([])
let selectTreeList = ref([])
let saveParentList = ref([])
let saveSelectTreeList = ref([])

// let checkId = ref(null)

const treeRef = ref<InstanceType<typeof ElTree>>()
const data = ref([])

const init = async () => {
	await clearData()
	await queryadminroletypetree({ deptId: props.companyId as string }).then((res) => {
		console.log(res.data, 'res.data')
		data.value = res.data

		const commonData = useTools.flattenTreeData(res.data).filter((item: any) => item.checked)

		let curParentList = [] //展开所有选中的父节点
		let curSelectTreeList = commonData.map((item) => {
			// console.log(item, 'item')
			if (!curParentList.includes(item.parentId)) {
				curParentList.push(item.parentId)
			}
			return item.id
		})

		// console.log(curParentList, 'curParentList')

		parentList.value = curParentList
		selectTreeList.value = curSelectTreeList
		saveParentList.value = curParentList
		saveSelectTreeList.value = curSelectTreeList
	})
}
const getCheckedKeys = () => {
	const nums = treeRef.value.getCheckedKeys(false) as string[]
	// console.log(nums)

	admingrantroletype({
		roleTypeList: nums,
		deptId: props.companyId as string,
	}).then((res) => {
		// console.log(res, 'res')
		if (res.code == 1) {
			ElMessage.success('授权成功')
		}
	})
}
const clearData = () => {
	parentList.value = []
	selectTreeList.value = []
	saveParentList.value = []
	saveSelectTreeList.value = []
	data.value = []
}
const reset = () => {
	parentList.value = saveParentList.value
	selectTreeList.value = saveSelectTreeList.value
	treeRef.value?.setCheckedKeys(saveSelectTreeList.value, false)
}

const otherTreeChange = (data, checked) => {
	return otherTree && otherTree(data, checked)
}

onMounted(async () => {
	await init()

	otherTree = otherTreeFun(treeRef, selectTreeList)
	console.log(otherTree)
})

onUnmounted(() => {
	console.log('onUnmounted')
	clearData()
})
</script>
<style lang="scss" scoped>
.el-tree {
	flex: 1;
}

.btns {
	// margin: 0 auto;
	display: flex;
	justify-content: center;
	flex-shrink: 0;
}
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

:deep(.el-tree-node__content) {
	height: 44px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.commonBottom {
	padding-top: 0;
	// overflow: auto;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.el-tree {
	overflow: auto;

	// &::-webkit-scrollbar {
	// 	width: 6px;
	// }
}

.nochildJsDw {
	background-image: url(../../../assets/index/ico_js.png);
}

.haschildJsDw {
	background-image: url(../../../assets/index/ico_jslb.png);
}
</style>

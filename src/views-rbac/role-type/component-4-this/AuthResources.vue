<template>
	<div class="commonBottom">
		<!-- {{ otherTree }} -->
		<!-- {{ selectTreeList }} -->
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
							nochildZy: !data?.isType,
							haschildZy: data?.isType,
						}"
					></span>
					<span class="name">
						{{ data.name }}
					</span>
				</span>
			</template>
			<!-- 	highlight-current -->
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
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElTree } from 'element-plus'
import { queryobjecttree, grantobjects } from 'api/rbac'
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
let saveselectTreeList = ref([])
const treeRef = ref<InstanceType<typeof ElTree>>()
const data = ref([])

const init = () => {
	clearData()
	queryobjecttree({ id: props.companyId as string }).then((res) => {
		// console.log(res.data, 'res.data')
		data.value = res.data

		const commonData = useTools.flattenTreeData(res.data).filter((item: any) => item.checked)

		let curParentList = [] //展开所有选中的父节点
		let curselectTreeList = commonData.map((item) => {
			// console.log(item, 'item')
			if (!curParentList.includes(item.parentId)) {
				curParentList.push(item.parentId)
			}
			return item.id
		})

		// console.log(curParentList, 'curParentList')

		parentList.value = curParentList
		selectTreeList.value = curselectTreeList
		saveParentList.value = curParentList
		saveselectTreeList.value = curselectTreeList
	})
}
const getCheckedKeys = () => {
	const nums = treeRef.value.getCheckedKeys(false) as string[]
	grantobjects({
		objectIdList: nums,
		roleId: props.companyId as string,
	}).then((res) => {
		console.log(res, 'res')
		if (res.code == 1) {
			ElMessage.success('授权成功')
		}
	})
}

const reset = () => {
	parentList.value = saveParentList.value
	selectTreeList.value = saveselectTreeList.value
	treeRef.value?.setCheckedKeys(saveselectTreeList.value, false)
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
	// otherTree = otherTreeFun(treeRef, selectTreeList, false)
	otherTree = otherTreeFun(treeRef, selectTreeList)
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

.nochildZy {
	background-image: url(../../../assets/index/ico_zy.png);
}

.haschildZy {
	background-image: url(../../../assets/index/ico_zylb.png);
}
</style>

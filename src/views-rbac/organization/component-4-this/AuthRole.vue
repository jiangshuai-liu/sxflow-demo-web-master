<template>
	<div class="commonBottom">
		<!-- 用户授权角色 -->
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
		<div class="changeBtns">
			<el-button
				type="primary"
				@click="getCheckedKeys"
			>
				保存
			</el-button>
			<el-button
				type="primary"
				@click="reset"
			>
				重置
			</el-button>
			<!-- <el-button
				type="primary"
				@click="emits('goBack')"
			>
				返回
			</el-button> -->
		</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import useTools from 'use-tools-before'
import { ElMessage, ElTree } from 'element-plus'
import { otherTreeFun } from '@/utils/RbacFuns'
import { queryuserrolelist, grantuserroles } from 'api/rbac'
import type { propsTypePickDoubleInfo } from '@/types/rbac/organization'
const props = withDefaults(defineProps<propsTypePickDoubleInfo>(), {})
const defaultProps = {
	children: 'children',
	label: 'name',
}

let otherTree
const emits = defineEmits<{
	goBack: []
}>()

let parentList = ref([])
let selectTreeList = ref([])
let saveParentList = ref([])
let saveselectTreeList = ref([])
const treeRef = ref<InstanceType<typeof ElTree>>()
const data = ref([])

const init = async () => {
	await clearData()
	await queryuserrolelist({ id: props.companyId as string, uid: props.userUseForm.id }).then((res) => {
		// console.log(res.data, 'res.data')
		data.value = res.data
		const checkedList = useTools.flattenTreeData(data.value).filter((item: any) => item.checked)
		console.log(checkedList, 'checkedList')

		let curParentList = [] //展开所有选中的父节点
		let curselectTreeList = checkedList.map((item) => {
			// console.log(item, 'item')
			if (!curParentList.includes(item.parentId)) {
				curParentList.push(item.parentId)
			}
			return item.id
		})

		console.log(curParentList, 'curParentList')

		parentList.value = curParentList
		selectTreeList.value = curselectTreeList
		saveParentList.value = curParentList
		saveselectTreeList.value = curselectTreeList
	})
}

const getCheckedKeys = () => {
	const nums = treeRef.value.getCheckedKeys(false) as string[]
	console.log(nums)

	grantuserroles({
		roleIdList: nums,
		userId: props.userUseForm.id,
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
	otherTree = otherTreeFun(treeRef, selectTreeList)
})

onUnmounted(() => {
	console.log('onUnmounted')

	clearData()
})
</script>
<style lang="scss" scoped>
.changeBtns {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
}
.saveBtn {
	// float: right;
	width: 80px;
	height: 40px;
	background: #eb0000;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
	flex-shrink: 0;
}

.el-tree {
	flex: 1;
	overflow: auto;
	// &::-webkit-scrollbar {
	// 	width: 6px;
	// }
}
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

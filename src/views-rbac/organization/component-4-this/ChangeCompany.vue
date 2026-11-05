<template>
	<div class="commonBottom">
		<!-- 更改单位 -->
		<el-tree
			:data="data"
			node-key="id"
			check-strictly
			:props="defaultProps"
			highlight-current
			ref="treeRef"
		>
			<template #default="{ data }">
				<span>
					<span
						:class="{
							comImgIco: true,
							nochild: !data?.isType,
							haschild: data?.isType,
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
			<el-button type="primary"> 重置 </el-button>
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
import { ref } from 'vue'
import useTools from 'use-tools-before'
import { ElMessage, ElTree } from 'element-plus'
import { queryuserdeptlist, updateuserdept } from 'api/rbac'
import type { propsTypePickDoubleInfo } from '@/types/rbac/organization'
const props = withDefaults(defineProps<propsTypePickDoubleInfo>(), {})
const defaultProps = {
	children: 'children',
	label: 'name',
}

const emits = defineEmits<{
	goBack: []
}>()
const treeRef = ref<InstanceType<typeof ElTree>>()
const data = ref([])

const getCheckedKeys = () => {
	const nums = treeRef.value.getCurrentKey()
	console.log(nums)
	updateuserdept({ did: nums, uid: props.userUseForm.id as string }).then((res) => {
		console.log(res)
		if (res.code == 1) {
			ElMessage.success('修改成功')
		}
	})
}
const init = () => {
	queryuserdeptlist({ id: props.userUseForm.id as string }).then((res) => {
		// console.log(res.data, 'res.data')
		data.value = res.data
		const checkedList = useTools.flattenTreeData(data.value).filter((item: any) => item.checked)
		if (checkedList.length) {
			treeRef.value.setCurrentKey(checkedList[0].id, true)
		}
	})
}
init()
</script>
<style lang="scss" scoped>
.changeBtns {
	display: flex;
	justify-content: center;
	align-items: center;
}

:deep(.el-tree-node__content) {
	height: 44px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.el-tree {
	flex: 1;
	overflow: auto;
	// &::-webkit-scrollbar {
	// 	width: 6px;
	// }
}

.commonBottom {
	overflow: hidden;
}
</style>

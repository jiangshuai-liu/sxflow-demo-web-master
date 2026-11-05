<template>
	<div class="rbacFilterTree">
		<el-input
			v-model="filterText"
			:prefix-icon="Search"
			class="searchInput"
		/>
		<div class="useTreeEle">
			<t-pr-tree
				:data="data"
				:initFun="init"
				ref="RbacTreeRef"
				:defaultProps="props?.defaultProps || {}"
				:filter-node-method="filterNode"
				:clickFun="clickFun"
				:highlight-current="props?.highlightCurrent"
			>
				<template #default="{ data }">
					<slot
						name="treeSlot"
						:data="data"
						:RbacTreeRef="RbacTreeRef"
					></slot>
				</template>
			</t-pr-tree>
		</div>
	</div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { Ref, ref, watch } from 'vue'
const filterText = ref('')
let data = ref([])

interface defaultPropsType {
	label: string
	children: string
	disabled: string
	isLeaf: string
	class: string
}

type propsType = { defaultProps: Partial<defaultPropsType>; highlightCurrent: boolean }
// 提供所有必需的默认值
const props = withDefaults(defineProps<Partial<propsType>>(), {})
const emits = defineEmits<{
	clickFunCallback: [clickItem: any, data: Ref]
	initUseFun: [data: Ref]
}>()

let RbacTreeRef = ref(null)
watch(filterText, (val) => {
	getComponentRef()!.filter(val)
})

const init = () => {
	emits('initUseFun', data)
}

const filterNode = (value: string, data: any) => {
	if (!value) return true
	return data.name.includes(value)
}

const clickFun = (clickItem) => {
	emits('clickFunCallback', clickItem, data)
}

const getSelfTree = () => {
	return RbacTreeRef.value
}

const getComponentRef = () => {
	// console.log(getSelfTree())

	return getSelfTree()
	//!.getComponetRef()
}

const updateData = (isSave: boolean, callback?: (data: Ref, otherData?: any) => void | null, otherData: any = {}) => {
	isSave && getSelfTree().saveNodeStates()
	callback && callback(data, otherData)
}

const getData = (): Readonly<any> => {
	return data.value
}

defineExpose({
	updateData,
	getComponentRef,
	getSelfTree,
	getData,
})
</script>
<style lang="scss" scoped>
.name {
	font-weight: 500;
	font-size: 14px;
	color: #303133;
}

.rbacFilterTree {
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.useTreeEle {
		flex: 1;
		overflow-y: auto;
		// &::-webkit-scrollbar {
		// 	width: 0px;
		// }
	}
}

:deep(.el-tree-node__content:has(.selectTree)) {
	background: #e1e5f7;
	border-radius: 4px;

	.name {
		color: #3d66d6;
	}
}

:deep(.el-tree-node__content) {
	height: 44px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.searchInput {
	margin-bottom: 16px;
	flex-shrink: 0;
}
</style>

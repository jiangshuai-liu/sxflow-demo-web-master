<template>
	<div class="LeftSlider">
		<div class="LeftSliderTitle">
			<span>{{ props.title }}</span>
			<div
				class="addIco"
				v-if="props.isAdd"
				@click="emits('AddModal', true)"
			></div>
		</div>
		<RbacFilterTree
			ref="RbacFilterTreeRef"
			:="attrs"
		>
			<template #treeSlot="{ data, RbacTreeRef }">
				<slot
					:data="data"
					:RbacTreeRef="RbacTreeRef"
				></slot>
			</template>
		</RbacFilterTree>
	</div>
</template>
<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import RbacFilterTree from './RbacFilterTree.vue'
const RbacFilterTreeRef = ref<InstanceType<typeof RbacFilterTree>>()

const getRbacFilterTreeRef = (): InstanceType<typeof RbacFilterTree> => {
	return RbacFilterTreeRef.value
}

interface propsType {
	title: string
	isAdd: boolean
}
const props = withDefaults(defineProps<Partial<propsType>>(), {
	isAdd: false,
})

const attrs = useAttrs()

const emits = defineEmits<{
	AddModal: [isTop?: boolean]
}>()

defineExpose({
	getRbacFilterTreeRef,
})
</script>
<style lang="scss" scope>
.LeftSlider {
	width: 240px;
	height: 100%;
	display: flex;
	flex-direction: column;
	background: #ffffff;
	border-radius: 8px;
	padding: 16px;
	box-sizing: border-box;
	flex-shrink: 0;
}

.LeftSliderTitle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;

	span {
		font-family: Microsoft YaHei UI, Microsoft YaHei UI;
		font-weight: bold;
		font-size: 16px;
		color: #303133;
	}
	.addIco {
		background-image: url(../../assets/index/addIcoBla.png);
		width: 24px;
		height: 24px;
		margin-right: 5px;
		background-size: 24px 24px;
	}
}
</style>

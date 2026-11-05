<template>
	<div class="SxTitle">
		<p>{{ props.title }}</p>
		<slot name="titleBtn"></slot>
	</div>
</template>
<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: '',
	},
})
</script>
<style lang="scss" scoped>
.SxTitle {
	width: 100%;
	display: flex;
	justify-content: space-between;
}

p {
	height: 28px;
	font-family: Microsoft YaHei UI, Microsoft YaHei UI;
	font-weight: 400;
	font-size: 16px;
	color: #303133;
	line-height: 28px;
	// margin-left: 21px;
	position: relative;
	// &:after {
	// 	content: '';
	// 	position: absolute;
	// 	width: 5px;
	// 	height: 27px;
	// 	background: linear-gradient(180deg, #dc0a0a 0%, #f27333 100%), linear-gradient(180deg, #e53c3c 0%, #f86a6a 100%);
	// 	box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.08), 0px 12px 32px 4px rgba(0, 0, 0, 0.04);
	// 	border-radius: 8px 8px 8px 8px;
	// 	left: -21px;
	// }
}
</style>

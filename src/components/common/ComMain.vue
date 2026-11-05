<template>
	<div class="ThingsListMain">
		<div class="comMainBox">
			<slot></slot>
		</div>
	</div>
</template>
<script setup lang="ts">
import ComNav from './ComNav.vue'
const props = defineProps({
	title: {
		type: String,
		default: '标题',
	},
	noTree: {
		type: Boolean,
		default: false,
	},
})
</script>
<style lang="scss" scoped>
.ThingsListMain {
	flex: 1;
	overflow: hidden;
	background: #f9fafc;
	display: flex;
	flex-direction: column;

	.tableMain {
		flex: 1;
		padding: 16px;
		box-sizing: border-box;
	}
	.comMainBox {
		flex: 1;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}
}
</style>

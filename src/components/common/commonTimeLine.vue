<template>
	<el-timeline style="max-width: 600px">
		<template v-if="props.tableData.length > 0">
			<template
				v-for="(item, index) in props.tableData"
				:key="index"
			>
				<el-timeline-item :timestamp="item['participant_info']['participant_alias']">
					{{ returnVal(item) }}
				</el-timeline-item>
			</template>
		</template>
		<template v-else>
			<el-timeline-item timestamp="当前暂无操作"> 暂无数据 </el-timeline-item>
		</template>
	</el-timeline>
</template>
<script setup lang="ts">
let props = defineProps({
	tableData: {
		type: Array<any>,
		default: () => {
			return []
		},
	},
})

const returnVal = (item) => {
	return `于${item.gmt_created} 在"${item.state.state_name}"状态下，执行了"${item.transition.transition_name}"`
}
</script>
<style lang="scss" scoped></style>

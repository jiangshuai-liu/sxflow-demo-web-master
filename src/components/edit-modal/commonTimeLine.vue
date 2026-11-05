<template>
	<el-timeline>
		<template v-if="steps.length > 0">
			<template
				v-for="(item, index) in steps"
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
import { queryflowlogs } from 'api/useCommon'
import { ref } from 'vue'
const props = defineProps({
	id: Number,
})
const steps = ref([])
const currentState = ref('')
const active = ref(0)
// let props = defineProps({
// 	tableData: {
// 		type: Array<any>,
// 		default: () => {
// 			return []
// 		},
// 	},
// })
queryflowlogs({ id: props.id }).then((res) => {
	console.log(res.data.value)

	let data = res.data.value
	currentState.value = res.data.current_state_id
	steps.value = data.map((item) => {
		let description = ''
		let status = 'wait'
		if (item.state_flow_log_list?.[0]) {
			const user = item.state_flow_log_list[0].participant_info.participant_alias
			description = `${user} ${item.state_flow_log_list[0].transition.transition_name} @ ${item.state_flow_log_list[0].gmt_created}`
			status = 'finish'
		} else {
			status = 'wait'
		}
		if (item.state_id === currentState.value) {
			status = 'process'
		}
		return {
			...item,
			status,
			description,
		}
	})
	console.log(steps.value)
})
const returnVal = (item) => {
	return `于${item.gmt_created} 在"${item.state.state_name}"状态下，执行了"${item.transition.transition_name}"`
}

// let tableData = props.tableData.map(item => {
//     return {
//       ...item,
//       timestamp: `于${item.gmt_created} 在"${item.state.state_name}"状态下，执行了"${item.transition.transition_name}"，意见：${item.suggestion}`
//     };
//   });
</script>
<style lang="scss" scoped></style>

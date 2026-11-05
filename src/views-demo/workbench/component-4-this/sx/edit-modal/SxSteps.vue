<template>
	<div class="sxsteps">
		<el-steps
			:active="active"
			finish-status="success"
			direction="vertical"
		>
			<el-step
				v-for="item in steps"
				:key="item.state_id"
				:status="item.status"
			>
				<template #title>
					<el-tooltip
						class="box-item"
						effect="dark"
						:content="item.state_name"
						placement="top"
					>
						<p>{{ item.state_name }}</p>
					</el-tooltip>
				</template>
				<template #description>
					<el-tooltip
						class="box-item"
						effect="dark"
						:content="item.description"
						placement="top"
					>
						<p>{{ item.description }}</p>
					</el-tooltip>
				</template>
			</el-step>
		</el-steps>
	</div>
</template>
<script setup lang="ts">
import { querysxsteps } from 'api/diy-api/index'
import { ref, onMounted } from 'vue'
const props = defineProps({
	id: Number,
})
const steps = ref([])
const currentState = ref('')
const active = ref(0)

const init = () => {
	console.log(props.id, 'props.id')
	querysxsteps({ id: props.id }).then((res) => {
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
}

onMounted(() => {
	init()
})
</script>
<style lang="scss" scoped>
.antdsteps {
	width: 100%;
	overflow: hidden;
	overflow-x: scroll;
	.ant-steps {
		width: auto;
		min-width: 100%;
		justify-content: flex-start;
	}
	.ant-steps-item {
		flex-shrink: 0 !important;
		overflow: visible;
	}
	:deep(.ant-steps-item-container) {
		width: auto;

		.ant-steps-item-title::after {
			width: 0px;
		}
	}
}
</style>

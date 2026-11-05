<template>
	<div class="aiKeywordsCover">
		<!-- 要素提取 -->
		<div class="leftUploadSlider">
			<p class="keywordsTitle">要素提取</p>
			<div class="fileCover">
				<p>事件内容</p>
				<el-input
					v-model="textarea"
					placeholder="请输入您的问题"
					type="textarea"
					:autosize="{ minRows: 6, maxRows: 30 }"
				/>
				<!-- show-word-limit -->
			</div>
			<div class="btns">
				<el-button
					type="info"
					@click="onClear"
				>
					清空
				</el-button>
				<el-button
					type="primary"
					@click="onSubmit"
				>
					运行
				</el-button>
			</div>
		</div>
		<ai-keywords
			class="aiChat"
			ref="aiKeywordsRef"
		/>
	</div>
</template>
<script setup lang="ts">
import aiKeywords from 'coms/ai-keywords/index.vue'
import { ref } from 'vue'
let textarea = ref('')
let aiKeywordsRef = ref(null)

const onSubmit = async () => {
	const promat =
		'请您参考以下示例,并严格按照 JSON 格式输出相关信息,工单类型需要从"诉求"或"咨询"中选择。例如：{"问题分类":"","标题":"","地点":"","时间":"","来电人":"","来电人电话":"","来电人情绪":"","来电人诉求":"","关键词":"","工单类型":"","事件影响":"","被投诉主体":""}'
	await aiKeywordsRef.value.clickClear()
	await aiKeywordsRef.value.onSubmitExpose(textarea.value + promat)
}

const onClear = () => {
	textarea.value = ''
	aiKeywordsRef.value.clickClear()
}
</script>
<style lang="scss" scoped>
.aiKeywordsCover {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
}

.leftUploadSlider {
	width: 390px;
	margin-right: 10px;
	height: 100%;
	background: #ffffff;
	padding: 16px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}
.aiChat {
	flex: 1;
}
.dailogCover {
	padding: 0;
}

.btns {
	display: flex;
	justify-content: space-between;
	margin-top: 20px;
}

.keywordsTitle {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
}
</style>

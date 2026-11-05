<template>
	<div class="aiChatCover">
		<ai-chat />
	</div>
</template>
<script setup lang="ts">
import aiChat from 'coms/ai-chat/index.vue'
</script>
<style lang="scss" scoped>
.aiChatCover {
	width: 100%;
	height: 100%;
}

.dailogCover {
	padding: 0;
}

:deep(.el-collapse) {
	width: 100%;
	max-width: 100% !important;
}
</style>

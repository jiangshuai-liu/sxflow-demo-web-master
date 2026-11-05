<template>
	<el-pagination
		v-model:current-page="paginationObj.currentPage"
		v-model:page-size="paginationObj.pageSize"
		:page-sizes="[10, 20, 50, 100]"
		:background="paginationObj.background"
		layout="total,prev,pager,next,jumper,sizes "
		:total="paginationObj.total"
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
	/>
</template>
<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
const emits = defineEmits(['getPaList'])
let paginationObj = reactive({
	currentPage: 1,
	pageSize: 10,
	background: true,
	total: 0,
})

const handleSizeChange = (val: number) => {
	console.log(`${val} items per page`)
	paginationObj.pageSize = val
	emits('getPaList')
}
const handleCurrentChange = (val: number) => {
	console.log(`current page: ${val}`)
	paginationObj.currentPage = val
	emits('getPaList')
}

const setPagitionObj = (obj: object) => {
	const key = Object.keys(obj)
	key.forEach((item) => {
		paginationObj[item] = obj[item]
	})
	console.log('setPagitionObj')
}

const returnPaginationObj = () => {
	return paginationObj
}

defineExpose({
	setPagitionObj,
	returnPaginationObj,
})
</script>
<style lang="scss" scoped>
.el-pagination {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;

	:deep(.el-pager li.is-active) {
		background: #feecec;
		color: #eb423f;
	}
}
</style>

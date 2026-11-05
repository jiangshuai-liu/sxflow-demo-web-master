<template>
	<el-upload
		v-model:file-list="useFile"
		:http-request="commonUploaduse"
		:class="{ hide_box: useFile.length > 0, 'upload-demo': true }"
		action="/"
		:on-remove="handleRemove"
		:on-exceed="handleExceed"
		:before-upload="beforeUpload"
	>
		<el-button
			v-my-global-directive
			type="primary"
		>
			<!-- <i></i> -->

			{{ title }}</el-button
		>
	</el-upload>
</template>
<script setup lang="ts">
import { reactive, ref, toRefs, PropType } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type {
	UploadUserFile,
	UploadRequestHandler,
	UploadFile,
	UploadFiles,
	// File,
} from 'element-plus'
import { clearBtnDisabled } from '@/utils/index'
import { fileImport } from '@/api/dataset-api'

let loading
const props = defineProps({
	useFile: Array as PropType<UploadUserFile[]>,
	id: {
		required: true,
		type: Number || String,
	},
	title: {
		required: false,
		type: String,
		default: '导入',
	},
})

let { useFile, id, title } = toRefs(props)
const emits = defineEmits(['update:useFile'])

//上传
const commonUploaduse: UploadRequestHandler = async (param) => {
	loading = ElLoading.service({
		lock: true,
		text: 'Loading',
		background: 'rgba(0, 0, 0, 0.7)',
	})
	let fileObj = param.file
	let formData = new FormData()
	formData.append('file', fileObj)
	formData.append('datasetId', id.value)

	fileImport(formData).then((res) => {
		console.log(res)
		if (res.code == 1) {
			let useFileList = [
				{
					url: `/api/v1/pagestyle/downloadfile?id=${res.data.id}`,
					name: res.data.id,
				},
			]
			useFileList = []

			loading.close()
			emits('update:useFile', useFileList)
			console.log(res.data.id, props.useFile, useFileList)
		} else {
			loading.close()
			ElMessage({
				message: res.msg,
				type: 'error',
			})
		}
	})
}

//移除
const handleRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	loading.close()
	console.log(uploadFile, uploadFiles)
	let useFileList = []
	emits('update:useFile', useFileList)
}

//文件数量限制
const handleExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
	ElMessage({
		message: `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + uploadFiles.length} 个文件`,
		type: 'warning',
	})
}

//上传前
const beforeUpload = (rawFile) => {
	if (!id.value) {
		ElMessage({
			message: `请选择数据集`,
			type: 'warning',
		})
		clearBtnDisabled()
		return false
	} else {
		return true
	}
}
</script>

<style lang="scss" scoped>
.dialog-footer button:first-child {
	margin-right: 10px;
}

:deep(.hide_box .el-upload--picture-card) {
	display: none;
}

:deep(.el-upload-list--picture-card) {
	--el-upload-list-picture-card-size: 100px;
}

:deep(.el-upload--picture-card) {
	--el-upload-picture-card-size: 100px;
}

i {
	background: url(../../assets/exportImg.png);
	display: inline-block;
	width: 16px;
	height: 16px;
	margin-right: 5px;
}

:deep(.el-upload-list) {
	display: none;
}
</style>

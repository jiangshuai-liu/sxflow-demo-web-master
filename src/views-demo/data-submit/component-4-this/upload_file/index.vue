<template>
	<el-dialog
		v-model="dialogVisible"
		title="导入文件"
		width="500"
		:before-close="handleClose"
	>
		<el-upload
			class="upload-demo"
			action=""
			:http-request="httpRequest"
			:file-list="filesList"
			:limit="1"
		>
			<el-button type="primary">点击上传</el-button>
			<!-- <el-icon class="el-icon--upload"><upload-filled /></el-icon>
			<div class="el-upload__text">Drop file here or <em>click to upload</em></div> -->
		</el-upload>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeModal">取消</el-button>
				<el-button
					type="primary"
					@click="uploadFile"
				>
					确定
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { importfillingdata } from '@/api/useCommon'
import { useRoute } from 'vue-router'
const route = useRoute()
const dialogVisible = ref(false)
let workflowId = ref('')
let filesList = ref([])
const httpRequest = async (param) => {
	console.log(param, 'param')
	let fileObj = param.file

	// filesList.value.push({ file: fileObj, name: fileObj.name })
	filesList.value.push(fileObj)
}

const uploadFile = () => {
	let formData = new FormData()
	formData.append('file', filesList.value[0])
	formData.append('workflowId', route.params?.id as string)
	importfillingdata(formData).then((res) => {
		console.log(res.data, 'rees.data')
	})
}

const handleClose = (done: () => void) => {
	// ElMessageBox.confirm('Are you sure to close this dialog?')
	// 	.then(() => {
	closeModal()
	done()
	// })
	// .catch(() => {
	// 	// catch error
	// })
}

const closeModal = () => {
	filesList.value = []
	dialogVisible.value = false
}
const open = (id) => {
	workflowId.value = id
	dialogVisible.value = true
}

defineExpose({
	open,
})
</script>
<style lang="scss" scoped></style>

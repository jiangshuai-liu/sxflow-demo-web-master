<template>
	<div class="aiChatCover">
		<div class="leftUploadSlider">
			<div class="fileCover">
				<el-upload
					class="upload-demo"
					drag
					action=""
					multiple
					:http-request="httpRequest"
					:show-file-list="false"
					:file-list="filesList"
					accept=".HTML,.HTM,.MHTML,.MD,.JSON,.JSONL,.CSV,.PDF,.DOCX,.PPT,.PPTX,.PNG,.JPG,.JPEG,.BMP,.EML,.MSG,.RST,.RTF,.TXT,.XML,.EPUB,.ODT,.TSV,.XLSX,.XLS,.XLSD,.IPYNB,.PY,.SRT,.TOML,.ENEX,html,.htm,.mhtml,.md,.json,.jsonl,.csv,.pdf,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.bmp,.eml,.msg,.rtf,.txt,.xml,.epub,.xlsx,.xls,.xlsd,.ipynb,.odt,.py,.rst,.srt,.toml,.tsv,.enex"
				>
					<!-- <el-icon class="el-icon--upload"><upload-filled /></el-icon> -->
					<div class="uploadPic"></div>
					<!-- <div class="el-upload__text">上传文档</div> -->
					<p>上传文档</p>
					<br />
					<div class="fileTypes el-upload__text">
						请上传以下格式的文件 HTML, HTM, MHTML, MD, JSON, JSONL, CSV, PDF, DOCX, PPT, PPTX, PNG, JPG, JPEG, BMP, RST, RTF, TXT, XML, EPUB, ODT,
						TSV, EML, MSG, XLSX, XLS, XLSD, IPYNB, PY, SRT, TOML, ENEX
					</div>
				</el-upload>
				<div class="useLine"></div>
				<div
					class="fileList"
					v-for="(item, index) in filesList"
					:key="index"
				>
					<div class="uploadIco"></div>
					<div class="fileTitle">
						{{ returnName(item) }}
					</div>
					<div
						class="delIco"
						@click="delItem(index)"
					></div>
				</div>
			</div>
			<div class="btns">
				<el-button
					type="info"
					@click="onAllClear"
				>
					全部清空
				</el-button>
				<el-button
					type="primary"
					@click="uploadFiles"
				>
					上传分析
				</el-button>
			</div>
		</div>
		<ai-word
			class="aiChat"
			:knowledge_id="knowledge_id"
		/>
	</div>
</template>
<script setup lang="ts">
import aiWord from 'coms/ai-word/index.vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { uploadtempdoc } from '@/api/ai-api'

let filesList = ref([])
let knowledge_id = ref('')

const returnName = (obj) => {
	return obj.name
}
const httpRequest = async (param) => {
	console.log(param, 'param')
	let fileObj = param.file
	let formData = new FormData()
	formData.append('file', fileObj)
	formData.append('field_key', 'file_name')
	// filesList.value.push({ file: fileObj, name: fileObj.name })
	filesList.value.push(fileObj)
	console.log(new Date().getTime(), 'start', filesList.value, param)
	// _uploadFile('184', formData).then((res) => {
	// 	fileList.value = fileList.value.filter((item) => {
	// 		return item?.url || item?.file_name?.[0].url
	// 	})
	// 	//question
	// 	let newFiles = fileList.value
	// 	uploadNum.value--
	// 	//question
	// 	console.log(123123123123)

	// 	if (res) {
	// 		if (res.code === 1) {
	// 			//直接替换最后一个数据
	// 			newFiles[newFiles.length] = {
	// 				...mainFormData.value,
	// 				parent_id: listofwords.parentObj?.id,
	// 				file_name: [
	// 					{
	// 						url: res.data.file_name,
	// 						file_name: res.data.source_file_name,
	// 						name: res.data.source_file_name,
	// 						file_size: res.data.file_size,
	// 						file_type: res.data.file_type,
	// 					},
	// 				],
	// 				file_size: res.data.file_size,
	// 				unzip_and_generate_dir: false,
	// 			}
	// 		} else {
	// 			if (newFiles.length == 1 || newFiles.length == 0) {
	// 				newFiles = []
	// 			} else {
	// 				newFiles.length = newFiles.length - 1
	// 			}
	// 			ElMessage({
	// 				message: res.msg || '系统出错',
	// 				type: 'error',
	// 			})
	// 		}

	// 		if (uploadNum.value == 0) {
	// 			SxLoadingRef.value.close()
	// 		}
	// 	}
	// })
}

const delItem = (index) => {
	filesList.value.splice(index, 1)
}

const onAllClear = () => {
	filesList.value = []
}

const uploadFiles = () => {
	console.log(filesList.value, 'filesList.value')

	let form = {
		files: filesList.value,
		// prev_id: 'string',
		// chunk_size: 0,
		// chunk_overlap: 0,
		// zh_title_enhance: true,
	}
	let formData = new FormData()
	filesList.value.forEach((item) => {
		formData.append('files', item)
	})

	// formData.append('field_key', 'file_name')
	uploadtempdoc(formData).then((res) => {
		console.log(res.data, 'res.data')

		knowledge_id.value = res.data.id
	})
}
</script>
<style lang="scss" scoped>
.aiChatCover {
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
	padding: 32px 24px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.fileCover {
	width: 100%;
	flex: 1;
}

.btns {
	display: flex;
	justify-content: space-between;
	width: 100%;
	height: 40px;
	.el-button {
		flex: 1;
		height: 100%;
	}
}

:deep(.el-upload-dragger) {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #f5f7fa;
}

.uploadPic {
	background-image: url(../../assets/aiImgs/ico_qyzpdj@2x.png);
	width: 40px;
	height: 40px;
	background-size: 40px 40px;
	margin-bottom: 8px;
}

.dailogCover {
	padding: 0;
}

.aiChat {
	flex: 1;
}

:deep(.el-collapse) {
	width: 100%;
	max-width: 100% !important;
}

.useLine {
	width: 100%;
	height: 1px;
	margin: 8px 0;
	background: #dcdfe6;
}

.fileList {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px;
	box-sizing: border-box;
	width: 100%;
	height: 64px;
	border: 1px solid #d4d7de;
	margin-bottom: 8px;
	&:last-child {
		margin-bottom: 0;
	}

	.fileTitle {
		font-family: Microsoft YaHei UI, Microsoft YaHei UI;
		font-weight: 400;
		font-size: 14px;
		color: #303133;
		flex: 1;
	}
	.uploadIco {
		width: 32px;
		height: 32px;
		background-image: url(../../assets/aiImgs/file_icon@2x.png);
		background-size: 100% 100%;
		margin-right: 16px;
	}
	.delIco {
		width: 14px;
		height: 14px;
		background-image: url(../../assets/aiImgs/delIco@2x.png);
		background-size: 100% 100%;
		margin-left: 16px;
		cursor: pointer;
	}
}

.fileTypes {
	font-size: 12px;
	width: 100%;
	text-align: left;
}
</style>

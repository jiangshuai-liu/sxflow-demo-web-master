<template>
	<div class="styleDefinitionPage">
		<div class="styleHeader">
			<div class="formBox">
				<p>数据导入</p>

				<el-form
					ref="ruleFormRef"
					:model="ruleForm"
					label-width="83px"
					class="demo-ruleForm"
				>
					<el-row>
						<el-col :span="12">
							<el-form-item
								label="数据集名称"
								prop="metadataName"
							>
								<el-select
									v-model="ruleForm.id"
									class="m-2"
									placeholder="请选择"
									clearable
								>
									<el-option
										v-for="item in titleList"
										:key="item.id"
										:label="item.dataset_name"
										:value="item.id"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<CommonUpload
								v-if="ruleForm.id.length > 0"
								style="float: right"
								v-model:useFile="excelFile"
								:id="ruleForm.id"
								:title="title"
							/>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</div>
		<div class="styleTable">
			<div class="tableHeader">数据导入列表</div>
			<el-table
				:data="tableData"
				stripe
				style="width: 100%"
				:height="tableHeight"
			>
				<el-table-column
					type="index"
					align="center"
					label="序号"
					width="80"
				/>
				<!-- <el-table-column
					align="center"
					prop="datasetName"
					label="系统名称"
				> -->
				<!-- <template #header>
            <div class="header-cell">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="系统名称"
                placement="top"
              >
                <span class="header-text">系统名称</span>
              </el-tooltip>
            </div>
          </template> -->
				<!-- </el-table-column> -->

				<!--  -->

				<el-table-column
					align="center"
					prop="datasetName"
					label="数据集名称"
				/>
				<el-table-column
					align="center"
					prop="databaseName"
					label="数据库名称"
				/>
				<el-table-column
					align="center"
					prop="tableName"
					label="表名称"
				/>
				<!--  -->
				<el-table-column
					align="center"
					prop="executeTime"
					label="导入时间"
				/>
				<el-table-column
					align="center"
					prop="executeStatus"
					label="导入状态"
				>
					<template #default="scope">
						{{ scope.row.executeStatus == '1' ? '成功' : '失败' }}
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					prop="importFailReason"
					label="失败原因"
				/>
				<!-- executeStatus -->
				<!-- <el-table-column
					align="center"
					fixed="right"
					label="操作"
					width="170"
				>
					<template #default="scope">
						<el-button
							v-my-global-directive
							link
							type="primary"
							plain
							@click="handleClickDelete(scope.row)"
							>删除</el-button
						>
					</template>
				</el-table-column> -->
			</el-table>
			<el-pagination
				class="stylePage"
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:page-sizes="[10, 100, 200, 300, 400]"
				:disabled="disabled"
				:background="background"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
		<data-export ref="DataExportRef"></data-export>
	</div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useStore from '@/store'
import CommonUpload from './CommonUpload.vue'
import DataExport from './DataExport.vue'
// import { querydefaultdatasetlist } from 'api/diy-statistics/index'
// import { queryimportrecords, delimportrecord } from 'api/data-export/index'
import { ElMessage } from 'element-plus'
import { queryfillingdatalist } from '@/api/useCommon'
import { importQueryApi } from '@/api/dataset-api'

const DataExportRef = ref(null)
const route = useRoute()
const router = useRouter()
const title = ref('导入')
let titleList = ref([])
const tableData = ref([])
const currentPage = ref(1) //页数
const pageSize = ref(10) //每页条数
const background = ref(true)
const disabled = ref(false)
const total = ref(0)
let tableHeight = ref(474)
const ruleForm = ref({
	id: '', //元数据名称
})
let excelFile = ref([])
const workflow_id = 433
const init = () => {
	// querydefaultdatasetlist(form).then((res) => {
	// 	console.log(res.data.data)
	// 	titleList.value = res.data.data
	// })

	queryfillingdatalist({
		name: '_w' + workflow_id,
	}).then((res) => {
		titleList.value = res.data.value.filter((item) => {
			return item.is_schedule != '是'
		})
		getList()
		// if (getCard) {
		// 	emits('initCard')
		// }
	})
}
const getList = () => {
	importQueryApi({ page: currentPage.value, per_page: pageSize.value }).then((res) => {
		console.log(res.data.data)
		tableData.value = res.data.value
		total.value = res.data.total
		currentPage.value = res.data.page
		pageSize.value = res.data.per_page
	})
}

const getTableHeight = () => {
	const useHeight = document.querySelector('.styleDefinitionPage').clientHeight - 280
	if (useHeight > 474) {
		tableHeight.value = useHeight
	} else {
		tableHeight.value = 474
	}
}

onMounted(() => {
	init()
	getTableHeight()
})
const addDialog = (e) => {
	DataExportRef.value.open(e)
}

const handleClickDelete = (row) => {
	console.log('click', row.id)
	// delimportrecord({ id: row.id }).then((res) => {
	// 	ElMessage.success(res.msg)
	// 	init({})
	// })
}
//切换每页几条
const handleSizeChange = (val: number) => {
	pageSize.value = val
	let form = {
		page: currentPage.value,
		per_page: pageSize.value,
		// current: currentPage.value,
		// pageSize: pageSize.value,
	}
	// console.log(`${val} items per page`);
	getList()
}
//切换页数
const handleCurrentChange = (val: number) => {
	currentPage.value = val
	let form = {
		page: currentPage.value,
		per_page: pageSize.value,
		// current: currentPage.value,
		// pageSize: pageSize.value,
	}
	// console.log(`current page: ${val}`);
	getList()
}
</script>
<style lang="scss" scoped>
.styleDefinitionPage {
	background: #ecf1f9;
	height: 100%;
	padding: 14px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}
// .styleHeader {
//   width: 100%;
//   height: 102px;
//   background: #ffffff;
//   color: #303133;
//   display: flex;
//   font-family: Microsoft YaHei UI;
//   font-weight: bold;
//   font-size: 16px;
//   padding: 22px;
//   box-sizing: border-box;
//   justify-content: space-between;
//   // margin: 0 auto;
//   margin-bottom: 14px;
// }
.styleHeader {
	.formBox p {
		width: 100%;
		// height: 72px;
		height: 58px;
		background: #ffffff;
		color: #303133;
		display: flex;
		font-family: Microsoft YaHei UI;
		font-weight: bold;
		font-size: 16px;
		// padding: 22px;
		padding: 15px 22px;
		box-sizing: border-box;
		justify-content: space-between;
		// margin: 0 auto;
		margin-bottom: 14px;
	}
	.demo-ruleForm {
		padding: 15px 22px;
		background: #ffffff;
		color: #303133;
		margin-bottom: 14px;
		box-sizing: border-box;
		height: 62px;
	}
}

.formBox {
	width: 100%;
}
.styleTable {
	flex: 1;
	background: #ffffff;
	position: relative;
	padding: 16px 24px;
	box-sizing: border-box;
}

.tableHeader {
	color: #303133;
	font-family: Microsoft YaHei UI;
	font-weight: bold;
	font-size: 16px;
	line-height: 28px;
	letter-spacing: 0px;
	text-align: left;
}

.header-cell {
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
:deep(.el-table--default .el-table__cell) {
	padding: 12px 0;
}

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

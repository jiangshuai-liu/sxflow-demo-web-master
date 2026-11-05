<template>
	<div class="styleDefinitionPage">
		<div class="styleHeader">
			<div class="formBox">
				<p>数据集成</p>

				<el-form
					ref="ruleFormRef"
					:model="ruleForm"
					:rules="rules"
					label-width="83px"
					class="demo-ruleForm"
					:size="formSize"
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
								>
									<el-option
										v-for="item in titleList"
										:key="item.id"
										:label="item.datasetName"
										:value="item.id"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<CommonUpload
								style="float: right"
								v-model:useFile="excelFile"
								:id="ruleForm.id"
							/>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</div>
		<div class="styleTable">
			<div class="tableHeader">数据集成列表</div>
			<el-table
				:data="tableData"
				stripe
				style="width: 100%"
				height="510"
			>
				<el-table-column
					type="index"
					align="center"
					label="序号"
					width="80"
				/>
				<el-table-column
					align="center"
					prop="datasetName"
					label="系统名称"
					width="180"
				/>
				<el-table-column
					align="center"
					prop="comment"
					label="数据集名称"
				/>
				<el-table-column
					align="center"
					prop="name"
					label="导入事件"
				/>

				<el-table-column
					align="center"
					fixed="right"
					label="操作"
					width="270"
				>
					<template #default="scope">
						<el-button
							link
							type="primary"
							plain
							@click="handleClickShow(scope.row)"
							>查看</el-button
						>
						<el-button
							v-my-global-directive
							link
							type="primary"
							plain
							@click="handleClick(scope.row)"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<data-export ref="DataExportRef"></data-export>
	</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useStore from '@/store'
import CommonUpload from './CommonUpload.vue'
import DataExport from './DataExport.vue'
import { querydefaultdatasetlist } from 'api/diy-statistics/index'

const DataExportRef = ref(null)
const route = useRoute()
const router = useRouter()
let titleList = ref([])
const tableData = ref([])
const ruleForm = ref({
	id: '', //元数据名称
})
let excelFile = ref([])

const init = (form) => {
	querydefaultdatasetlist(form).then((res) => {
		console.log(res.data.data)
		titleList.value = res.data.data
	})
}

init({})

const addDialog = (e) => {
	DataExportRef.value.open(e)
}

const handleClick = (row) => {
	console.log('click', row.id)
	// router.push({
	//   path: "/metadata/metadatas",
	//   query: {
	//     id: row.id,
	//   },
	// });
}

const handleClickShow = (row) => {
	console.log('click', row.id)
	// AddDataListViewRef.value.open(row.id);
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
</style>

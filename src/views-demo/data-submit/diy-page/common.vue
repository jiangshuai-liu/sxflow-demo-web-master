<template>
	<div class="commonPage">
		<div class="searchForm">
			<el-form
				:inline="true"
				:model="formInline"
				class="demo-form-inline"
				ref="ruleFormResetRef"
				label-position="left"
				label-width="70"
			>
				<!-- <el-form-item
					label="待办事项"
					prop="title"
				>
					<el-input
						v-model="formInline.title"
						clearable
					/>
				</el-form-item> -->
				<el-form-item
					label="创建人员"
					prop="creator"
				>
					<el-input
						v-model="formInline.creator"
						placeholder=""
						clearable
					/>
				</el-form-item>
				<!-- <el-form-item
					label="流水号"
					prop="user"
				>
					<el-input
						v-model="formInline.user"
						placeholder="流水号"
						clearable
					/>
				</el-form-item> -->
				<el-form-item
					label="创建时间"
					prop="use_date"
				>
					<el-date-picker
						v-model="formInline.use_date"
						type="datetimerange"
						value-format="YYYY-MM-DD HH:mm:ss"
						range-separator="至"
						start-placeholder="起始时间"
						end-placeholder="结束时间"
					/>
				</el-form-item>
			</el-form>
			<div class="submitBtns">
				<el-button
					:icon="RefreshRight"
					@click="resetForm(ruleFormResetRef)"
					>重置</el-button
				>
				<el-button
					class="redBtn"
					:icon="Search"
					@click="getList()"
					>查询</el-button
				>
			</div>
		</div>

		<div class="workbenchTable">
			<sx-title :title>
				<template #titleBtn>
					<div>
						<el-button
							type="success"
							color="#E53C3C"
							@click="openH5"
							><span class="comBtnIco addIco"></span>新建H5</el-button
						>
						<el-button
							type="success"
							color="#E53C3C"
							@click="addMain"
							><span class="comBtnIco addIco"></span>新增</el-button
						>
						<el-button
							type="success"
							color="#E53C3C"
							@click="exportFile(false)"
							><span class="comBtnIco efferentIco"></span>导出</el-button
						>
						<el-button
							type="success"
							color="#E53C3C"
							@click="exportFile(true)"
							><span class="comBtnIco efferentIco"></span>导出模板</el-button
						>
						<el-button
							type="success"
							color="#E53C3C"
							@click="exportFileUpload"
							><span class="comBtnIco efferentIco"></span>导入</el-button
						>
						<!-- <el-button
						type="success"
						color="#E53C3C"
						><span class="comBtnIco deleteIco"></span>删除</el-button
					> -->
					</div>
				</template>
			</sx-title>
			<el-table
				class="sxTable"
				:data="tableData"
				style="width: 100%"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
				ref="multipleTableRef"
				border
			>
				<!-- @selection-change="handleSelectionChange" -->

				<!-- height="448" -->
				<template #empty>
					<common-empty />
				</template>
				<!-- <el-table-column
					class-name="sxTableColumn"
					type="selection"
					width="55"
				/> -->
				<el-table-column
					class-name="sxTableColumn"
					type="index"
					width="80"
					label="序号"
					fixed="left"
					align="center"
				/>
				<!-- headerList -->
				<template v-if="tableAll">
					<el-table-column
						class-name="sxTableColumn"
						:prop="item.key"
						:label="item.name"
						align="center"
						v-for="item in tableAll.useHeader"
						:key="item.key"
						min-width="100"
						show-overflow-tooltip
					>
					</el-table-column>
				</template>

				<!-- <el-table-column
					class-name="sxTableColumn"
					prop="workflow_name"
					label="待办事项"
					align="center"
				>
				</el-table-column>

				<el-table-column
					class-name="sxTableColumn"
					prop="create_uname"
					label="创建人"
					align="center"
				/>
				<el-table-column
					class-name="sxTableColumn"
					label="创建部门"
					align="center"
				>
					<template #default="scope">
						{{ scope.row?.create_uname }}
					</template>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="create_time"
					label="创建时间"
					align="center"
				/> -->
				<el-table-column
					class-name="sxTableColumn"
					fixed="right"
					label="操作"
					width="140"
					align="center"
				>
					<template #default="scope">
						<el-button
							link
							type="primary"
							size="small"
							@click="showItem(scope.row)"
							>查看</el-button
						>
						<el-button
							link
							type="primary"
							size="small"
							@click="editItem(scope.row)"
							>编辑</el-button
						>

						<el-popconfirm
							title="确定删除该条数据?"
							@confirm="delItem(scope.row)"
							confirm-button-text="确认"
							cancel-button-text="取消"
							width="180"
						>
							<template #reference>
								<el-button
									link
									type="primary"
									size="small"
									>删除</el-button
								>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>

				<el-table-column
					align="center"
					fixed="right"
					width="80"
					v-if="tableAll"
				>
					<template #header>
						<el-popover
							placement="bottom-end"
							:width="200"
							popper-class="popperBox"
						>
							<template #reference
								><p @click="tableAll.showPopover">
									更多<el-icon
										:class="{
											commonIco: true,
										}"
										><ArrowDownBold
									/></el-icon></p
							></template>

							<!-- moreIco: getShow(tabItem.tableName, tableItem.tableName), -->
							<div class="checkSelectBox">
								<el-checkbox
									v-model="tableAll.checkAll"
									:indeterminate="tableAll.isIndeterminate"
									@change="tableAll.checkAllHeader"
									>全选</el-checkbox
								>

								<el-checkbox-group
									v-model="tableAll.centerCheckHeader"
									@change="tableAll.checkCenterHeader"
								>
									<!-- {{ tableAll.willCheckHeader }} -->
									<template
										:key="index"
										v-for="(item, index) in tableAll.willCheckHeader"
									>
										<el-checkbox :value="item.key">
											<el-tooltip
												class="box-item"
												effect="dark"
												:content="item.name"
												placement="top"
											>
												<div class="checkLabel">
													{{ item.name }}
												</div>
											</el-tooltip>
										</el-checkbox>
									</template>
								</el-checkbox-group>
							</div>

							<div class="btns">
								<el-button
									size="small"
									@click="tableAll.showPopover"
									>取消</el-button
								>
								<el-button
									size="small"
									type="primary"
									@click="tableAll.checkHeaderFun"
									>确定</el-button
								>
							</div>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
			<com-pagination
				ref="ComPaginationRef"
				@getPaList="getList"
			></com-pagination>
		</div>
		<simple-show-modal ref="simpleShowModalRef" />
		<simple-edit-modal
			ref="simpleEditModalRef"
			@getList="getList"
		/>
		<upload-file ref="UploadFileRef"></upload-file>
		<yjyAddModal ref="yjyAddModalRef"></yjyAddModal>
	</div>
</template>
<script lang="ts" setup>
import yjyAddModal from '@/views-demo/data-submit/component-4-this/yjy/EditModal.vue'
import sxTitle from 'coms/common/SxTitle.vue'
import simpleShowModal from 'coms/simple-show-modal/index.vue'
import simpleEditModal from 'coms/simple-edit-modal/index.vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { resetForm, sxPagenationSelf, tableHeaderFun } from '@/utils/common'
import UploadFile from '../component-4-this/upload_file/index.vue'
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue'
import {
	querydutyflowlist,
	queryrelationflowlist,
	queryfillingdatalist,
	deletefillingdatabyid,
	queryfillingdatakeys,
	exportfillingdata,
	exporttemplate,
} from 'api/useCommon'
import emitter from '@/utils/emitter'

let UploadFileRef = ref(null)
let yjyAddModalRef = ref(null)

const title = '查询结果'
const props = defineProps({
	workFlowId: {
		type: Number,
		default: 0,
	},
})

let headerList = ref([])
const simpleShowModalRef = ref(null)
const simpleEditModalRef = ref(null)
const emits = defineEmits(['initCard', 'addMain'])
const formInline = reactive({
	title: '',
	creator: '',
	use_date: [],
})
const ruleFormResetRef = ref(null)

const route = useRoute()
let getPa
let tableData = ref([])
const ComPaginationRef = ref(null)
let tableAll = ref(null)

const addMain = () => {
	emits('addMain')
}

const exportFileUpload = () => {
	UploadFileRef.value.open()
}

const getList = (getCard = false, changeMore = false) => {
	console.log('getlist', getCard, changeMore)
	if (route.params.id == 'useid') return
	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}
	queryfillingdatakeys({ workflowId: props.workFlowId }).then((res) => {
		headerList.value = res.data.filter((item) => !item.tag)

		let curHeader = [],
			willCheckHeader = []
		res.data.forEach((item) => {
			if (item.tag) {
				curHeader.push(item)
			} else {
				willCheckHeader.push(item)
			}
		})
		// if (!tableAll.value) {
		// 	tableAll.value = tableHeaderFun(curHeader, willCheckHeader, 'key')
		// }
		if (changeMore) {
			tableAll.value = tableHeaderFun(curHeader, willCheckHeader, 'key')
		}
	})

	queryfillingdatalist({
		name: '_w' + props.workFlowId,
		page: getPa.currentPage,
		per_page: getPa.pageSize,
		...formInline,
		start_time: formInline.use_date?.[0] || '',
		end_time: formInline.use_date?.[1] || '',
	}).then((res) => {
		console.log(res.data)
		tableData.value = res.data.value
		setTimeout(() => {
			ComPaginationRef.value.setPagitionObj({
				total: res.data.total,
				currentPage: res.data.page,
				pageSize: res.data.per_page,
			})
		}, 0)

		if (getCard) {
			emits('initCard')
		}
	})
}

const openH5 = () => {
	window.open(`${import.meta.env.VITE_APP_H5URL}/#/main?id=${props.workFlowId}`)
}
const editItem = (item) => {
	if (route.params.id == '337') {
		yjyAddModalRef.value.open({ workflowId: props.workFlowId, useId: item.id })
	} else {
		simpleEditModalRef.value.open({ workflowId: props.workFlowId, useId: item.id })
	}
}
const showItem = (item) => {
	simpleShowModalRef.value.open({ workflowId: props.workFlowId, id: item.id })
}

const delItem = (item) => {
	const form = { workflow_id: props.workFlowId, id: item.id }
	deletefillingdatabyid(form).then((res) => {
		getList()
	})
}

const exportFile = (empty = false) => {
	let form
	if (!empty) {
		form = {
			workflowId: props.workFlowId,
			...formInline,
			start_time: formInline.use_date?.[0] || '',
			end_time: formInline.use_date?.[1] || '',
		}
	} else {
		form = {
			workflowId: props.workFlowId,
			// ...formInline,
			// start_time: formInline.use_date?.[0] || '',
			// end_time: formInline.use_date?.[1] || '',
			// creator: '*',
		}
	}
	let exportUrl = empty ? exporttemplate : exportfillingdata

	exportUrl(form).then((res) => {
		const url = window.URL.createObjectURL(res.data)
		const link = document.createElement('a')
		link.href = url
		let fileName = decodeURI(res.headers['content-disposition'].split('=')[1])
		link.setAttribute('download', fileName)
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	})
}

defineExpose({
	getList,
})
onMounted(() => {
	emitter.on('send-getList', ({ getCard, changeMore }) => {
		getList(getCard, changeMore)
	})
})
onUnmounted(() => {
	console.log('romove')

	emitter.off('send-getList')
})
</script>
<style lang="scss" scoped>
p {
	margin: 0;
}
.el-tabs__item {
	color: #606266;
}

.workbenchTable {
	padding: 16px 24px;
	border-radius: 8px;
	background: #ffffff;
}

.workbenchSearchCommon {
	background: #ffffff;
	border-radius: 0 0 8px 8px;
	padding: 12px 12px 3px 24px;
	box-sizing: border-box;
	min-height: 72px;
	margin-bottom: 12px;
}

.searchForm {
	display: flex;
	background: #ffffff;
	border-radius: 8px 8px 8px 8px;
	padding: 12px 24px 0;
	box-sizing: border-box;
	margin-bottom: 24px;

	.submitBtns {
		width: 200px;
		flex-shrink: 0;
		display: flex;
		align-items: flex-end;
		margin-bottom: 12px;
	}
}
</style>

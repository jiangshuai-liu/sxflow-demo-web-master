<template>
	<div class="workbenchPage">
		<div
			class="topList"
			v-if="usePageSelf"
		>
			<div class="cardList">
				<div
					@click="changeActiveCard(item)"
					:class="{ cardItem: true, active: activeCard.id == item.id }"
					v-for="(item, index) in usePageSelf.useList"
					:key="index"
				>
					<img
						class="cardIco"
						:src="userTitle"
						alt=""
					/>
					<!-- <div class="titleAndNums"> -->
					<p class="cardTitle">
						<el-tooltip
							class="box-item"
							effect="dark"
							:content="item.name"
							placement="top-start"
						>
							{{ item.name }}
						</el-tooltip>
					</p>
					<!-- </div> -->
				</div>
			</div>
			<div class="pagerScroll">
				<div
					v-for="item in usePageSelf.totalPage"
					:key="item"
					@click="usePageSelf.getPageList(item)"
					:class="{ pageDot: true, active: usePageSelf.page == item }"
				></div>
				<!-- <div class="pageDot"></div> -->
			</div>
		</div>

		<div class="searchForm">
			<el-form
				:inline="true"
				:model="formInline"
				class="demo-form-inline"
				ref="ruleFormResetRef"
				label-position="left"
				label-width="70"
			>
				<el-form-item
					label="标题"
					prop="user"
				>
					<el-input
						v-model="formInline.user"
						placeholder="标题"
						clearable
					/>
				</el-form-item>
				<el-form-item
					label="创建人"
					prop="user"
				>
					<el-input
						v-model="formInline.user"
						placeholder="创建人"
						clearable
					/>
				</el-form-item>
				<el-form-item
					label="流水号"
					prop="user"
				>
					<el-input
						v-model="formInline.user"
						placeholder="流水号"
						clearable
					/>
				</el-form-item>
				<el-form-item
					label="创建时间"
					prop="date"
				>
					<el-date-picker
						v-model="formInline.date"
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
							@click="addMain"
							><span class="comBtnIco addIco"></span>新增</el-button
						>
						<el-button
							type="success"
							color="#E53C3C"
							><span class="comBtnIco efferentIco"></span>导出</el-button
						>
						<el-button
							type="success"
							color="#E53C3C"
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
				@selection-change="handleSelectionChange"
			>
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
					align="center"
				/>

				<el-table-column
					class-name="sxTableColumn"
					prop="workflow_name"
					label="待办事项"
					align="center"
				>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="name"
					label="提交类型"
					align="center"
				/>
				<el-table-column
					class-name="sxTableColumn"
					prop="create_uname"
					label="提交人"
					align="center"
				/>``
				<el-table-column
					class-name="sxTableColumn"
					label="提交部门"
					align="center"
				>
					<template #default="scope">
						{{ scope.row?.create_uname }}
					</template>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="create_time"
					label="提交时间"
					align="center"
				/>
				<el-table-column
					class-name="sxTableColumn"
					fixed="right"
					label="操作"
					min-width="100"
					align="center"
				>
					<template #default="scope">
						<el-button
							link
							type="primary"
							size="small"
							@click="showItem(scope.row)"
							>详情</el-button
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
			</el-table>
			<com-pagination
				ref="ComPaginationRef"
				@getPaList="getList"
			></com-pagination>
		</div>
		<add-modal ref="addModalRef" />
		<simple-show-modal ref="simpleShowModalRef" />
		<simple-edit-modal ref="simpleEditModalRef" />
	</div>
</template>
<script setup lang="ts">
import addModal from 'coms/add-modal/index.vue'
import simpleShowModal from 'coms/simple-show-modal/index.vue'
import simpleEditModal from 'coms/simple-edit-modal/index.vue'
import SxTitle from 'coms/common/SxTitle.vue'
import ComPagination from 'coms/common/ComPagination.vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ref, reactive, computed, nextTick } from 'vue'
import { resetForm, sxPagenationSelf } from '@/utils/common'
import { querymyfillingworkflowlist, queryfillingdatalist, deletefillingdatabyid } from 'api/useCommon'

let title = '查询结果'
const userTitle = new URL(`../../assets/index/userTitle.png`, import.meta.url).href
const ruleFormResetRef = ref(null)
const formInline = reactive({
	user: '',
	region: '',
	date: [],
})
const addModalRef = ref(null)
const simpleShowModalRef = ref(null)
const simpleEditModalRef = ref(null)
let multipleTableRef = ref(null)
let tableData = ref([])
let activeCard = ref<any>({})
let checkList = ref([])
const ComPaginationRef = ref(null)
let tableHeight = ref(570)
let getPa
let usePageSelf = ref<any>(null)

const onSubmit = () => {
	console.log('submit!')
}

const addMain = () => {
	addModalRef.value.open(activeCard.value.id)
}

const editItem = (item) => {
	simpleEditModalRef.value.open({ workflowId: activeCard.value.id, useId: item.id })
}

const getList = (getCard = false) => {
	if (!getPa) {
		getPa = ComPaginationRef.value.returnPaginationObj()
	}
	queryfillingdatalist({
		workflow_id: activeCard.value.id,
		page: getPa.currentPage,
		per_page: getPa.pageSize,
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
		let arr2Map = {}
		checkList.value.forEach((item) => (arr2Map[item.id] = item))
		const curCheckList: any[] = JSON.parse(JSON.stringify(checkList.value))
		nextTick(() => {
			tableData.value.forEach((item, index) => {
				arr2Map[item.id] && multipleTableRef.value?.toggleRowSelection(tableData.value[index], true)
			})
			checkList.value = [...checkList.value, ...curCheckList]
		})
		if (getCard) {
			initCard()
		}
	})
}

const handleSelectionChange = (val) => {
	checkList.value = val
	console.log(val, 'checkList')
}

const changeActiveCard = (item) => {
	activeCard.value = item
	getList()
}
const initCard = () => {
	querymyfillingworkflowlist().then((res) => {
		usePageSelf.value = sxPagenationSelf(res.data, 5)
		activeCard.value = usePageSelf.value.useList[0]
		getList()
	})
}

const showItem = (item) => {
	console.log(item)
	simpleShowModalRef.value.open({ workflowId: activeCard.value.id, id: item.id })
}

const delItem = (item) => {
	const form = { workflow_id: activeCard.value.id, id: item.id }
	deletefillingdatabyid(form).then((res) => {
		console.log(res)
		getList()
	})
}

initCard()
</script>
<style lang="scss" scoped>
.workbenchPage {
	width: 100%;
	min-height: 100%;
	height: auto;
	overflow: auto;
	display: flex;
	flex-direction: column;
}
.topList {
	margin-bottom: 32px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-image: url(../../assets/index/tab_bg.png);
	background-size: cover;
	height: 110px;
	padding: 16px 24px 18px;
	box-sizing: border-box;
}
.cardList {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	flex: 1;
	width: 100%;
	overflow: hidden;
	.cardItem {
		display: flex;
		cursor: pointer;
		width: calc((100% - 48px) / 5);
		height: 56px;
		background: #ffffff;
		border-radius: 8px 8px 8px 8px;
		padding: 12px 24px;
		align-items: center;
		box-sizing: border-box;
		overflow: hidden;
		font-family: Microsoft YaHei UI, Microsoft YaHei UI;

		img {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			margin-right: 16px;
		}
	}
	.cardTitle {
		font-weight: 400;
		font-size: 16px;
		color: #303133;
		margin: 0;
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.cardItem.active {
		background: linear-gradient(180deg, #e53c3c 0%, #f86a6a 100%);
		box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.08), 0px 12px 32px 4px rgba(0, 0, 0, 0.04);
		.cardTitle {
			color: #ffffff;
			font-weight: 700;
		}
	}
}

.workbenchTable {
	flex: 1;
	padding: 24px;
	box-sizing: border-box;
	border-radius: 8px;
	background: #ffffff;
	min-height: 526px;
}

.comBtnIco {
	width: 16px;
	height: 16px;
	margin-right: 5px;
	background-size: 16px 16px;
}

.addIco {
	background-image: url(../../assets/index/addIco.png);
}
.efferentIco {
	background-image: url(../../assets/index/efferentIco.png);
}
.deleteIco {
	background-image: url(../../assets/index/deleteIco.png);
}

.demo-form-inline .el-input {
	--el-input-width: 220px;
}

.demo-form-inline .el-select {
	--el-select-width: 220px;
}

.pagerScroll {
	width: auto;
	display: flex;
	gap: 8px;
	margin-top: 12px;
	flex-shrink: 0;
	.active {
		width: 36px;
		background: rgba(243, 97, 97, 1);
	}
}
.pageDot {
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background: rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.15);
	cursor: pointer;
}

.searchForm {
	display: flex;
	background: #ffffff;
	border-radius: 8px 8px 8px 8px;
	padding: 12px 24px;
	box-sizing: border-box;
	margin-bottom: 24px;

	.submitBtns {
		width: 200px;
		flex-shrink: 0;
		display: flex;
		align-items: flex-end;
		margin-bottom: 18px;
	}
}
</style>

<template>
	<div class="organizationPage">
		<left-slider
			title="组织机构"
			is-add
			@add-modal="addNewOrganization"
			ref="LeftSliderRef"
			@clickFunCallback="clickFunCallback"
			@initUseFun="initUseFun"
			:defaultProps="{ label: 'name' }"
		>
			<template #default="{ data, RbacTreeRef }">
				<span>
					<span
						:class="{
							comImgIco: true,
							nochild: !data.children?.length,
							haschild: data.children?.length,
						}"
					></span>
					<span
						class="name"
						@mouseover="RbacTreeRef.onMouseOver($event, data)"
						@mouseenter="RbacTreeRef.enterDelay()"
						@mouseleave="RbacTreeRef.leaveDelay()"
					>
						{{ data.name }}
					</span>
				</span>
			</template>
		</left-slider>

		<div class="mainOrganization">
			<div
				class="organizationHeader"
				v-if="pageType == 'organization'"
			>
				<rbac-title :title>
					<template #titleBtn>
						<div class="btns">
							<el-button
								type="primary"
								:icon="Plus"
								@click="addNewOrganization()"
							>
								新增子单位</el-button
							>
							<el-button
								type="primary"
								:icon="EditPen"
								@click="editNewOrganization()"
								>修改</el-button
							>
							<el-button
								type="primary"
								:icon="Delete"
								>删除</el-button
							>
						</div>
					</template>
				</rbac-title>

				<div class="formShow">
					<el-row :gutter="20">
						<el-col :span="8"
							><div class="formItem">
								<span class="itemLabel">单位法人码</span>
								<span>{{ mainFormData.d_lrid }}</span>
							</div>
						</el-col>
						<el-col :span="8"
							><div class="formItem">
								<span class="itemLabel">电子邮件</span>
								<span>{{ mainFormData.d_email }}</span>
							</div>
						</el-col>
						<el-col :span="8"
							><div class="formItem">
								<span class="itemLabel">上级单位</span>
								<span>上级单位</span>
							</div>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="8"
							><div class="formItem">
								<span class="itemLabel">单位地址</span>
								<span>{{ mainFormData.d_address }}</span>
							</div>
						</el-col>
						<el-col :span="8"
							><div class="formItem">
								<span class="itemLabel">单位负责人</span>
								<span>{{ mainFormData.d_rpname }}</span>
							</div>
						</el-col>
						<el-col :span="8"
							><div class="formItem">
								<span class="itemLabel">备注</span>
								<span>{{ mainFormData.d_comment1 }}</span>
							</div>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="8"
							><div class="formItem">
								<span class="itemLabel">联系人</span>
								<span>{{ mainFormData.d_cpname }}</span>
							</div>
						</el-col>
						<el-col :span="16"
							><div class="formItem">
								<span class="itemLabel">联系电话</span>
								<span>{{ mainFormData.d_phone }}</span>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
			<company-list
				v-if="pageType == 'organization'"
				:first-tree-id="firstTreeId"
				:use-super-id="useSuperId"
				@add-new-organization="addNewOrganization"
				@change-page-type="changePageType"
				ref="companyListRef"
			></company-list>
			<!-- {{ userUseForm }} -->
			<auth-user-list
				v-if="pageType == 'user'"
				:first-tree-id="firstTreeId"
				:use-super-id="useSuperId"
				:user-use-form="userUseForm"
				@add-new-organization="addNewOrganization"
				@change-page-type="changePageType"
				ref="AuthUserListRef"
			></auth-user-list>
		</div>
		<add-modal
			:title="addModalTitle"
			ref="AddModalRef"
		></add-modal>
		<rbac-edit-modal
			title="修改单位"
			ref="RbacEditModalRef"
		>
		</rbac-edit-modal>
	</div>
</template>
<script setup lang="ts">
import _ from 'lodash'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import LeftSlider from 'coms/use-diy-tree/LeftSlider.vue'
import AddModal from 'coms/add-modal/index.vue'
import RbacEditModal from 'coms/rbac-edit-modal/index.vue'
import { rbacEnums, rbacUseEnums } from '@/enums/rbacEnums'
import { querydeptmenu } from 'api/rbac'
import { Ref, ref, nextTick } from 'vue'
import { commonHook, commonFormFun } from '@bksx/sxflow'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import CompanyList from './component-4-this/CompanyList.vue'
import AuthUserList from './component-4-this/AuthUserList.vue'
import type { pageTypeType, elseFormType } from '@/types/rbac/organization'
import { queryfillingdatabyid, querysignverification } from 'api/useCommon'

const LeftSliderRef = ref<InstanceType<typeof LeftSlider>>(null)
const AddModalRef = ref(null)
const RbacEditModalRef = ref(null)
const companyListRef = ref(null)
const AuthUserListRef = ref(null)

let pageType = ref<pageTypeType>('organization')
let {
	isShow,
	form,
	id,
	centerObj,
	mainFormData,
	formItemList,
	workflow_id,
	transition,
	column_size,
	rules,
	ruleFormRef,
	isState,
	ids,
	isReturn,
	injectionForm,
	ticketId,
} = commonHook()
let title = ref('')
let topLevelId = ref<number | string>(null) //最高级id
let useSuperId = ref<number | string>(null) //当前渲染页面id
let firstTreeId = ref<number | string>(null) //第一级第一个id

let addModalTitle = ref('')

let userUseForm = ref<Partial<elseFormType>>({})

const changePageType = (type: pageTypeType, elseForm: Partial<elseFormType> = {}) => {
	pageType.value = type
	userUseForm.value = elseForm
}
const userCallback = () => {
	companyListRef.value?.userCallback()
}

const addNewOrganization = (isTop = false, type: pageTypeType = 'organization', name = '新增单位') => {
	//添加组织机构
	let dd_superdid
	if (isTop) {
		dd_superdid = topLevelId.value
	} else {
		dd_superdid = useRbacFilterTree('getComponentRef').getCurrentNode()?.id || firstTreeId.value
	}

	addModalTitle.value = name
	useSuperId.value = dd_superdid
	let traslateForm = {}
	if (type == 'organization') {
		traslateForm = { dd_superdid }
	} else {
		traslateForm = { u_did: dd_superdid }
	}

	AddModalRef.value.open(rbacEnums[type], traslateForm, false, type == 'organization' ? modalAddCallback : userCallback)
}

const editNewOrganization = () => {
	const currentNodeData: any = useRbacFilterTree('getComponentRef').getCurrentNode()
	const dd_superdid = currentNodeData?.parentId || topLevelId.value
	const d_id = currentNodeData?.id || firstTreeId.value
	useSuperId.value = d_id // dd_superdid
	//这里删除了dd_superdid  目前效果上没有问题  如后续仍然没有问题 则可以删除
	// RbacEditModalRef.value.open(rbacEnums.organization, { dd_superdid, d_id }, false, modalAddCallback)
	RbacEditModalRef.value.open(rbacEnums.organization, { d_id }, false, modalEditCallback)
}

const initUseFun = (data) => {
	querydeptmenu({}).then((res) => {
		const resultRes = res.data || []
		data.value = resultRes.map((item) => ({ ...item, isLeaf: !item.isParent }))
		topLevelId.value = resultRes?.[0].parentId || rbacUseEnums.topLevelCompany
		firstTreeId.value = resultRes?.[0].id
		returnTitle(useSuperId.value || firstTreeId.value)
	})
}

const useRbacFilterTree = (funName?: string, params: any[] = []) => {
	const self = LeftSliderRef.value?.getRbacFilterTreeRef()
	if (!funName) {
		return self
	} else {
		return self?.[funName](...params)
	}
}

const modalAddCallback = (apiResult) => {
	updateOrganization(addCallback, apiResult)
}

const modalEditCallback = (apiResult) => {
	if (apiResult.workflow_id == rbacEnums.organization) {
		const thisNode = useRbacFilterTree('getComponentRef')?.getNode(apiResult.id)
		thisNode.data.name = apiResult.d_name
	}
	updateOrganization(addCallback, apiResult)
}

const changeCompanyForm = (id) => {
	const commonFormObj = { id, workflow_id: rbacEnums.organization }
	queryfillingdatabyid(commonFormObj).then((res) => {
		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		mainFormData.value = commonForm.mainFormDatas
	})

	
}

const returnTitle = (id) => {
	nextTick(() => {
		title.value = useRbacFilterTree('getComponentRef')?.getNode(id)?.data.name
		changeCompanyForm(id)
	})
}

const addCallback = (data: Ref<any[]> = ref([]), apiResult: any) => {
	const dd_superdid = useSuperId.value.toString()
	const formData = { deptId: dd_superdid }
	querydeptmenu(formData).then((res) => {
		const apiData = res.data
		const useData = apiData.map((item) => ({ ...item, isLeaf: !item.isParent }))
		if (dd_superdid != topLevelId.value) {
			console.log(dd_superdid, 'dd_superdid  addback')
			//不是第一级
			useRbacFilterTree('getComponentRef').updateKeyChildren(dd_superdid, useData)
			useRbacFilterTree('getSelfTree').changeTreeItemExpanded(dd_superdid, true)
		} else {
			//是第一级
			const transitionData = _.groupBy(data.value, 'id')
			console.log(transitionData, 'transitionData')
			let newData = apiData.map((item) => {
				if (Object.hasOwnProperty.call(transitionData, String(item.id))) {
					return transitionData[item.id][0]
				} else {
					return item
				}
			})
			data.value = newData
		}
		returnTitle(apiResult.id)
	})
}

const clickFunCallback = async (clickItem, data) => {
	const selfFunction = () => {
		const formData = { deptId: clickItem.id }
		querydeptmenu(formData).then((res) => {
			const apiData = res.data
			const useData = apiData.map((item) => ({ ...item, isLeaf: !item.isParent }))
			useRbacFilterTree('getComponentRef').updateKeyChildren(clickItem.id, useData)
			useRbacFilterTree('getSelfTree').changeTreeItemExpanded(clickItem.id, true)
		})
	}

	!clickItem.children.length && selfFunction()
	title.value = clickItem.name
	useSuperId.value = useRbacFilterTree('getComponentRef').getCurrentNode()?.id

	changeCompanyForm(useSuperId.value)
	companyListRef.value?.changePage()

	pageType.value == 'user' && changePageType('organization')
}

const updateOrganization = (callback = null, apiResult = {}) => {
	useRbacFilterTree('updateData', [true, callback, apiResult])
}
</script>
<style lang="scss" scope>
.organizationPage {
	height: 100%;
	display: flex;
}

.mainOrganization {
	flex: 1;
	margin-left: 16px;
	display: flex;
	flex-direction: column;
}

.organizationHeader,
.organizationTabs,
.commonBottom {
	// height: 184px;
	background: #ffffff;
	border-radius: 8px;
	padding: 16px 24px;
	box-sizing: border-box;
}

.organizationTabs {
	margin-top: 12px;
	border-radius: 8px 8px 0 0;
	padding-bottom: 0;
}
.formShow {
	margin-top: 16px;
}
.formItem {
	height: 32px;
	display: flex;
	align-items: center;
	font-family: Microsoft YaHei UI, Microsoft YaHei UI;
	font-weight: 400;
	font-size: 14px;
	color: #000000;
	.itemLabel {
		width: 92px;
		color: #909399;
	}
	span {
		&:last-child {
			flex: 1;
		}
	}
}

.comImgIco {
	display: inline-block;
	width: 14px;
	height: 14px;
	background-size: 14px 14px;
	margin-right: 5px;
}

.nochild {
	background-image: url(../../assets/index/noChild.png);
}

.haschild {
	background-image: url(../../assets/index/hasChild.png);
}

.el-tabs__nav-wrap:after {
	height: 0;
}

.commonBottom {
	flex: 1;
	border-radius: 0 0 8px 8px;
	padding-top: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
}
</style>

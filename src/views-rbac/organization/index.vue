<template>
	<div class="organizationPage">
		<left-slider
			title="组织机构"
			:is-add="isAdd"
			@add-modal="addNewOrganization"
			ref="LeftSliderRef"
			@clickFunCallback="clickFunCallback"
			@initUseFun="initUseFun"
			:defaultProps="{ label: 'name' }"
			:highlightCurrent="true"
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
					<!-- <span
						:class="{
							comImgIco: true,
							nochild: !data?.isParent,
							haschild: data?.isParent,
						}"
					></span> -->
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

		<div
			class="mainOrganization"
			v-if="mainFormData._d_id"
		>
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
								@click="editNewOrganization"
								>修改</el-button
							>

							<el-popconfirm
								title="确定删除该条数据?"
								@confirm="DeleteCompany"
								confirm-button-text="确认"
								cancel-button-text="取消"
								width="180"
							>
								<template #reference>
									<el-button
										type="primary"
										:icon="Delete"
										>删除</el-button
									>
								</template>
							</el-popconfirm>
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
						<el-col :span="16"
							><div class="formItem">
								<span class="itemLabel">电子邮件</span>
								<span>{{ mainFormData.d_email }}</span>
							</div>
						</el-col>
						<!-- <el-col :span="8"
							><div class="formItem">
								<span class="itemLabel">上级单位</span>
								<span>上级单位</span>
							</div>
						</el-col> -->
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
		<add-modal-user
			:title="addModalTitle"
			ref="AddModalUserRef"
		></add-modal-user>
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
import AddModalUser from 'coms/add-modal-user/index.vue'
import RbacEditModal from 'coms/rbac-edit-modal/index.vue'
import { rbacEnums, rbacUseEnums } from '@/enums/rbacEnums'
import { querydeptmenu, deletedept, queryisadmin } from 'api/rbac'
import { nextTick, Ref, ref } from 'vue'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import CompanyList from './component-4-this/CompanyList.vue'
import AuthUserList from './component-4-this/AuthUserList.vue'
import type { pageTypeType, elseFormType } from '@/types/rbac/organization'
import rbacFun from '@/utils/RbacFuns'
import { ElMessage } from 'element-plus'

const LeftSliderRef = ref<InstanceType<typeof LeftSlider>>(null)
const AddModalRef = ref(null)
const AddModalUserRef = ref(null)
const RbacEditModalRef = ref(null)
const companyListRef = ref(null)
const AuthUserListRef = ref(null)

let isAdd = ref(false)

let pageType = ref<pageTypeType>('organization')

const rbacUseCom = rbacFun(LeftSliderRef)
let { title, topLevelId, useSuperId, firstTreeId, mainFormData } = rbacUseCom

let addModalTitle = ref('')

let userUseForm = ref<Partial<elseFormType>>({})

const changePageType = (type: pageTypeType, elseForm: Partial<elseFormType> = {}) => {
	console.log(type, 'type')

	pageType.value = type
	userUseForm.value = elseForm
	// if (type == 'organization') {
	// 	rbacUseCom.returnTitle(useSuperId.value || firstTreeId.value, 'organization')
	// }
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
		dd_superdid = rbacUseCom.getCurrentNodeData()?.id || firstTreeId.value
	}

	addModalTitle.value = name
	useSuperId.value = dd_superdid
	let traslateForm = {}
	if (type == 'organization') {
		traslateForm = { dd_superdid }
	} else {
		traslateForm = { u_did: dd_superdid }
	}

	console.log(type, 'type')
	if (type == 'user') {
		AddModalUserRef.value.open(rbacEnums[type], traslateForm, false, userCallback)
	} else if (type == 'organization') {
		AddModalRef.value.open(rbacEnums[type], traslateForm, false, modalAddCallback)
	}
}

const editNewOrganization = () => {
	const currentNodeData: any = rbacUseCom.getCurrentNodeData()
	const d_id = currentNodeData?.id || firstTreeId.value
	useSuperId.value = d_id
	RbacEditModalRef.value.open(rbacEnums.organization, { d_id }, false, modalEditCallback)
}

const initUseFun = (data) => {
	querydeptmenu({}).then((res) => {
		const resultRes = res.data || []
		data.value = resultRes.map((item) => ({ ...item, isLeaf: !item.isParent }))

		topLevelId.value = resultRes?.[0]?.parentId || rbacUseEnums.topLevelCompany
		firstTreeId.value = resultRes?.[0]?.id
		if (resultRes.length) {
			rbacUseCom.returnTitle(useSuperId.value || firstTreeId.value, 'organization')
			rbacUseCom.useRbacFilterTree('getComponentRef')?.setCurrentKey(useSuperId.value || firstTreeId.value)
		}
	})
}

const modalAddCallback = (apiResult) => {
	console.log(apiResult, 'apiResult')

	rbacUseCom.updateOrganization(addCallback, apiResult)
}

const modalEditCallback = (apiResult) => {
	if (apiResult.workflow_id == rbacEnums.organization) {
		const thisNode = rbacUseCom.getNodeById(apiResult.id)
		thisNode.data.name = apiResult.d_name
	}
	rbacUseCom.updateOrganization(addCallback, apiResult)
}
const useCallback = (apiResult = null) => {
	// console.log(useSuperId.value, 'useSuperId')
	nextTick(() => {
		pageType.value == 'user' && changePageType('organization')
		// !apiResult && rbacUseCom.changeCompanyForm(useSuperId.value, 'organization')
		const trueId = apiResult?.id || useSuperId.value || firstTreeId.value
		rbacUseCom.returnTitle(trueId, 'organization')
		companyListRef.value?.changePage()
	})
}
const addCallback = (data: Ref<any[]> = ref([]), apiResult: any) => {
	const dd_superdid = useSuperId.value.toString()
	const formData = { deptId: dd_superdid }
	rbacUseCom.addCallback(data, apiResult, querydeptmenu, formData, useCallback)
}

const clickFunCallback = async (clickItem, data) => {
	clickItem.rbacType = 'organization'
	const formData = { deptId: clickItem.id }

	console.log(rbacUseCom.useRbacFilterTree('getComponentRef'), rbacUseCom.useRbacFilterTree('getComponentRef').store.nodesMap, 'getComponentRef')

	rbacUseCom.clickFunCallback(clickItem, data, querydeptmenu, formData, useCallback)
}

const DeleteCompany = () => {
	const currentNodeData: any = rbacUseCom.getCurrentNodeData()
	const d_id = currentNodeData?.id || firstTreeId.value
	// useSuperId.value = d_id
	console.log(currentNodeData, 'currentNodeData')

	deletedept({ did: d_id }).then((res) => {
		if (res.code == 1) {
			ElMessage.success('删除成功')
			const trueId = currentNodeData.parentId || topLevelId.value
			const selfCallback = (data: Ref<any[]> = ref([]), apiResult: any) => {
				const formData = { deptId: trueId }
				rbacUseCom.deleteCallback(data, { ...apiResult, workflow_id: rbacEnums.organization, id: trueId }, querydeptmenu, formData, useCallback)
			}
			rbacUseCom.updateOrganization(selfCallback, { deptId: trueId })
		}
	})
}

queryisadmin().then((res) => {
	isAdd.value = res.data
})
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
	background-image: url(../../assets/index/ico_dy.png);
}

.haschild {
	background-image: url(../../assets/index/ico_dy.png);
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
	overflow: hidden;
}
</style>

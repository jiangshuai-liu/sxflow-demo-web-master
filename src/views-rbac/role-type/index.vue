<template>
	<div class="organizationPage">
		<left-slider
			title="角色管理"
			ref="LeftSliderRef"
			@clickFunCallback="clickFunCallback"
			@initUseFun="initUseFun"
			:highlightCurrent="true"
			:defaultProps="{ label: 'name' }"
		>
			<template #default="{ data, RbacTreeRef }">
				<span>
					<span
						:class="{
							comImgIco: true,
							nochildJs: !data?.isType,
							haschildJs: data?.isType,
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

		<RoleTypeList
			v-if="isType && (useSuperId || firstTreeId)"
			:title
			:company-id="useSuperId || firstTreeId"
			@add-new-organization="addNewOrganization"
			@edit-new-organization="editNewOrganization"
			@delete-callback="deleteCallback"
			ref="RoleTypeListRef"
		></RoleTypeList>
		<RoleInfo
			v-else-if="!isType && (useSuperId || firstTreeId)"
			:title
			:company-id="useSuperId || firstTreeId"
			@edit-new-organization="editNewOrganization"
			@delete-callback="deleteCallback"
			ref="RoleInfoRef"
		></RoleInfo>

		<add-modal
			:title="dialogTitle"
			ref="AddModalRef"
		></add-modal>
		<rbac-edit-modal
			:title="dialogEditTitle"
			ref="RbacEditModalRef"
		>
		</rbac-edit-modal>
	</div>
</template>
<script setup lang="ts">
import _ from 'lodash'
import LeftSlider from 'coms/use-diy-tree/LeftSlider.vue'
import RoleTypeList from './component-4-this/RoleTypeList.vue'
import RoleInfo from './component-4-this/RoleInfo.vue'
import { rbacEnums, rbacUseEnums } from '@/enums/rbacEnums'
import AddModal from 'coms/add-modal/index.vue'
import RbacEditModal from 'coms/rbac-edit-modal/index.vue'
import type { pageTypeType } from '@/types/rbac/RoleType'
import { queryroletypelist } from 'api/rbac'
import { Ref, ref, nextTick } from 'vue'
import rbacFun from '@/utils/RbacFuns'

const LeftSliderRef = ref<InstanceType<typeof LeftSlider>>(null)
const AddModalRef = ref(null)
const RbacEditModalRef = ref(null)
const RoleTypeListRef = ref(null)
const RoleInfoRef = ref(null)

const rbacUseCom = rbacFun(LeftSliderRef)

let { title, topLevelId, useSuperId, firstTreeId } = rbacUseCom

let dialogTitle = ref('')
let dialogEditTitle = ref('')
let isType = ref(true)

const addNewOrganization = (type: pageTypeType, name: string) => {
	//添加
	const currentNodeData: any = rbacUseCom.getCurrentNodeData()
	const dd_superdid = currentNodeData?.id || firstTreeId.value
	useSuperId.value = dd_superdid
	dialogTitle.value = name
	let traslateForm = {}

	if (type == 'roleType') {
		traslateForm = { rt_superid: dd_superdid }
	} else {
		traslateForm = { r_rtid: dd_superdid }
	}
	// console.log(currentNodeData, 'currentNodeData', traslateForm)
	AddModalRef.value.open(rbacEnums[type], traslateForm, false, modalAddCallback)
}

const editNewOrganization = (type: pageTypeType, name: string) => {
	const currentNodeData: any = rbacUseCom.getCurrentNodeData()
	const dd_superdid = currentNodeData?.parentId || topLevelId.value
	const d_id = currentNodeData?.id || firstTreeId.value
	useSuperId.value = d_id // dd_superdid
	dialogEditTitle.value = name
	let traslateForm = {}

	if (type == 'roleType') {
		traslateForm = { rt_id: d_id }
	} else {
		traslateForm = { r_nid: d_id }
	}
	RbacEditModalRef.value.open(rbacEnums[type], traslateForm, false, modalEditCallback)
}

const initUseFun = (data) => {
	queryroletypelist({}).then((res) => {
		const resultRes = res.data || []
		data.value = resultRes.map((item) => ({ ...item, isLeaf: !item.isParent }))
		topLevelId.value = resultRes?.[0].parentId || rbacUseEnums.topLevelCompany
		firstTreeId.value = resultRes?.[0].id
		returnTitle(useSuperId.value || firstTreeId.value)
		rbacUseCom.useRbacFilterTree('getComponentRef')?.setCurrentKey(useSuperId.value || firstTreeId.value)
	})
}

const modalAddCallback = (apiResult) => {
	rbacUseCom.updateOrganization(addCallback, apiResult)
	useCallback()
}

const modalEditCallback = (apiResult) => {
	console.log(apiResult, 'modalEditCallback')
	const thisNode = rbacUseCom.getNodeById(apiResult.id)
	if (apiResult.workflow_id == rbacEnums.roleType) {
		thisNode.data.name = apiResult.rt_name
	}
	// isType.value = apiResult.workflow_id == rbacEnums.roleType

	// else if (apiResult.workflow_id == rbacEnums.role) {
	// 	// thisNode.data.name = apiResult.rt_name
	// }
	rbacUseCom.updateOrganization(addCallback, apiResult)
}

//角色如果有父级  父级就是角色类别
const deleteCallback = () => {
	const currentNodeData: any = rbacUseCom.getCurrentNodeData()
	const dd_superdid = currentNodeData?.parentId || topLevelId.value
	// rbacUseCom.updateOrganization()
	// addCallback()
	//删除之后直接跳到父级  父级必定是角色类别
	//这里是在非顶级的情况
	// const topNode = rbacUseCom.getNodeById(currentNodeData?.parentId)?.data?.children?.[0] || { isParent: true }
	const selfCallback = (data: Ref<any[]> = ref([]), apiResult: any) => {
		const formData = { rtId: dd_superdid }
		rbacUseCom.deleteCallback(data, { ...apiResult, workflow_id: rbacEnums.roleType, id: dd_superdid }, queryroletypelist, formData, useCallback)
	}
	rbacUseCom.updateOrganization(selfCallback, { rtId: dd_superdid })
}

const returnTitle = (id) => {
	nextTick(() => {
		title.value = rbacUseCom.getNodeById(id)?.data.name
		RoleInfoRef.value?.changeCompanyForm()
	})
}
const useCallback = (apiResult = null) => {
	// console.log(useSuperId.value, 'useSuperId')
	if (apiResult) {
		isType.value = apiResult.workflow_id == rbacEnums.roleType
		returnTitle(apiResult.id)
	}
	nextTick(() => {
		if (isType.value) {
			RoleTypeListRef.value?.init()
		}
		RoleInfoRef.value?.changeCompanyForm()
	})
}
const addCallback = (data: Ref<any[]> = ref([]), apiResult: any) => {
	const dd_superdid = useSuperId.value.toString()
	const formData = { rtId: dd_superdid }

	rbacUseCom.addCallback(data, apiResult, queryroletypelist, formData, useCallback)
}

const clickFunCallback = async (clickItem, data) => {
	// console.log(clickItem, data, 'clickcallback')
	if (clickItem.isType) {
		clickItem.rbacType = 'roleType'
	} else {
		clickItem.rbacType = 'role'
	}
	isType.value = clickItem.isType
	const formData = { rtId: clickItem.id }
	rbacUseCom.clickFunCallback(clickItem, data, queryroletypelist, formData, useCallback)
}
</script>
<style lang="scss" scope>
.organizationPage {
	height: 100%;
	display: flex;
}

.mainRoleManage {
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

.nochildJs {
	background-image: url(../../assets/index/ico_js.png);
}

.haschildJs {
	background-image: url(../../assets/index/ico_jslb.png);
}

.el-tabs__nav-wrap:after {
	height: 0;
}

.commonBottom {
	flex: 1;
	border-radius: 0 0 8px 8px;
	padding-top: 0;
}
</style>

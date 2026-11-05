<template>
	<div class="resoucesPage">
		<left-slider
			title="资源管理"
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
							nochildZy: !data?.isType,
							haschildZy: data?.isType,
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
		<div class="resoucesMain">
			<resouces-type-header
				ref="ResoucesTypeHeaderRef"
				:title
				:company-id="useSuperId || firstTreeId"
				@edit-new-organization="editNewOrganization"
				@delete-callback="deleteCallback"
				v-if="isType && (useSuperId || firstTreeId)"
			></resouces-type-header>

			<resouces-header
				v-else-if="!isType && (useSuperId || firstTreeId)"
				ref="ResoucesHeaderRef"
				:title
				:company-id="useSuperId || firstTreeId"
				@edit-new-organization="editNewOrganization"
				@delete-callback="deleteCallback"
			></resouces-header>

			<common-search-table
				ref="CommonSearchTableRef"
				@add-new-organization="addNewOrganization"
				:company-id="useSuperId || firstTreeId"
			></common-search-table>
		</div>
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
import { rbacEnums, rbacUseEnums } from '@/enums/rbacEnums'
import AddModal from 'coms/add-modal/index.vue'
import RbacEditModal from 'coms/rbac-edit-modal/index.vue'
import type { resoucesType } from '@/types/rbac/resouces'
import { queryobjectmenu, queryisadmin } from 'api/rbac'
import { Ref, ref, nextTick } from 'vue'
import rbacFun from '@/utils/RbacFuns'
import CommonSearchTable from './component-4-this/CommonSearchTable.vue'
import ResoucesTypeHeader from './component-4-this/ResoucesTypeHeader.vue'
import ResoucesHeader from './component-4-this/ResoucesHeader.vue'

const LeftSliderRef = ref<InstanceType<typeof LeftSlider>>(null)
const AddModalRef = ref(null)
const RbacEditModalRef = ref(null)
const ResoucesTypeHeaderRef = ref(null)
const ResoucesHeaderRef = ref(null)
const CommonSearchTableRef = ref(null)

const rbacUseCom = rbacFun(LeftSliderRef)

let { title, topLevelId, useSuperId, firstTreeId } = rbacUseCom

let dialogTitle = ref('')
let dialogEditTitle = ref('')
let isType = ref(true)
let isAdd = ref(false)

const addNewOrganization = (isTop: boolean, type: resoucesType = 'resourceType', name = '新增资源类别') => {
	//添加
	let dd_superdid
	if (isTop) {
		dd_superdid = topLevelId.value
	} else {
		dd_superdid = rbacUseCom.getCurrentNodeData()?.id || firstTreeId.value
	}
	useSuperId.value = dd_superdid
	dialogTitle.value = name
	let traslateForm = {}
	if (type == 'resourceType') {
		// isType.value = true
		traslateForm = {}
	} else {
		// isType.value = false
		traslateForm = { ob_obid: dd_superdid }
	}
	AddModalRef.value.open(rbacEnums[type], traslateForm, false, type == 'resourceType' ? modalAddTypeCallback : modalAddCallback) //userCallback
}

const editNewOrganization = (type: resoucesType, name: string) => {
	const currentNodeData: any = rbacUseCom.getCurrentNodeData()
	const d_id = currentNodeData?.id || firstTreeId.value
	useSuperId.value = d_id // dd_superdid
	dialogEditTitle.value = name
	let traslateForm = {}
	if (type == 'resourceType') {
		traslateForm = { obt_id: d_id }
	} else {
		traslateForm = { ob_id: d_id }
	}
	RbacEditModalRef.value.open(rbacEnums[type], traslateForm, false, modalEditCallback)
}

const initUseFun = (data) => {
	queryobjectmenu({}).then((res) => {
		const resultRes = res.data || []
		data.value = resultRes.map((item) => ({ ...item, isLeaf: !item.isParent }))
		topLevelId.value = resultRes?.[0].parentId || null // rbacUseEnums.topLevelCompany
		firstTreeId.value = resultRes?.[0].id
		returnTitle(useSuperId.value || firstTreeId.value)
		rbacUseCom.useRbacFilterTree('getComponentRef')?.setCurrentKey(useSuperId.value || firstTreeId.value)
	})
}

const modalAddTypeCallback = (apiResult) => {
	rbacUseCom.updateOrganization(addCallback, apiResult)
	useCallback(apiResult)
}

const modalAddCallback = (apiResult) => {
	rbacUseCom.updateOrganization(addCallback, apiResult)
	useCallback(apiResult)
}

const modalEditCallback = (apiResult) => {
	console.log(apiResult, 'modalEditCallback')
	const thisNode = rbacUseCom.getNodeById(apiResult.id)
	if (apiResult.workflow_id == rbacEnums.resourceType) {
		thisNode.data.name = apiResult.obt_name
		isType.value = true
	} else if (apiResult.workflow_id == rbacEnums.resource) {
		isType.value = false
	}
	// else if (apiResult.workflow_id == rbacEnums.role) {
	// 	// thisNode.data.name = apiResult.rt_name
	// }
	rbacUseCom.updateOrganization(addCallback, apiResult)
}

const returnTitle = (id) => {
	nextTick(() => {
		let trueId = id
		// || rbacUseCom.getData() //  '00'
		if (rbacUseCom.getData().length && !id) {
			trueId = rbacUseCom.getData()[0].id
		}

		const data = rbacUseCom.getNodeById(trueId)?.data
		title.value = `${data.name}（${data.id}）`
		console.log(title.value, 'title.value')
		nextTick(() => {
			ResoucesTypeHeaderRef.value?.changeResoucesForm()
			ResoucesHeaderRef.value?.changeResoucesForm()
		})
	})
}
const useCallback = (apiResult = null) => {
	console.log(useSuperId.value, 'useSuperId', apiResult)

	if (apiResult) {
		isType.value = apiResult.workflow_id == rbacEnums.resourceType
		returnTitle(apiResult.id)
	}
	nextTick(() => {
		if (isType.value) {
			CommonSearchTableRef.value?.init()
		}
	})
}
const addCallback = (data: Ref<any[]> = ref([]), apiResult: any) => {
	const dd_superdid = useSuperId?.value?.toString() || null
	const formData = { typeId: dd_superdid }
	rbacUseCom.addCallback(data, apiResult, queryobjectmenu, formData, useCallback)
}

//角色如果有父级  父级就是角色类别
const deleteCallback = () => {
	// debugger
	const currentNodeData: any = rbacUseCom.getCurrentNodeData()
	const dd_superdid = currentNodeData?.parentId || topLevelId.value
	//删除之后直接跳到父级  父级必定是角色类别
	//这里是在非顶级的情况
	const topNode = rbacUseCom.getNodeById(dd_superdid)?.data || { isParent: true, isType: true }

	const type: resoucesType = topNode.isType ? 'resourceType' : 'resource'
	isType.value = topNode.isType

	const selfCallback = (data: Ref<any[]> = ref([]), apiResult: any) => {
		const formData = { typeId: dd_superdid }
		rbacUseCom.deleteCallback(data, { ...apiResult, workflow_id: rbacEnums[type], id: dd_superdid }, queryobjectmenu, formData, useCallback)
	}
	rbacUseCom.updateOrganization(selfCallback, { typeId: dd_superdid })
}

const clickFunCallback = async (clickItem, data) => {
	// console.log(clickItem, data, 'clickcallback')
	isType.value = clickItem.isType
	if (clickItem.isType) {
		clickItem.rbacType = 'resourceType'
	} else {
		clickItem.rbacType = 'resource'
	}
	const formData = { typeId: clickItem.id }
	rbacUseCom.clickFunCallback(clickItem, data, queryobjectmenu, formData, useCallback)
	nextTick(() => {
		returnTitle(clickItem.id)
	})
}

queryisadmin().then((res) => {
	isAdd.value = res.data
})
</script>
<style lang="scss" scope>
.resoucesPage {
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

.nochildZy {
	background-image: url(../../assets/index/ico_zy.png);
}

.haschildZy {
	background-image: url(../../assets/index/ico_zylb.png);
}

.el-tabs__nav-wrap:after {
	height: 0;
}

.commonBottom {
	flex: 1;
	border-radius: 0 0 8px 8px;
	padding-top: 0;
}

.resoucesMain {
	flex: 1;
	margin-left: 16px;
	display: flex;
	flex-direction: column;
}
</style>

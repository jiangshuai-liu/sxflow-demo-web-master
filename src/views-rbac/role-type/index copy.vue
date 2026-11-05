<template>
	<div class="organizationPage">
		<left-slider
			title="角色管理"
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
							nochild: !data?.isType,
							haschild: data?.isType,
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
			v-if="isType"
			:title
			:company-id="useSuperId || firstTreeId"
			@add-new-organization="addNewOrganization"
			@edit-new-organization="editNewOrganization"
			ref="RoleTypeListRef"
		></RoleTypeList>
		<RoleInfo
			v-else
			:title
			:company-id="useSuperId || firstTreeId"
			@edit-new-organization="editNewOrganization"
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

const LeftSliderRef = ref<InstanceType<typeof LeftSlider>>(null)
const AddModalRef = ref(null)
const RbacEditModalRef = ref(null)
const RoleTypeListRef = ref(null)
const RoleInfoRef = ref(null)
let title = ref('')
let topLevelId = ref<number | string>(null) //最高级id
let useSuperId = ref<number | string>(null) //当前渲染页面id
let firstTreeId = ref<number | string>(null) //第一级第一个id
let dialogTitle = ref('')
let dialogEditTitle = ref('')
let isType = ref(true)

const activeName = ref('userlist')

const addNewOrganization = (type: pageTypeType, name: string) => {
	//添加组织机构
	const dd_superdid = useRbacFilterTree('getComponentRef').getCurrentNode()?.id || firstTreeId.value
	useSuperId.value = dd_superdid
	dialogTitle.value = name
	let traslateForm = {}
	if (type == 'roleType') {
		traslateForm = { rt_superid: dd_superdid }
	} else {
		traslateForm = { r_rtid: dd_superdid }
	}
	AddModalRef.value.open(rbacEnums[type], traslateForm, false, modalAddCallback)
}

const editNewOrganization = (type: pageTypeType, name: string) => {
	const currentNodeData: any = useRbacFilterTree('getComponentRef').getCurrentNode()
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
	if (isType.value) {
		RoleTypeListRef.value.init()
	}
}

const modalEditCallback = (apiResult) => {
	console.log(apiResult, 'modalEditCallback')
	const thisNode = useRbacFilterTree('getComponentRef')?.getNode(apiResult.id)
	if (apiResult.workflow_id == rbacEnums.roleType) {
		thisNode.data.name = apiResult.rt_name
	}
	// else if (apiResult.workflow_id == rbacEnums.role) {
	// 	// thisNode.data.name = apiResult.rt_name
	// }
	updateOrganization(addCallback, apiResult)
}

const returnTitle = (id) => {
	nextTick(() => {
		title.value = useRbacFilterTree('getComponentRef')?.getNode(id)?.data.name

		RoleInfoRef.value?.changeCompanyForm()
	})
}

const addCallback = (data: Ref<any[]> = ref([]), apiResult: any) => {
	const dd_superdid = useSuperId.value.toString()
	const formData = { rtId: dd_superdid }
	queryroletypelist(formData).then((res) => {
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
	// console.log(clickItem, data, 'clickcallback')
	isType.value = clickItem.isType
	const selfFunction = () => {
		const formData = { rtId: clickItem.id }
		queryroletypelist(formData).then((res) => {
			const apiData = res.data
			const useData = apiData.map((item) => ({ ...item, isLeaf: !item.isParent }))
			useRbacFilterTree('getComponentRef').updateKeyChildren(clickItem.id, useData)
			useRbacFilterTree('getSelfTree').changeTreeItemExpanded(clickItem.id, true)
		})
	}

	!clickItem.children.length && selfFunction()
	title.value = clickItem.name

	useSuperId.value = useRbacFilterTree('getComponentRef').getCurrentNode()?.id

	nextTick(() => {
		RoleInfoRef.value?.changeCompanyForm()
	})
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
}
</style>

<template>
	<div class="securityAdminPage">
		<left-slider
			title="安全管理"
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
							nochild: !data?.isParent,
							haschild: data?.isParent,
						}"
					></span>
					<span
						class="name"
						@mouseover="RbacTreeRef.onMouseOver($event, { ...data, name: data.name + '管理员' })"
						@mouseenter="RbacTreeRef.enterDelay()"
						@mouseleave="RbacTreeRef.leaveDelay()"
					>
						{{ data.name + '管理员' }}
					</span>
				</span>
			</template>
		</left-slider>
		<div class="securityAdminMain">
			<div class="organizationTabs">
				<el-tabs
					v-model="activeName"
					class="demo-tabs"
					@tab-click="handleClick"
				>
					<el-tab-pane
						v-for="item in tabList"
						:key="item.name"
						:label="item.label"
						:name="item.name"
					></el-tab-pane>
				</el-tabs>
				<!-- {{ useSuperId }} -->
				<assign-admin
					ref="AssignAdminRef"
					v-if="activeName == 'assignadmin' && useSuperId"
					:company-id="useSuperId"
				></assign-admin>
				<auth-role-type
					ref="AuthRoleTypeRef"
					v-else-if="activeName == 'authroletype' && useSuperId"
					:company-id="useSuperId"
				></auth-role-type>
				<auth-resouce-type
					ref="AuthResouceTypeRef"
					v-else-if="activeName == 'authresoucetype' && useSuperId"
					:company-id="useSuperId"
				></auth-resouce-type>
				<auth-system
					ref="AuthSystemRef"
					v-else-if="activeName == 'authsystem' && useSuperId"
					:company-id="useSuperId"
				></auth-system>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import _ from 'lodash'
import LeftSlider from 'coms/use-diy-tree/LeftSlider.vue'
import { querydepttree } from 'api/rbac'
import { Ref, ref, nextTick } from 'vue'
import rbacFun from '@/utils/RbacFuns'
import { adminActType, tabItemType } from '@/types/rbac/SecurityAdmin'
import AssignAdmin from './component-4-this/AssignAdmin.vue'
import AuthRoleType from './component-4-this/AuthRoleType.vue'
import AuthResouceType from './component-4-this/AuthResouceType.vue'
import AuthSystem from './component-4-this/AuthSystem.vue'

const LeftSliderRef = ref<InstanceType<typeof LeftSlider>>(null)
const AssignAdminRef = ref<InstanceType<typeof AssignAdmin>>(null)
const AuthRoleTypeRef = ref<InstanceType<typeof AuthRoleType>>(null)
const AuthResouceTypeRef = ref<InstanceType<typeof AuthResouceType>>(null)
const AuthSystemRef = ref<InstanceType<typeof AuthSystem>>(null)

const rbacUseCom = rbacFun(LeftSliderRef)

let { topLevelId, useSuperId, firstTreeId } = rbacUseCom
let activeName = ref<adminActType>('assignadmin')

const tabList: tabItemType[] = [
	{
		label: '指派管理员',
		name: 'assignadmin',
	},
	{
		label: '授权角色类别',
		name: 'authroletype',
	},
	{
		label: '授权资源类别',
		name: 'authresoucetype',
	},
	// {
	// 	label: '授权系统权限',
	// 	name: 'authsystem',
	// },
]

const handleClick = (tab) => {
	console.log(tab, 'tab')
}

const initUseFun = (data) => {
	querydepttree({}).then((res) => {
		const resultRes = res.data || []
		data.value = resultRes.map((item) => ({ ...item, isLeaf: !item.isParent }))
		topLevelId.value = resultRes?.[0].parentId || null // rbacUseEnums.topLevelCompany
		firstTreeId.value = resultRes?.[0].id
		rbacUseCom.useRbacFilterTree('getComponentRef')?.setCurrentKey(useSuperId.value || firstTreeId.value)
		useSuperId.value = firstTreeId.value
	})
}

const clickFunCallback = async (clickItem, data) => {
	useSuperId.value = clickItem.id
}
</script>
<style lang="scss" scope>
.securityAdminPage {
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
	margin: 0;
	height: 100%;
	padding-bottom: 0;
	display: flex;
	flex-direction: column;
	overflow: auto;
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

.securityAdminMain {
	flex: 1;
	margin-left: 16px;
	display: flex;
	flex-direction: column;
}
</style>

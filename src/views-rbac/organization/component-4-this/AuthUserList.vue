<template>
	<div class="authUserListPage">
		<user-info
			@go-back="goBack"
			:user-use-form="userUseForm"
			:company-id="useSuperId || firstTreeId"
		></user-info>
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
		</div>
		<!-- <user-info
			v-if="activeName == 'userinfo'"
			@go-back="goBack"
			:user-use-form="userUseForm"
			:company-id="useSuperId || firstTreeId"
		></user-info> -->

		<auth-role
			v-if="activeName == 'authrole' || activeName == 'userinfo'"
			:user-use-form="userUseForm"
			@go-back="goBack"
			:company-id="useSuperId || firstTreeId"
		></auth-role>
		<change-company
			v-else
			@go-back="goBack"
			:user-use-form="userUseForm"
			:company-id="useSuperId || firstTreeId"
		></change-company>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import UserInfo from './UserInfo.vue'
import AuthRole from './AuthRole.vue'
import ChangeCompany from './ChangeCompany.vue'
import type { propsTypeDelCompany, pageTypeType, elseFormType, roleTabType } from '@/types/rbac/organization'
const props = withDefaults(defineProps<Partial<propsTypeDelCompany>>(), {})

console.log(props, 'Pickprops')

let activeName = ref<roleTabType>(props.userUseForm.tabType)
const tabList = [
	// {
	// 	label: '用户基本信息',
	// 	name: 'userinfo',
	// },
	{
		label: '用户授权角色',
		name: 'authrole',
	},
	{
		label: '更改单位',
		name: 'changecompany',
	},
]
const emits = defineEmits<{
	changePageType: [type: pageTypeType, elseForm?: elseFormType]
}>()

const handleClick = (tab) => {
	console.log(tab, 'tab')
}

const goBack = () => {
	emits('changePageType', 'organization')
}
</script>
<style lang="scss" scoped>
.authUserListPage {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
}

.commonBottom {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.organizationTabs {
	margin-top: 0;
	height: auto;
}
</style>

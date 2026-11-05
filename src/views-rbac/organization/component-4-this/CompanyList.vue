<template>
	<div class="CompanyListPage">
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
		<user-list
			ref="userListRef"
			v-if="activeName == 'userlist' && (useSuperId || firstTreeId)"
			@add-new-organization="addNewOrganization"
			@change-page-type="changePageType"
			:company-id="useSuperId || firstTreeId"
		></user-list>
		<auth-user
			ref="authUserRef"
			v-if="activeName == 'authuser'"
			:company-id="useSuperId || firstTreeId"
		></auth-user>
		<user-sort
			ref="userSortRef"
			v-if="activeName == 'usersort'"
			:company-id="useSuperId || firstTreeId"
		></user-sort>
		<company-sort
			ref="companySortRef"
			v-if="activeName == 'companysort'"
			:company-id="useSuperId || firstTreeId"
		></company-sort>
	</div>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'
import UserList from './UserList.vue'
import UserSort from './UserSort.vue'
import AuthUser from './AuthUser.vue'
import CompanySort from './CompanySort.vue'
import type { propsTypePickDouble, companyActType, pageTypeType, elseFormType } from '@/types/rbac/organization'
const props = withDefaults(defineProps<Partial<propsTypePickDouble>>(), {})
const companySortRef = ref(null)
const userSortRef = ref(null)
const userListRef = ref(null)
const authUserRef = ref(null)
let activeName = ref<companyActType>('userlist')
const tabList = [
	{
		label: '用户列表',
		name: 'userlist',
	},
	{
		label: '授权角色',
		name: 'authuser',
	},
	{
		label: '用户排序',
		name: 'usersort',
	},
	{
		label: '子单位排序',
		name: 'companysort',
	},
]

const emits = defineEmits<{
	addNewOrganization: [isTop: boolean, type: pageTypeType, name: string]
	changePageType: [type: pageTypeType, elseForm?: elseFormType]
}>()

const addNewOrganization = (isTop: boolean, type: pageTypeType, name: string) => {
	emits('addNewOrganization', isTop, type, name)
}

const changePageType = (type: pageTypeType, elseForm?: elseFormType) => {
	emits('changePageType', type, elseForm)
}

const handleClick = (tab) => {
	console.log(tab, 'tab')
}

const changePage = () => {
	console.log('changePagechangePagechangePagechangePage', props.useSuperId || props.firstTreeId)

	if (activeName.value == 'companysort') {
		nextTick(() => {
			companySortRef.value.init()
		})
	} else if (activeName.value == 'usersort') {
		nextTick(() => {
			userSortRef.value.init()
		})
	} else if (activeName.value == 'userlist') {
		nextTick(() => {
			userListRef.value.init()
		})
	} else if (activeName.value == 'authuser') {
		nextTick(() => {
			authUserRef.value.init()
		})
	}
}
const userCallback = () => {
	userListRef.value.changeList()
}

defineExpose({
	changePage,
	userCallback,
})
</script>
<style lang="scss" scoped>
.CompanyListPage {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
}
.organizationTabs {
	height: auto;
}
</style>

<template>
	<div class="RoleInfo mainRoleManage">
		<div class="organizationHeader">
			<rbac-title :title="returnUseTitle">
				<template #titleBtn>
					<div class="btns">
						<el-button
							type="primary"
							:icon="EditPen"
							@click="editClick('role', '修改角色')"
						>
							修改
						</el-button>

						<el-button
							v-if="mainFormData.r_useful == '1'"
							type="primary"
							:icon="Delete"
							@click="closeUser('1')"
						>
							启用
						</el-button>
						<el-button
							type="primary"
							:icon="Delete"
							v-else
							@click="closeUser('0')"
						>
							禁用
						</el-button>
					</div>
				</template>
			</rbac-title>

			<div class="formShow">
				<el-row :gutter="20">
					<!-- <el-col :span="8"
						><div class="formItem">
							<span class="itemLabel">所属角色类别</span>
							<span>{{ mainFormData.r_rtid }}</span>
						</div>
					</el-col> -->
					<el-col :span="12"
						><div class="formItem">
							<span class="itemLabel">角色描述</span>
							<span>{{ mainFormData.r_desc }}</span>
						</div>
					</el-col>
					<el-col :span="12"
						><div class="formItem">
							<span class="itemLabel">是否缺省</span>
							<span>{{ mainFormData.r_defaultflag == '0' ? '否' : mainFormData.r_defaultflag == '1' ? '是' : '' }}</span>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
		<div class="organizationTabs">
			<el-tabs
				v-model="activeName"
				class="demo-tabs"
				@tab-click="handleClick"
			>
				<el-tab-pane
					label="授权单位"
					name="authcompany"
				></el-tab-pane>
				<el-tab-pane
					label="授权用户"
					name="authuser"
				></el-tab-pane>
				<el-tab-pane
					label="授权资源"
					name="authresources"
				></el-tab-pane>
			</el-tabs>
		</div>
		<AuthCompany
			:company-id="props.companyId"
			v-if="activeName == 'authcompany'"
		></AuthCompany>
		<AuthUser
			v-if="activeName == 'authuser'"
			:company-id="props.companyId"
		></AuthUser>
		<AuthResources
			v-if="activeName == 'authresources'"
			:company-id="props.companyId"
		></AuthResources>
	</div>
</template>
<script setup lang="ts">
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import { commonHook, commonFormFun } from '@bksx/sxflow'
import AuthCompany from './AuthCompany.vue'
import AuthResources from './AuthResources.vue'
import AuthUser from './AuthUser.vue'
import type { propsType, pageTypeType } from '@/types/rbac/RoleType'
import { queryfillingdatabyid, querysignverification } from 'api/useCommon'
import { ref, onMounted } from 'vue'
import { rbacEnums } from '@/enums/rbacEnums'
import { updateroleuseful } from 'api/rbac'
import { ElMessage } from 'element-plus'
const props = withDefaults(defineProps<propsType>(), {})

const emits = defineEmits<{
	editNewOrganization: [type: pageTypeType, name: string]
	deleteCallback: []
}>()

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

let returnUseTitle = ref('')

const activeName = ref('authcompany')
const changeCompanyForm = async () => {
	const commonFormObj = { id: props.companyId, workflow_id: rbacEnums.role }
	returnUseTitle.value = props.title
	await queryfillingdatabyid(commonFormObj).then((res) => {
		// console.log(res.data, 'useresdata')

		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		mainFormData.value = commonForm.mainFormDatas
	})
	await querysignverification(commonFormObj).then((res) => {
		let authTitle = ''
		if (res.code == 4) {
			authTitle = res.msg
		} else {
			authTitle = ''
		}
		if (authTitle) {
			returnUseTitle.value = `${props.title}（${authTitle}）`
		}
	})
}

const handleClick = (tab) => {
	// console.log(tab, 'tab')
}

const editClick = (type: pageTypeType, name) => {
	emits('editNewOrganization', type, name)
}

// onMounted(() => {
// 	changeCompanyForm(props.companyId)
// })

const closeUser = (status: string) => {
	updateroleuseful({ status: status, uidList: [props.companyId as string] }).then((res) => {
		const statusName = status == '0' ? '禁用' : '启用'
		if (res.code == 1) {
			ElMessage.success(`${statusName}成功`)
			// changeCompanyForm()
			emits('deleteCallback')
		} else {
			ElMessage.error(`${statusName}失败`)
		}
	})
}

defineExpose({
	changeCompanyForm,
})
</script>
<style lang="scss" scoped>
.organizationHeader,
.organizationTabs,
.commonBottom {
	// height: 100%;
	background: #ffffff;
	border-radius: 8px;
	padding: 16px 24px;
	box-sizing: border-box;
}

.organizationTabs {
	padding-bottom: 0;
	border-radius: 8px 8px 0 0 !important ;
	height: auto;
}
</style>

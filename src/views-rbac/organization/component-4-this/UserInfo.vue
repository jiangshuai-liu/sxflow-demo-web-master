<template>
	<!-- <div class="commonBottom"> -->
	<div class="organizationHeader">
		<!-- <pre>{{ fileContent }}</pre> -->
		<rbac-title :title="mainFormData.u_name">
			<template #titleBtn>
				<div class="btns">
					<el-button
						type="primary"
						:icon="EditPen"
						@click="editUser"
						>修改</el-button
					>
					<el-popconfirm
						title="确定删除该条数据?"
						@confirm="deleteUser"
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
					<el-button
						type="primary"
						:icon="RefreshLeft"
						@click="emits('goBack')"
						>返回</el-button
					>
				</div>
			</template>
		</rbac-title>

		<!-- 用户基本信息 -->
		<div class="userInfoMain">
			<el-row :gutter="20">
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">姓名</span>
						<span>{{ mainFormData.u_name }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">性别</span>
						<span>{{ mainFormData.u_sex == '1' ? '男' : '女' }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">缺省单位</span>
						<span>{{ mainFormData.d_comment1 }}</span>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">登录用户名</span>
						<span>{{ mainFormData.u_nickname }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">口令</span>
						<span>{{ mainFormData.u_pwd }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">公钥</span>
						<span>{{ mainFormData.u_key }}</span>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">CA证书</span>
						<span>{{ mainFormData.u_caid }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">IP地址</span>
						<span>{{ mainFormData.u_ip }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">主机号</span>
						<span>{{ mainFormData.u_host }}</span>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">掩码</span>
						<span>{{ mainFormData.u_mmask }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">电子邮箱</span>
						<span>{{ mainFormData.u_email }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">身份证</span>
						<span>{{ mainFormData.u_cardid }}</span>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">固定电话</span>
						<span>{{ mainFormData.u_phone }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">手机号码</span>
						<span>{{ mainFormData.u_mp }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">地址</span>
						<span>{{ mainFormData.u_address }}</span>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">邮编</span>
						<span>{{ mainFormData.u_zip }}</span>
					</div>
				</el-col>
				<el-col :span="16"
					><div class="formItem">
						<span class="itemLabel">备注</span>
						<span>{{ mainFormData.u_comment1 }}</span>
					</div>
				</el-col>
			</el-row>
		</div>
		<rbac-edit-modal
			title="修改用户"
			ref="RbacEditModalRef"
		>
		</rbac-edit-modal>
	</div>

	<!-- </div> -->
</template>
<script setup lang="ts">
import { Delete, EditPen, RefreshLeft } from '@element-plus/icons-vue'
import { querydesensitizedfillingdatabyid } from '@/api/useCommon'
import { rbacEnums } from '@/enums/rbacEnums'
import { deleterole } from '@/api/rbac'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import RbacEditModal from 'coms/rbac-edit-modal-user/index.vue'
import { ref } from 'vue'
import { commonHook, commonFormFun } from '@bksx/sxflow'
import type { propsTypePickDoubleInfo } from '@/types/rbac/organization'
import { ElMessage } from 'element-plus'
const props = withDefaults(defineProps<propsTypePickDoubleInfo>(), {})

const emits = defineEmits<{
	goBack: []
}>()
const fileContent = ref('This is the content of the simulated file.\nIt has multiple lines.')
const RbacEditModalRef = ref(null)
const {
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

// querydesensitizedfillingdatabyid({ id: props.userUseForm.id, workflow_id: rbacEnums.user }).then((res) => {
// 	const commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
// 	mainFormData.value = commonForm.mainFormDatas
// })
const init = () => {
	querydesensitizedfillingdatabyid({ id: props.userUseForm.id, workflow_id: rbacEnums.user }).then((res) => {
		const commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		mainFormData.value = commonForm.mainFormDatas
	})
}

const editUser = () => {
	RbacEditModalRef.value.open(rbacEnums.user, { u_id: props.userUseForm.id }, false, () => {
		emits('goBack')
	})
}

const deleteUser = () => {
	deleterole({ uid: props.userUseForm.id }).then((res) => {
		if (res.code == 1) {
			ElMessage.success(res.msg || '删除成功')
			emits('goBack')
		}
	})
}
init()
</script>
<style lang="scss" scoped>
.changeBtns {
	display: flex;
	justify-content: center;
	align-items: center;
}

.userInfoMain {
	flex: 1;
	margin-top: 10px;
}

.formItem {
	word-break: break-all;
	min-height: 32px;
	height: auto;
	display: flex;
	align-items: flex-start;
}

span {
	display: inline-block;
}

.organizationHeader {
	// height: 184px;
	background: #ffffff;
	border-radius: 8px;
	padding: 16px 24px;
	box-sizing: border-box;
	margin-bottom: 10px;
}
</style>

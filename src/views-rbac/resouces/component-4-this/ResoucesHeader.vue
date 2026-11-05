<template>
	<div class="ResoucesTypeHeader">
		<rbac-title :title="returnUseTitle">
			<template #titleBtn>
				<div class="btns">
					<el-button
						type="primary"
						:icon="EditPen"
						@click="editClick('resource', '修改资源')"
					>
						修改
					</el-button>

					<el-popconfirm
						title="确定删除该条数据?"
						@confirm="onDelete"
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
						<span class="itemLabel">资源名称</span>
						<span>{{ mainFormData.ob_name }}</span>
					</div>
				</el-col>
				<el-col :span="16"
					><div class="formItem">
						<span class="itemLabel">资源描述</span>
						<span>{{ mainFormData.ob_desc }}</span>
					</div>
				</el-col>
				<!-- <el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">所属上一级资源</span>
						<span>{{ mainFormData.ob_obid }}</span>
					</div>
				</el-col> -->
				<!-- <el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">资源属性</span>
						<span>{{ mainFormData.obt_comment1 }}</span>
					</div>
				</el-col> -->
			</el-row>
			<!-- <el-row :gutter="20">
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">资源属性</span>
						<span>{{ mainFormData.obt_comment1 }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">所属资源类别</span>
						<span>{{ mainFormData.ob_btid }}</span>
					</div>
				</el-col>
				<el-col :span="8"
					><div class="formItem">
						<span class="itemLabel">操作名称</span>
						<span>{{ mainFormData.attri }}</span>
					</div>
				</el-col>
			</el-row> -->
		</div>
	</div>
</template>
<script lang="ts" setup>
import { Delete, EditPen } from '@element-plus/icons-vue'
import type { resoucesType, propsType } from '@/types/rbac/resouces'
import RbacTitle from '@/components/rbac-common/RbacTitle.vue'
import { commonHook, commonFormFun } from '@bksx/sxflow'
import { queryfillingdatabyid, querysignverification } from 'api/useCommon'
import { rbacEnums } from '@/enums/rbacEnums'
import { deleteobject } from 'api/rbac'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const emits = defineEmits<{
	editNewOrganization: [type: resoucesType, name: string]
	deleteCallback: []
}>()
const props = withDefaults(defineProps<propsType>(), {
	title: '',
})

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

const changeResoucesForm = async () => {
	// console.log(props, 'propspropspropsprops')
	const commonFormObj = { id: props.companyId, workflow_id: rbacEnums.resource }
	returnUseTitle.value = props.title

	await queryfillingdatabyid(commonFormObj).then((res) => {
		// console.log(res.data, 'useresdata')

		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		mainFormData.value = commonForm.mainFormDatas
	})
	await querysignverification(commonFormObj).then((res) => {
		// console.log(res.data, 'querysignverification')
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
const editClick = (type: resoucesType, name) => {
	emits('editNewOrganization', type, name)
}

const onDelete = () => {
	deleteobject({ did: props.companyId as string }).then((res) => {
		if (res.code == 1) {
			ElMessage.success('删除成功')
			emits('deleteCallback')
		}
	})
}

defineExpose({
	changeResoucesForm,
})
</script>
<style lang="scss" scoped>
.ResoucesTypeHeader {
	flex-shrink: 0;
	background: #ffffff;
	border-radius: 8px 8px 0 0;
	padding: 16px 24px 0;
	box-sizing: border-box;
}
</style>

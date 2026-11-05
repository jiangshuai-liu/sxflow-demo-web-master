<template>
	<div class="ResoucesTypeHeader">
		<rbac-title :title="returnUseTitle">
			<template #titleBtn>
				<div class="btns">
					<el-button
						type="primary"
						:icon="EditPen"
						@click="editClick('resourceType', '修改资源类别')"
					>
						修改
					</el-button>
					<el-popconfirm
						title="确定删除该条数据?"
						@confirm="deleteType"
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
				<el-col :span="24"
					><div class="formItem">
						<span class="itemLabel">备注</span>
						<span>{{ mainFormData.obt_comment1 }}</span>
					</div>
				</el-col>
			</el-row>
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
import { ElMessage } from 'element-plus'
import { deleteobjecttype } from 'api/rbac'
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
	const commonFormObj = { id: props.companyId, workflow_id: rbacEnums.resourceType }
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
const editClick = (type: resoucesType, name) => {
	emits('editNewOrganization', type, name)
}

const deleteType = () => {
	deleteobjecttype({ did: props.companyId as string }).then((res) => {
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

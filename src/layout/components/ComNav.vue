<template>
	<div class="UseNavPage">
		<div class="UseNavTitle">
			<img
				:src="changeClose"
				:class="{ changeClose: true, isRotate: !app.sidebar.opened }"
				@click="app.toggleSidebar"
			/>
		</div>
		<div class="rightBox">
			<el-dropdown
				class="avatar-container right-menu-item hover-effect"
				trigger="click"
			>
				<div class="avatar-wrapper">
					<img
						:src="userTitle"
						class="user-avatar"
					/>
					<span class="userName">{{ internalData.$cookies.get('username') }} </span>
					<span class="deptName">{{ internalData.$cookies.get('deptname') }} </span>
					<CaretBottom style="width: 0.6em; height: 0.6em; margin-left: 5px" />
				</div>

				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="changePwdDailog"> 修改密码 </el-dropdown-item>
						<el-dropdown-item
							divided
							@click="logout"
						>
							{{ $t('navbar.logout') }}
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
		<el-dialog
			v-model="dialogVisible"
			title="修改密码"
			width="40%"
			@closed="handleClose(ruleFormRef)"
		>
			<el-form
				ref="ruleFormRef"
				:model="ruleForm"
				:rules="rules"
				label-width="120px"
			>
				<el-form-item
					label="旧密码:"
					prop="oldPassword"
				>
					<el-input
						type="password"
						v-model="ruleForm.oldPassword"
						placeholder="旧密码"
						show-password
					>
					</el-input>
				</el-form-item>
				<el-form-item
					label="新密码:"
					prop="newPassword"
				>
					<el-input
						type="password"
						v-model="ruleForm.newPassword"
						placeholder="请输入密码"
						show-password
						maxlength="16"
						minlength="8"
					>
					</el-input>

					<div class="intensity">
						<span class="psdText">密码强度</span>
						<span
							class="line"
							:class="[level.includes('low') ? 'low' : '']"
						></span>
						<span
							class="line"
							:class="[level.includes('middle') ? 'middle' : '']"
						></span>
						<span
							class="line"
							:class="[level.includes('high') ? 'high' : '']"
						></span>
						<!-- <div class="warningtext">
              密码应由6-16位数字、字母、符号组成。请不要使用容易被猜到的密码
            </div> -->
					</div>
				</el-form-item>
				<el-form-item
					label="确认密码:"
					prop="confirmPassword"
				>
					<el-input
						type="password"
						v-model="ruleForm.confirmPassword"
						placeholder="确认密码"
						show-password
						maxlength="16"
						minlength="8"
					>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="submitForm(ruleFormRef)"
						>确定</el-button
					>
					<el-button @click="resetForm(ruleFormRef)">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import { ref, useAttrs, reactive } from 'vue'
import { computed, getCurrentInstance } from 'vue'
import smcrypto from 'sm-crypto'
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
import { ElMessageBox } from 'element-plus'
import useStore from '@/store'
import emitter from '@/utils/emitter'
// 图标依赖
import { CaretBottom } from '@element-plus/icons-vue'
const attrs = useAttrs()
const { app } = useStore()
const internalInstance = getCurrentInstance()
const internalData = internalInstance.appContext.config.globalProperties
const userTitle = new URL(`../../assets/index/userTitle.png`, import.meta.url).href
const changeClose = new URL(`../../assets/index/changeClose.png`, import.meta.url).href
let dialogVisible = ref(false)
function logout() {
	ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		if (import.meta.env.VITE_APP_OUTURL) {
			window.location.href = import.meta.env.VITE_APP_OUTURL
		} else {
			router.push('/')
		}
	})
}

const changePwdDailog = () => {
	dialogVisible.value = !dialogVisible.value
}

const ruleForm = reactive({
	newPassword: '',
	confirmPassword: '',
	oldPassword: '',
})
const handleClose = (eForm) => {
	resetForm(eForm)
	dialogVisible.value = false
}
// 校验密码
const checkPassword = (rule, value, callback) => {
	let regex = null
	if (import.meta.env.VITE_APP_PASSWORD_REG == 'true') {
		regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&()_+=\-[\]{};':"\\|,.<>/?])[A-Za-z0-9~!@#$%^&()_+=\-[\]{};':"\\|,.<>/?]{8,16}$/
	} else {
		regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9~!@#$%^&()_+=\-[\]{};':"\\|,.<>/?]{8,16}$/
	}

	level.value = []
	// 校验是数字
	const regex1 = /^\d+$/
	// 校验字母
	const regex2 = /^[A-Za-z]+$/
	// 校验符号
	const regex3 = /^[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+$/
	if (regex1.test(value)) {
		level.value.push('low')
	} else if (regex2.test(value)) {
		level.value.push('low')
	} else if (regex3.test(value)) {
		level.value.push('low')
	} else if (/^[A-Za-z\d]+$/.test(value)) {
		level.value.push('low')
		level.value.push('middle')
	} else if (/^[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\d]+$/.test(value)) {
		level.value.push('low')
		level.value.push('middle')
	} else if (/^[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z]+$/.test(value)) {
		level.value.push('low')
		level.value.push('middle')
	} else if (/^[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z\d]+$/.test(value)) {
		level.value.push('low')
		level.value.push('middle')
		level.value.push('high')
	}

	if (!regex.test(value)) {
		const returnTip =
			import.meta.env.VITE_APP_PASSWORD_REG == 'true'
				? '密码应由8-16位数字、大小写字母、符号（密码中不允许输入*）组成。'
				: '密码应由8-16位数字、大小写字母（密码中不允许输入*）组成。'

		return callback(returnTip)
	} else {
		return callback()
	}
}
// 确认密码
const checkConfirmPassword = (rule, value, callback) => {
	if (!value) {
		return callback('请输入确认密码')
	}
	if (value != ruleForm.newPassword) {
		return callback('两次密码输入不一致，请重新输入')
	}
	return callback()
}
const rules = reactive<FormRules>({
	oldPassword: [
		{
			required: true,
			message: '请输入旧密码',
			trigger: 'blur',
		},
	],
	newPassword: [{ required: true, validator: checkPassword, trigger: ['change', 'blur'] }],
	confirmPassword: [
		{
			required: true,
			validator: checkConfirmPassword,
			trigger: 'blur',
		},
	],
})
const level = ref([])
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return

	await formEl.validate((valid, fields) => {
		if (valid) {
			axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/getKey`).then((res) => {
				const useData = res.data.data
				//对密码加密
				const useOldPwd = '04' + smcrypto.sm2.doEncrypt(ruleForm.oldPassword, useData.publicKey)
				const useNewPwd = '04' + smcrypto.sm2.doEncrypt(ruleForm.confirmPassword, useData.publicKey)

				let formData = new FormData()
				formData.append('oldPwd', useOldPwd)
				formData.append('newPwd', useNewPwd)
				formData.append('keyid', useData.keyId)
				axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/changePwd`, formData).then((res) => {
					if (res.data.code == 1) {
						dialogVisible.value = false
						resetForm(formEl)
						router.push('/')
					} else {
						ElMessage.error(res.data.msg)
						resetForm(formEl)
					}
				})
			})
		} else {
			console.log('error submit!', fields)
		}
	})
}

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
}
</script>
<style lang="scss" scoped>
.UseNavPage {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 56px;
	padding: 8px 16px;
	box-sizing: border-box;
	background: #ffffff;
}

.UseNavTitle {
	flex-shrink: 0;
	color: #303133;
	font-family: Microsoft YaHei UI, Microsoft YaHei UI;
	font-weight: bold;
	font-size: 20px;
	color: #606266;
	display: flex;
	align-items: center;
}

.changeClose {
	width: 24px;
	height: 24px;
	transform: rotate(180deg);
	cursor: pointer;
}

.rightBox {
	display: flex;
	align-items: center;
}

.avatar-container {
	margin-right: 30px;
	line-height: 2.5; //new

	.avatar-wrapper {
		margin-top: 5px;
		position: relative;
		cursor: pointer;
		display: flex;
		align-items: center;

		.user-avatar {
			cursor: pointer;
			width: 32px;
			height: 32px;
			border-radius: 10px;
			margin-right: 16px;
		}

		.el-icon-caret-bottom {
			cursor: pointer;
			position: absolute;
			right: -20px;
			top: 25px;
			font-size: 12px;
		}
	}
}

.isRotate {
	transform: rotate(0deg);
}

.userName {
	font-weight: 400;
	font-size: 14px;
	color: #303133;
}

.deptName {
	font-weight: 400;
	font-size: 12px;
	color: #606266;
	margin-left: 16px;
}

.show_pwd {
	cursor: pointer;
	user-select: none;
	padding-right: 5px;
}
.intensity {
	.psdText {
		font-size: 14px;
		margin-right: 10px;
	}
	.line {
		display: inline-block;
		width: 48px;
		height: 4px;
		background: #d8d8d8;
		border-radius: 3px;
		margin-right: 8px;
		&.low {
			background: #f4664a;
		}
		&.middle {
			background: #ffb700;
		}
		&.high {
			background: #2cbb79;
		}
	}
	.level {
		margin: 0 16px 0 8px;
	}
	.warningtext {
		color: #5a5a5a;
		font-size: 12px;
		margin-top: 5px;
	}
}
</style>

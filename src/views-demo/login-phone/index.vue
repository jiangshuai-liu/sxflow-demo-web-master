<template>
	<el-container>
		<el-main>
			<img
				src="@/assets/title.png"
				alt="bksx"
				class="Logo"
			/>
			<!-- <img src="@/assets/pic.png" alt="图片" class="picture" /> -->
			<el-form
				:model="form"
				style="max-width: 460px"
				ID="fm1"
				ref="ruleFormRef"
				:rules="rules"
			>
				<div class="loginHead">
					欢迎登录
					<div>WELCOME TO LOGIN</div>
				</div>
				<el-form-item prop="nickname">
					<template #label>
						<div class="lableForm">
							<img
								src="@/assets/yhm.png"
								alt=""
							/>
						</div>
					</template>
					<el-input
						id="loginUser"
						v-model="form.nickname"
						placeholder="请输入手机号"
					/>
				</el-form-item>

				<el-form-item prop="smsPin">
					<template #label>
						<div class="lableForm">
							<img
								src="@/assets/pw.png"
								alt=""
							/>
						</div>
					</template>
					<div class="smsPinClass">
						<el-input
							v-model="form.smsPin"
							placeholder="请输入验证码"
						/>

						<el-button
							v-if="!showNum"
							@click="onShowYzm('blockPuzzle', ruleFormRef)"
							>获取验证码</el-button
						>
						<el-button v-else>{{ count }}</el-button>
					</div>
				</el-form-item>
				<el-button
					class="loginBtn"
					:disabled="disabled"
					@click.prevent="login(ruleFormRef)"
					>登录</el-button
				>
			</el-form>
		</el-main>
		<Verify
			@success="success"
			mode="pop"
			:captchaType="captchaType"
			:imgSize="{ width: '330px', height: '155px' }"
			ref="verify"
		></Verify>
	</el-container>
</template>

<script setup lang="ts">
import Verify from 'coms/verifition/Verify.vue'
import type { FormInstance } from 'element-plus'
import axios from 'axios'
import smcrypto from 'sm-crypto'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { queryresources } from 'api/useCommon'
const router = useRouter()
const route = useRoute()
const ruleFormRef = ref(null)
const form = reactive({
	nickname: '',
	captchaVerification: '',
	smsPin: '',
})
const verify = ref(null) //注册验证码
const captchaType = ref('') //验证码种类
const showNum = ref(false)
const count = ref(60)
let timer = null

const rules = reactive<any>({
	nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
})

const disabled = ref(false)
onMounted(async () => {
	//进入页面首先调用logout接口
	await axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/logout`, {})
	// $cookies.remove('isLogin')
	// $cookies.remove('username')
	// $cookies.remove('deptname')
	// $cookies.remove('companyid')
	// $cookies.remove('userid')
})

//点击登录按钮
const login = async (formEl) => {
	await formEl.validate((valid, fields) => {
		if (valid) {
			if (form.nickname) {
				const useForm = {
					nickname: form.nickname,
					smsPin: form.smsPin,
				}
				axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/smsLogin`, useForm).then((res) => {
					if (res.data.code == '1') {
						disabled.value = true
						$cookies.set('username', res.data.data.name)

						queryresources({}).then((routeArr) => {
							if (route.query?.redirect) {
								window.location.href = route.query.redirect
							} else {
								console.log(routeArr.data)
								if (routeArr.data.length) {
									router.replace(routeArr.data[0].url)
								} else {
									ElMessage.error('您没有权限登录系统！')
								}
								// router.replace('/workbench')
							}
						})
					} else if (res.data.code == '0') {
						ElMessage.error(res.data.msg)
					}
				})
			} else {
				ElMessage.error('请输入用户名或密码')
			}
		} else {
			console.log('error submit!', fields)
		}
	})
}

//点击登录按钮显示验证码
const onShow = async (formEl) => {
	await formEl.validate((valid, fields) => {
		if (valid) {
			// 'blockPuzzle',
			let formData = new FormData()
			formData.append('phone', form.nickname)
			formData.append('captchaVerification', form.captchaVerification)
			axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/getSmsPin`, formData).then((res) => {
				console.log(res, 'resresresresresresresresres')
				if (res.data.code == 1) {
					showNum.value = true
					rules.smsPin = [{ required: true, message: '请输入验证码', trigger: 'blur' }]
					setTimeout(() => {
						ruleFormRef.value.clearValidate()
					}, 500)
					timer = setInterval(() => {
						count.value--
						if (count.value == 0) {
							showNum.value = false
							count.value = 60
							delete rules.smsPin
							clearInterval(timer)
						}
					}, 1000)
				} else {
					ElMessage.error(res.data.msg)
				}
			})
		} else {
			console.log('error submit!', fields)
		}
	})
}
//点击登录按钮显示验证码
const onShowYzm = async (type, formEl) => {
	await formEl.validate((valid, fields) => {
		if (valid) {
			captchaType.value = type
			verify.value.show()
		} else {
			console.log('error submit!', fields)
		}
	})
}
//验证码成功回调
const success = async (res) => {
	form.captchaVerification = res.captchaVerification
	await onShow(ruleFormRef.value)
}
</script>

<style lang="scss" scoped>
.el-container {
	height: 100%;
	width: 100%;
	background: url('@/assets/bg.png') no-repeat center center;
	background-size: 100% 100%;
}
.lableForm img {
	width: 20px;
	height: 20px;
	margin: 0 15px;
}

.Logo {
	position: absolute;
	top: 45px;
	left: 180px;
	width: 600px;
	height: 96px;
}
.picture {
	position: absolute;
	top: 98px;
	left: 302px;
	width: 707px;
	height: 708px;
}

.loginHead {
	margin-top: 30px;
	font-size: 32px;
	color: #000000;
	text-align: center;
	div {
		margin: 11px 0 48px 0;
		font-size: 12px;
	}
}
.el-form {
	box-sizing: border-box;
	position: absolute;
	bottom: 50%;
	right: 10%;
	transform: translateY(50%);
	width: 442px;
	height: 460px;
	background: rgba(255, 255, 255, 0.8);
	border: 1px solid #ffffff;
	border-radius: 9px;
	box-shadow: 0 8px 21px 0 rgb(45 189 193 / 38%);
}
.el-form-item {
	position: relative;
	width: 334px;
	height: 56px;
	margin: 0 auto 23px;
	border: 1px solid #cccccc;
	border-radius: 4.662px;
	background: rgba(255, 255, 255, 0.8);
}
::v-deep(.el-form-item__label) {
	height: 100%;
}
.lableForm {
	height: 100%;
	display: flex;
	align-items: center;
}

::v-deep(.el-input__inner) {
	border: none;
	outline: none;
}
::v-deep(.el-input__wrapper) {
	box-shadow: none;
	&:hover {
		box-shadow: none;
	}
}
.is-focus {
	box-shadow: none;
}
.loginBtn {
	margin: 0 auto;
	width: 334px;
	height: 56px;
	background: #eb423f;
	border-radius: 4px 4px 4px 4px;
	cursor: pointer;
	display: block;
	color: #fff;
	font-weight: bold;
	font-size: 17.5px;
	border-radius: 5.25px;
}
::v-deep(.el-form-item__label:before) {
	display: none;
}

.smsPinClass {
	display: flex;
	justify-content: space-between;

	.el-button {
		height: 100%;
	}
}
</style>

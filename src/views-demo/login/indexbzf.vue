<template>
	<el-container>
		<el-main>
			<img
				src="@/assets/title_zhglxt@2x.png"
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
						placeholder="请输入用户名"
					/>
				</el-form-item>
				<el-form-item prop="password">
					<template #label>
						<div class="lableForm">
							<img
								src="@/assets/pw.png"
								alt=""
							/>
						</div>
					</template>
					<el-input
						id="loginpPassword"
						v-model="form.password"
						type="password"
						show-password
						placeholder="请输入密码"
					/>
				</el-form-item>
				<el-button
					:disabled="disabled"
					@click.prevent="onShow('blockPuzzle', ruleFormRef)"
					>登录</el-button
				>
			</el-form>

			<div class="bottom">
				技术支持：
				<div class="logoMini"></div>
				北京北控三兴信息技术有限公司
			</div>
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
	password: '',
	captchaVerification: '',
})
const rules = reactive({
	nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
const verify = ref(null) //注册验证码
const captchaType = ref('') //验证码种类
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
const login = async () => {
	if (form.nickname && form.password) {
		axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/getKey`).then((reso) => {
			const useData = reso.data.data
			//对密码加密
			const usePwd = '04' + smcrypto.sm2.doEncrypt(form.password, useData.publicKey)
			let formData = new FormData()
			formData.append('nickname', form.nickname)
			formData.append('password', usePwd)
			formData.append('keyid', useData.keyId)

			formData.append('captchaVerification', form.captchaVerification)
			axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/captchaLogin`, formData).then((res) => {
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
		})
	} else {
		ElMessage.error('请输入用户名或密码')
	}
}

//点击登录按钮显示验证码
const onShow = async (type, formEl) => {
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
	await login()
}
</script>

<style lang="scss" scoped>
.el-container {
	height: 100%;
	width: 100%;
	background: url('@/assets/bg.png') no-repeat center center;
	background-size: 100% 100%;
	position: relative;
}
.bottom {
	position: absolute;
	bottom: 24px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	font-size: 16px;
	color: #000000;
	.logoMini {
		background-image: url(../../assets/ico_bksx@2x.png);
		width: 20px;
		height: 20px;
		background-size: 20px 20px;
		margin: 0 8px 0 16px;
	}
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
	width: 800px;
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
	margin-top: 50px;
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
.el-button {
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
</style>

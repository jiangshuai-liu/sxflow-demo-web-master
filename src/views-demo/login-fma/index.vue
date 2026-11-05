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
				<template v-if="isLogin">
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
								<div class="lableTitle">
									<p>用户名</p>
									<p>USER</p>
								</div>
							</div>
						</template>
						<el-input
							id="strCertID"
							v-model="form.nickname"
						/>
					</el-form-item>
					<el-form-item prop="password">
						<template #label>
							<div class="lableForm">
								<img
									src="@/assets/pw.png"
									alt=""
								/>
								<div class="lableTitle">
									<p>密码</p>
									<p>PASSWORD</p>
								</div>
							</div>
						</template>
						<el-input
							v-model="form.password"
							type="password"
							show-password
						/>
					</el-form-item>
					<el-button @click.prevent="login">登录</el-button>
				</template>

				<DetailTip
					@changeLogin="changeLogin"
					:nickname="form.nickname"
					:password="form.password"
					v-else
					ref="detailTip"
				/>
			</el-form>
		</el-main>
	</el-container>
</template>

<script setup lang="ts">
import DetailTip from './DetailTip.vue'
import axios from 'axios'
import smcrypto from 'sm-crypto'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted, nextTick } from 'vue'
const ruleFormRef = ref(null)
let detailTip = ref()
const form = reactive({
	nickname: '',
	password: '',
})

const rules = reactive({
	nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const isLogin = ref(true)
onMounted(async () => {
	//进入页面首先调用logout接口
	await axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/logout`, {})
	$cookies.remove('username')
	$cookies.remove('deptname')
	$cookies.remove('companyid')
	$cookies.remove('userid')
})

const changeLogin = () => {
	isLogin.value = true
}

//点击登录按钮
const login = async () => {
	if (form.nickname && form.password) {
		//点击登录之后调用二维码接口  看一下人员是否记录在库
		axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/getKey`).then((reso) => {
			const useData = reso.data.data
			//对密码加密
			const usePwd = '04' + smcrypto.sm2.doEncrypt(form.password, useData.publicKey)
			axios({
				method: 'GET',
				url: `${import.meta.env.VITE_APP_CAS_API}/cas/api/micAuthBind`,
				params: {
					nickname: form.nickname,
					password: usePwd,
					keyid: useData.keyId,
				},
			})
				.then(function (res) {
					if (res.data.code == '1') {
						isLogin.value = !isLogin.value
						$cookies.set('username', res.data.data.name)
						if (res.data.msg !== '已绑定') {
							nextTick(() => {
								detailTip.value.init(res.data.data)
							})
						}
					} else {
						ElMessage.error(res.data.msg)
					}
				})
				.catch(function (error) {
					console.log(error)
				})
		})
	} else {
		ElMessage.error('请输入用户名或密码')
	}
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
.lableTitle {
	width: 55px;
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
	margin-top: 50px;
	font-size: 32px;
	color: #008789;
	text-align: center;
	div {
		margin: 11px 0 48px 0;
		font-size: 12px;
	}
}
.el-form {
	box-sizing: border-box;
	position: absolute;
	top: 227px;
	right: 339px;
	width: 442px;
	height: 490px;
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
	border: 1px solid #009999;
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
	.lableTitle {
		display: flex;
		flex-direction: column;
		height: 100%;

		p {
			height: 16px;
			margin: 0;
			line-height: 40px;
			font-size: 12px;

			color: #009999;
			&:first-child {
				font-size: 16px;
				font-weight: bold;
			}
		}
	}
}
.zw0_login_username {
	border: none;
	background-color: transparent;
	font-weight: bold;
	-webkit-appearance: none;
	width: 50%;
	font-size: 14px;
	outline: none;
	text-align: center;
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
	display: block;
	background: linear-gradient(90deg, #009999 0%, #00e6e3 100%);
	font-size: 17.5px;
	border-radius: 5.25px;
	height: 46.648px;
	line-height: 33.32px;
	color: #fff;
	font-weight: bold;
}
.lg-info-wrap {
	position: absolute;
	left: 357px;
	right: 0;
	bottom: 30px;
	p {
		margin: 0;
	}
	& > div {
		display: inline-block;
		margin-right: 55.278px;
		font-size: 9.324px;
		color: rgba(255, 255, 255, 0.6);
		& > div {
			margin-bottom: 6.66px;
		}
		span {
			display: block;
			font-size: 7.992px;
		}
	}
	.lf-dzyx-info {
		margin-right: 0;
	}
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
	bottom: 140px;
	right: 180px;
	width: 442px;
	height: 490px;
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
	.lableTitle {
		display: flex;
		flex-direction: column;
		height: 100%;

		p {
			height: 16px;
			margin: 0;
			line-height: 40px;
			font-size: 12px;

			color: #909399;
			&:first-child {
				font-size: 16px;
				font-weight: bold;
			}
		}
	}
}
.zw0_login_username {
	border: none;
	background-color: transparent;
	font-weight: bold;
	-webkit-appearance: none;
	width: 50%;
	font-size: 14px;
	outline: none;
	text-align: center;
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
}

::v-deep(.el-form-item__label:before) {
	display: none;
}
</style>

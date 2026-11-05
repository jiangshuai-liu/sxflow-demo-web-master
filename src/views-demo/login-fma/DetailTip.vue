<template>
	<div class="DetailTips">
		<p
			class="goback"
			@click="handleNodeClick"
		>
			<el-icon><ArrowLeftBold /></el-icon> <span> 返回</span>
		</p>
		<div
			class="useImg"
			v-if="isImg"
		>
			<!-- <p class="slmps">
        请使用Microsoft Authenticator扫描二维码，点击右上角图标 -> 添加账户 ->
        其他账户 扫码绑定，绑定完成后请点击确定按钮
      </p> -->
			<!-- <p class="slmps">
				<a
					href="https://support.microsoft.com/zh-cn/account-billing/%E4%B8%8B%E8%BD%BD%E5%B9%B6%E5%AE%89%E8%A3%85microsoft-authenticator%E5%BA%94%E7%94%A8-351498fc-850a-45da-b7b6-27e523b8702a"
					target="_blank"
					>点击跳转</a
				>官网下载Microsoft Authenticator，打开软件，点击右上角图标 -> 添加账户 -> 其他账户 扫码绑定，在输完验证码成后点击确定按钮
			</p> -->

			<p class="slmps">请使用“腾讯身份验证器”微信小程序或app扫描二维码激活。</p>

			<vue-qr
				class="vueQr"
				:text="text"
				:size="size"
			/>
			<validcode
				class="validcode"
				ref="code"
				:maxlength="6"
				:isPwd="false"
				@finish="getCode"
			></validcode>
			<el-button
				class="saveSubmit"
				@click="submitLogin"
				:disabled="disabled"
				>确定</el-button
			>
			<!-- <el-button class="btnewm sure" @click="changeImg(false)">确定</el-button> -->
		</div>
		<div
			class="unUseImg"
			v-else
		>
			<p class="blodp">请输入您的六位验证码</p>
			<p class="slmp">
				若您的账户已删除，或更换手机，请联系工作人员
				<!-- 若您还未进行账户关联，请到应用商店下载 “Microsoft Authenticator”
        应用软件，点击绑定按钮进行绑定操作。
        <el-button
          class="btnewm"
          @click="changeImg(true)"
          >绑定
          </el-button> -->
			</p>

			<validcode
				class="validcode validcodes"
				ref="code"
				:maxlength="6"
				:isPwd="false"
				@finish="getCode"
			></validcode>
			<el-button
				class="saveSubmit saveSubmits"
				@click="submitLogin"
				:disabled="disabled"
				>提交登录</el-button
			>
		</div>
	</div>
</template>
<script setup>
import axios from 'axios'
import smcrypto from 'sm-crypto'
import validcode from './validcode.vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import VueQr from 'vue-qr/src/packages/vue-qr.vue' // Vue3.x引入方法
import { reactive, ref, onMounted, nextTick, computed, toRefs } from 'vue'
const props = defineProps({
	nickname: String,
	password: String,
})
const disabled = ref(false)
const router = useRouter()
const route = useRoute()
const { nickname, password } = toRefs(props)
const text = ref('')
const size = ref('200')
const emits = defineEmits(['handleNodeClick'])
const handleNodeClick = (e) => {
	emits('changeLogin')
}
const isImg = ref(false)
let code = ref() //注册验证码组件
const secret = ref('') //验证码输入值
//控制显示那个页面
const changeImg = (e) => {
	isImg.value = e
}
//清空重置验证码
const clearCode = () => {
	code.value.clear()
}
//获取验证码输入结果
const getCode = (e) => {
	secret.value = e
}
//点击登录按钮
const submitLogin = () => {
	console.log('提交登录')
	if (secret.value) {
		axios.post(`${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_CAS_API}/cas/api/getKey`).then((reso) => {
			const useData = reso.data.data
			//对密码加密
			const usePwd = '04' + smcrypto.sm2.doEncrypt(password.value, useData.publicKey)
			axios({
				method: 'GET',
				url: `${import.meta.env.VITE_APP_CAS_API}/cas/api/micAuthLogin`,
				params: {
					nickname: nickname.value,
					password: usePwd,
					secret: secret.value,
					keyid: useData.keyId,
				},
			})
				.then(function (res) {
					if (res.data.code == '1') {
						disabled.value = true
						// sessionStorage.setItem('username' , res.data.data.name)
						$cookies.set('username', res.data.data.name)
						$cookies.set('ssoToken', res.data.data.ssoToken)

						// console.log(res.data.data.name);
						// return
						if (route.query?.redirect) {
							window.location.href = route.query.redirect
						} else {
							router.push('/workbench')
							// window.location.href = 'http://130.10.7.41:9527'
							//window.location.href = 'http://130.10.8.98:80/oa/'
						}
					} else {
						ElMessage.error(res.data.msg)
						clearCode()
					}
				})
				.catch(function (error) {
					console.log(error)
				})
		})
	} else {
		ElMessage.error('请输入验证码')
	}
}
//初始化页面
const init = (e) => {
	text.value = e
	isImg.value = true
}
//抛出事件
defineExpose({
	init,
})
</script>
<style lang="scss" scoped>
.goback {
	cursor: pointer;
	color: #000000;
	display: flex;
	align-items: center;
	padding-left: 5px;
	border-bottom: 1px solid #00000026;
	height: 50px;
	line-height: 50px;
	margin: 0;
	span {
		padding-left: 5px;
	}
}
.sure {
	margin-top: 40px;
}
.vueQr {
	border-radius: 4px;
	background: #ffffff;
	border: 1px solid #cccccc;
}

.DetailTips {
	width: 100%;
	height: 100%;
	border-radius: 5px;
	overflow: hidden;
}
.unUseImg,
.useImg {
	position: relative;
	padding: 20px 5px 0 0;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.useImg {
	padding: 5px 0 0 0;
}
.ewm {
	position: absolute;
	width: 40px;
	right: 0;
	overflow: hidden;
}
.ewmMark {
	width: 40px;
	height: 40px;
	clip-path: polygon(0 0, 100% 100%, 100% 100%, 0 100%);
	background: #ffffff;
}
.blodp {
	width: 408px;
	color: #666666;
	font-family: Source Han Sans CN;
	font-weight: bold;
	font-size: 24px;
	margin: 28px auto 0;
}
.slmp {
	width: 408px;
	color: #000000e5;
	font-family: Source Han Sans CN;
	font-weight: regular;
	font-size: 16px;
	line-height: normal;
	letter-spacing: 0px;
	margin: 32px auto 0;
}
.slmps {
	width: 408px;
	color: #000000e5;
	font-family: Source Han Sans CN;
	font-weight: regular;
	font-size: 16px;
	line-height: normal;
	letter-spacing: 0px;
	margin: 5px auto 5px;
	text-indent: 32px;
}
.btnewm {
	border: 1px solid #018c8d;
	color: #018c8d;
}
.validcode {
	margin-top: 20px;
}
.saveSubmit {
	margin-top: 20px;
	// width: 408px;
	// height: 64px;
	border-radius: 6px;
	// background: linear-gradient(90deg, #009999 0%, #00e6e3 100%);
	background: #eb423f;
	box-shadow: 0px 3px 9px 0px #0087893f;
	color: #ffffff;
	font-family: Source Han Sans CN;
	// font-weight: bold;
	// font-size: 18px;

	width: 300px;
	height: 56px;
	cursor: pointer;
}

.saveSubmits {
	margin-top: 60px;
}

.validcodes {
	margin-top: 60px;
}
</style>

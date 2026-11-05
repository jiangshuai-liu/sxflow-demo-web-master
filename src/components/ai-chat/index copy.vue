<template>
	<div class="dailog">
		<div class="dragen"></div>
		<div
			class="close"
			@click="sendMessage('change-theme')"
		></div>
		<!-- <button @click="sendMessage('change-theme')">向父页面发送消息</button> -->
		<div class="titleBox">
			<p>京经智策</p>
			<p>游客1340，欢迎您</p>
		</div>
		<div
			class="messageBox"
			ref="talkInfo"
		>
			<div class="talkBox">
				<div class="logoTitle">
					<img
						src="@/assets/LOGOBig.png"
						alt=""
					/>
					<p class="help">欢迎使用政务服务助手</p>
					<p class="service">由百度文心大模型提供服务</p>
				</div>
				<div class="talkInfo">
					<template
						v-for="(item, index) in messageList"
						:key="index"
					>
						<div
							class="userInfo"
							v-if="item.role == 'USER'"
						>
							<p>{{ item.content }}</p>
							<div class="userIco"></div>
						</div>
						<div
							class="botInfo"
							v-else
						>
							<template v-if="item.error">
								<div class="userIco"></div>
								<p class="errorMessage"><span></span>政务助手在开小差，请稍后重新提问</p>
							</template>
							<template v-else>
								<template v-if="!item.load">
									<div class="userIco"></div>
									<div class="boxTalkBox">
										<div
											class="infoType fir"
											v-if="item.topic"
										>
											<span></span>
											已为您定位事项：{{ item.topic }}
										</div>
										<div class="infoType sec"><span></span>您咨询的问题答案：</div>
										<p>
											<span>
												{{ item.content }}
											</span>

											<!-- <one-words :content="item.content"></one-words> -->

											<!-- <template v-if="item?.intentions.length">
												<ul type="disc">
													<li
														@click="clickValue(arr, 'INTENTION')"
														v-for="(arr, index) in item.intentions"
														:key="index + 'intentions'"
														class="intentionsItem"
													>
														{{ arr }}
													</li>
												</ul>
											</template> -->
										</p>

										<div class="messageSource">
											<div class="clickValue">
												<!--  v-if="item.messageSources.length" -->
												<template v-if="item?.messageSources?.length">
													<!-- <b class="ly"> -->
													来源：

													<div class="wrapper">
														<input
															id="exp1"
															class="exp"
															type="checkbox"
														/>
														<div class="text">
															<label
																class="btn"
																for="exp1"
															></label>

															<b
																v-for="(arr, index) in item.messageSources"
																:key="index"
																@click="toUrl(arr)"
															>
																{{ `${arr.title}` }}
															</b>
														</div>
													</div>
												</template>
											</div>

											<div class="figerBtns">
												<img
													v-if="item.upvote == 2 || item.upvote == 0"
													src="@/assets/Thumbs-up.png"
													alt=""
													@click="ThumbsUp(item, 1)"
												/>
												<img
													v-if="item.upvote == 1"
													src="@/assets/Thumbs-up-active.png"
													alt=""
													@click="ThumbsUp(item, 1)"
												/>
												<img
													v-if="item.upvote == 2 || item.upvote == 1"
													src="@/assets/Thumbs-down.png"
													alt=""
													@click="ThumbsUp(item, 0)"
												/>
												<img
													v-if="item.upvote == 0"
													src="@/assets/Thumbs-down-active.png"
													alt=""
													@click="ThumbsUp(item, 0)"
												/>
											</div>
										</div>
									</div>
								</template>
								<template v-else>
									<div class="userIco"></div>
									<div class="boxTalkBox">
										<div class="infoType sec"><span></span>正在思考中...</div>
									</div>
								</template>
							</template>
						</div>
					</template>
				</div>
			</div>
			<div class="inputInline">
				<div
					class="clearAdvice"
					v-if="messageList?.length"
				>
					<div
						class="clear"
						@click="clickClear"
					></div>
					<!-- <div
						class="suggestionBtns"
						v-if="suggestions.length"
					>
						<p
							@click="clickValue(item, 'SUGGESTION')"
							v-for="(item, index) in suggestions"
							:key="index + 'suggestions'"
						>
							{{ item }}
						</p>
					</div> -->
				</div>

				<div class="useInput">
					<div class="animation"></div>
					<el-input
						style="flex: 1"
						v-model="textarea"
						autosize
						type="textarea"
						placeholder="请输入您想要咨询的问题"
						@keydown.enter.native="carriageReturn($event)"
					/>
					<div
						:class="{ submitBtn: true, btnValue: textarea.length }"
						@click="onSubmit"
						v-if="showBtn"
					></div>
					<div
						class="submitBtnDot"
						v-else
					></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { formType } from '@/types/common'
import { chat, upvote } from 'api/dailog'
import sha256 from 'sha256'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import OneWords from './OneWords.vue'

// interface formType {
// 	userInfo: string
// 	content: string
// 	chatType: string
// 	sessionId?: string
// }
let textarea = ref('')
// console.log(chat, upvote)
// sessionId: 'add9c7440a8111ee81a07653ea987c55',
let sessionId = ref('')
let talkInfo = ref()
let messageList = ref<any[]>([])
let showBtn = ref(true)
let suggestions = ref([])

// let currentTopHref = window.top.location.href
// console.log(currentTopHref)
// alert(currentTopHref)
// [
// 	{
// 		role: 'USER',
// 		content: '你好啊',
// 	},
// 	{
// 		role: 'BOT',
// 		content: '你好，我是sxbot很高兴为您服务',
// 		messageSource: '消息来源', //消息来源
// 		intention: '其他',
// 	},
// 	{
// 		role: 'USER',
// 		content: '你好啊',
// 	},
// 	{
// 		role: 'BOT',
// 		content: '你好，我是sxbot很高兴为您服务',
// 		messageSource: '消息来源', //消息来源
// 		intention: '其他',
// 		error: true,
// 	},
// 	{
// 		role: 'USER',
// 		content: '你好啊',
// 	},
// 	{
// 		role: 'BOT',
// 		content: '你好，我是sxbot很高兴为您服务',
// 		messageSource: '消息来源', //消息来源
// 		intention: '其他',
// 	}
// ]

onMounted(() => {
	nextTick(() => {
		// 在外部 Vue 的 window 上添加 postMessage 的监听，并且绑定处理函数 handleMessage
		window.addEventListener('message', handleMessage)
		// 告诉父组件准备好接收消息了
		const x = {
			cmd: 'ready-for-receiving',
		}
		//转化为json字符串，兼容低版本浏览器
		const data = JSON.stringify(x)
		window.parent.postMessage(data, '*')
	})
})

const handleMessage = (event) => {
	// 接受消息
	const x = event.data
	const data = JSON.parse(x)
	switch (data.cmd) {
		case 'Hello-iframe': {
			console.log('来自父页面的消息')
			break
		}
	}
}
const sendMessage = (str) => {
	// 发送消息
	const x = {
		cmd: str,
	}
	const data = JSON.stringify(x)
	window.parent.postMessage(data, '*')
}

const clickClear = () => {
	suggestions.value = []
	messageList.value = []
	sessionId.value = ''
	scrollUp()
}

// 回车不换行 变成发送消息
const carriageReturn = (event) => {
	console.log('enter')

	let e = window.event || arguments[0]
	// 英文下｜中文下： 13 Enter Enter
	// 中文下有文字没进入输入框情况是：299 Enter Enter
	console.log(e)
	if (e.key == 'Enter' && e.code == 'Enter' && e.keyCode == 13) {
		if (!e.ctrlKey && !e.shiftKey) {
			// e.ctrlKey == true证明是ctrl+enter
			e.returnValue = false
			// sureSendWay()
			onSubmit()
			return false
		} else {
			let dIndex = e.srcElement.selectionStart // 光标所在位置
			textarea.value = textarea.value.slice(0, dIndex) + '\n' + textarea.value.slice(dIndex)
			nextTick(() => {
				// 设置光标位置
				e.srcElement.selectionStart = dIndex + 1
				e.srcElement.selectionEnd = dIndex + 1
				console.log(e.srcElement.selectionStart)
			})
		}
	}
}

const toUrl = (item: { url: string | URL }) => {
	item.url && window.open(item.url)
}

const scrollUp = () => {
	nextTick(() => {
		let talkBox = document.getElementsByClassName('talkBox')[0]
		// console.log(talkBox)
		talkBox.scrollTop = 0
	})
}

const scrollBottom = () => {
	nextTick(() => {
		let talkBox = document.getElementsByClassName('talkBox')[0]
		if (talkBox.scrollHeight > talkBox.clientHeight) {
			setTimeout(function () {
				//设置滚动条到最底部
				talkBox.scrollTop = talkBox.scrollHeight
			}, 100)
		}
	})
}

const clickValue = (value: string, type: string) => {
	// console.log(value)

	messageList.value.push({
		role: 'USER',
		content: value,
	})
	showBtn.value = false

	let form: formType = {
		userInfo: 'jingxinzhice_test',
		content: value,
		chatType: type,
		sessionId: sessionId.value,
	}
	if (!sessionId.value) {
		delete form.sessionId
	}
	messageList.value.push({
		role: 'BOT',
		load: true,
	})
	scrollBottom()

	let accountKey = 'c81769a0fee9471188e159963ee8db5e'
	let secretKey = 'dfe231a6a28e43fc9a3567d7d31fdece'
	let requestTime = String(new Date().getTime())
	let requestBody = JSON.stringify(form)
	const encryptedData = sha256(`${accountKey}${secretKey}${requestTime}${requestBody}`)
	// signature: 'application/json;charset=UTF-8',
	// config.headers.requestTime = requestTime
	// config.headers.signature = encryptedData
	let ctrlAbout = new AbortController()
	// let eventSourcepost = fetchEventSource(`${import.meta.env.VITE_APP_BASE_API}/chatStream/agi/api/v1/bot/chatStream`, {
	// console.log(`${import.meta.env.VITE_APP_BASE_API}/smebj/api/chatStream/agi/api/v1/bot/chatStream`)

	let eventSourcepost = fetchEventSource(`${import.meta.env.VITE_APP_BASE_API}/smebj/api/chatStream/agi/api/v1/bot/chatStream`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
			Accept: 'text/event-stream',
			// account: 'c81769a0fee9471188e159963ee8db5e',
			// requestTime: requestTime,
			// signature: encryptedData,
		},
		// signal: ctrlAbout.signal,
		body: JSON.stringify(form),
		// onmessage(event) {
		// 	console.log(event)

		// 	// 成功之后操作
		// 	// this.message += event.data
		// 	// 成功之后满足某些条件可以使用AbortController关闭连接
		// 	ctrlAbout.abort()
		// },
		onopen(response) {
			console.info('eventSource open: ', response)
			return
		},
		onmessage(event) {
			const jsonData = JSON.parse(event.data)
			// let respondTexts = jsonData.delta
			// let finishStatus = jsonData.finished
			console.log('eventSource msg: ', jsonData, event)
			let usedata = jsonData.data
			sessionId.value = usedata.sessionId

			// console.log(messageList.value)
			console.log(usedata)
			if (usedata.code == 1) {
				if (messageList.value[messageList.value.length - 1].role == 'SYSTEM') {
					console.log(messageList.value[messageList.value.length - 1].content)

					messageList.value[messageList.value.length - 1].content += usedata.content
				} else {
					messageList.value.pop()
					messageList.value.push({
						role: usedata.role,
						// content: usedata.content.length ? JSON.parse(usedata.content).data.data.text : '',
						content: usedata.content || '',
						messageSources: usedata.messageSources,
						intentions: usedata.intentions || [],
						messageId: usedata.messageId,
						topic: usedata.topic,
						upvote: 2,
					})
					suggestions.value = usedata.suggestions || []
				}
				console.log(messageList.value)
				scrollBottom()
			} else {
				messageList.value.pop()
				messageList.value.push({
					role: 'BOT',
					error: true,
				})
				scrollBottom()
				showBtn.value = true
			}
		},
		onerror(err) {
			// 服务异常
			console.log('eventSource error: ' + err)
			messageList.value.pop()
			messageList.value.push({ role: 'BOT', error: true })
			scrollBottom()
			showBtn.value = true
		},
		onclose() {
			showBtn.value = true
			// 服务关闭
			console.log('eventSource close')
		},
	})

	return

	chat(form).then((res) => {
		// console.log(res)

		if (res.code == 0) {
			let usedata = res.data[0]
			sessionId.value = usedata.sessionId
			messageList.value.pop()
			messageList.value.push({
				role: usedata.role,
				// content: usedata.content.length ? JSON.parse(usedata.content).data.data.text : '',
				content: usedata.content,
				messageSources: usedata.messageSources,
				intentions: usedata.intentions || [],
				messageId: usedata.messageId,
				topic: usedata.topic,
				upvote: 2,
			})
			suggestions.value = usedata.suggestions || []
			// console.log(messageList.value)
			scrollBottom()
			showBtn.value = true
		} else {
			messageList.value.pop()
			messageList.value.push({ role: 'BOT', error: true })
			scrollBottom()
			showBtn.value = true
		}
	})
}
const ThumbsUp = (item: { messageId: any; upvote: any }, num: any) => {
	// let form = {
	// 	sessionId: sessionId.value,
	// 	userInfo: 'jingxinzhice_test',
	// 	messageId: item.messageId,
	// 	upvote: num,
	// }

	// let accountKey = 'c81769a0fee9471188e159963ee8db5e'
	// let secretKey = 'dfe231a6a28e43fc9a3567d7d31fdece'
	// let requestTime = String(new Date().getTime())
	// let requestBody = JSON.stringify(form)
	// const encryptedData = sha256(`${accountKey}${secretKey}${requestTime}${requestBody}`)
	// // signature: 'application/json;charset=UTF-8',
	// // config.headers.requestTime = requestTime
	// // config.headers.signature = encryptedData
	// let ctrlAbout = new AbortController()
	// let eventSourcepost = fetchEventSource('/upvote/agi/api/v1/bot/message/upvote', {
	// 	method: 'POST',
	// 	headers: {
	// 		// 'Content-Type': 'application/json;charset=UTF-8',
	// 		'Content-Type': 'application/json;charset=UTF-8',
	// 		Accept: 'text/event-stream',
	// 		account: 'c81769a0fee9471188e159963ee8db5e',
	// 		requestTime: requestTime,
	// 		signature: encryptedData,
	// 	},
	// 	// signal: ctrlAbout.signal,
	// 	body: JSON.stringify(form),
	// 	// onmessage(event) {
	// 	// 	console.log(event)

	// 	// 	// 成功之后操作
	// 	// 	// this.message += event.data
	// 	// 	// 成功之后满足某些条件可以使用AbortController关闭连接
	// 	// 	ctrlAbout.abort()
	// 	// },
	// 	onopen(response) {
	// 		console.info('eventSource open: ', response)
	// 		return
	// 	},
	// 	onmessage(event) {
	// 		const jsonData = JSON.parse(event.data)
	// 		let respondTexts = jsonData.delta
	// 		let finishStatus = jsonData.finished
	// 		console.log('eventSource msg: ', jsonData, event)
	// 		// let usedata = jsonData
	// 		// sessionId.value = usedata.sessionId

	// 		// // console.log(messageList.value)

	// 		// if (messageList.value[messageList.value.length - 1].role == 'SYSTEM') {
	// 		// 	console.log(messageList.value[messageList.value.length - 1].content)

	// 		// 	messageList.value[messageList.value.length - 1].content += usedata.content
	// 		// } else {
	// 		// 	messageList.value.pop()
	// 		// 	messageList.value.push({
	// 		// 		role: usedata.role,
	// 		// 		// content: usedata.content.length ? JSON.parse(usedata.content).data.data.text : '',
	// 		// 		content: usedata.content || '',
	// 		// 		messageSources: usedata.messageSources,
	// 		// 		intentions: usedata.intentions || [],
	// 		// 		messageId: usedata.messageId,
	// 		// 		topic: usedata.topic,
	// 		// 		upvote: 2,
	// 		// 	})
	// 		// 	suggestions.value = usedata.suggestions || []
	// 		// }
	// 		// // console.log(messageList.value)
	// 		// scrollBottom()
	// 	},
	// 	onerror(err) {
	// 		// 服务异常
	// 		console.log('eventSource error: ' + err)
	// 		// messageList.value.pop()
	// 		// messageList.value.push({ role: 'BOT', error: true })
	// 		// scrollBottom()
	// 		// showBtn.value = true
	// 	},
	// 	onclose() {
	// 		// showBtn.value = true
	// 		// 服务关闭
	// 		console.log('eventSource close')
	// 	},
	// })

	// return

	upvote({
		sessionId: sessionId.value,
		userInfo: 'jingxinzhice_test',
		messageId: item.messageId,
		upvote: num,
	}).then((res) => {
		// console.log(res.data)
		item.upvote = num
	})
}

const onSubmit = () => {
	let textareaValue = textarea.value
	textarea.value = ''
	clickValue(textareaValue, 'INPUT')
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>

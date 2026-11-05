<template>
	<div class="dailogCover">
		<div class="dailog">
			<!-- <div class="close"></div> -->
			<!-- 灵活就业有那些政策 -->
			<!-- {{ knowledge_id }} -->
			<div class="aiTitle">
				AI智能助手

				<!-- <div
					v-if="route.path != '/agent/aichat'"
					class="closeAi"
					@click="changeAi"
				></div> -->
			</div>

			<div
				class="messageBox"
				ref="talkInfo"
			>
				<div class="talkBox">
					<!-- <div class="logoTitle">
						<img
							src="@/assets/LOGOBig.png"
							alt=""
						/>
						<p class="help">欢迎使用政务服务助手</p>
						<p class="service">由百度文心大模型提供服务</p>
						<p class="lowB">
							{{
								`尊敬的企业用户：\n&emsp;&emsp;我们致力于为您提供安全、可靠的服务，并希望您在使用“京经智策”服务时，能够遵守相关法律法规和政策要求，避免涉及敏感话题以及与业务无关的其他话题，以免引起不必要的争议和误解。如有任何疑问或需要帮助，请随时与我们联系。`
							}}
						</p>

						<p>请根据我上传的文档，编写一篇1000字左右的文章。</p>
						<p>请根据我上传的文档，编写一份10页左右的ppt提纲。</p>
					</div> -->
					<div class="talkInfo">
						<template
							v-for="(item, index) in messageList"
							:key="index"
						>
							<div
								class="userInfo"
								v-if="item.role == 'user'"
							>
								<!-- <div class="userIco"></div> -->
								<p>{{ item.content }}</p>
							</div>
							<div
								class="botInfo"
								v-else
							>
								<!-- <template v-if="item.createInfo">
								<div class="userIco"></div>
								<div class="adviceList">
									<div class="adviceTitle">🔥 您可以这样问我哦:</div>
									<div class="adviceLine"></div>
									<div class="adviceItemList">
										<div
											class="adviceItem"
											v-for="(items, index) in suggestions"
											:key="index"
											@click="useAdvice(items)"
										>
											{{ items }}
										</div>
									</div>
								</div>
							</template> -->
								<template v-if="item.error">
									<div class="userIco"></div>
									<p class="errorMessage"><span></span>玲珑写文小助手在开小差，请稍后重新提问</p>
								</template>
								<template v-else-if="item.noChinese">
									<div class="userIco"></div>
									<p class="errorMessage">
										<span></span>
										非常抱歉，作为一个政策咨询问答大模型我还暂时无法理解您所输入的符号所表达的意思。您可以问我：首次贷款的认定标准和补贴力度是什么？”
									</p>
								</template>

								<template v-else>
									<template v-if="!item.load">
										<div class="userIco"></div>
										<div class="boxTalkBoxCover">
											<el-collapse>
												<el-collapse-item title="知识库匹配结果">
													<div
														v-for="(items, index) in item.docs"
														:key="index"
														v-html="items"
													></div>
												</el-collapse-item>
											</el-collapse>
											<div class="boxTalkBox">
												<!-- <div
													class="infoType fir"
													v-if="item.topic"
												>
													<span></span>
													已为您定位事项：{{ item.topic }}
												</div> -->
												<div class="infoType sec">
													<span></span>
													<template v-if="item.isFin"> 您咨询的问题答案： </template>
													<template v-else> 正在思考中... </template>
												</div>
												<!-- <p> -->
												<!-- <div
													class="chatContent"
													v-html="item.content"
												></div> -->
												<div class="chatContent">
													<!-- <t-pr-markdown :text="item.content"></t-pr-markdown> -->
													{{ item.content }}
												</div>
												<!-- <div>
													{{ item.content }}
												</div> -->
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
												<!-- </p> -->

												<div class="messageSource">
													<div class="clickValue">
														<!--  v-if="item.messageSources.length" -->
														<template v-if="item?.messageSources?.length">
															<!-- <b class="ly"> -->

															<b class="ly">来源：</b>
															<div class="wrapper">
																<!-- <input
															id="exp1"
															class="exp"
															type="checkbox"
														/> -->
																<div class="text">
																	<!-- <label
																class="btn"
																for="exp1"
															></label> -->

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
												</div>
											</div>
											<div class="figerBtns">
												<img
													src="@/assets/aiImgs/ico_copy_line@2x.png"
													alt=""
													@click="copyFun(item)"
												/>
												<img
													v-if="item.upvote == 2 || item.upvote == 0"
													src="@/assets/aiImgs/Thumbs-up.png"
													alt=""
													@click="ThumbsUp(item, 1)"
												/>
												<img
													v-if="item.upvote == 1"
													src="@/assets/aiImgs/Thumbs-up-active.png"
													alt=""
													@click="ThumbsUp(item, 1)"
												/>
												<img
													v-if="item.upvote == 2 || item.upvote == 1"
													src="@/assets/aiImgs/Thumbs-down.png"
													alt=""
													@click="ThumbsUp(item, 0)"
												/>
												<img
													v-if="item.upvote == 0"
													src="@/assets/aiImgs/Thumbs-down-active.png"
													alt=""
													@click="ThumbsUp(item, 0)"
												/>
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
				<div class="wordTips">
					<p
						v-for="(item, index) in tipList"
						:key="index"
						@click="useTipItem(item)"
					>
						{{ item }}
					</p>
				</div>
				<div class="inputInline">
					<div class="chatTop">
						<div
							class="addNewChat"
							@click="clickClear"
						>
							开启新对话
						</div>
						<p>内容由AI生成，仅供参考</p>
					</div>

					<div class="useInput">
						<el-input
							style="flex: 1"
							v-model="textarea"
							autosize
							type="textarea"
							@keydown.enter.native="carriageReturn($event)"
						/>
						<!-- placeholder="请输入您想要咨询的问题" -->

						<div class="useBtns">
							<div
								class="clearAdvice"
								v-if="messageList?.length"
							>
								<div
									class="clear"
									@click="clickClear"
								></div>
							</div>
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
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
// import { formType } from '@/types/common'
import { chat, upvote, userinfo, init, querykblist } from 'api/dialog'
// import sha256 from 'sha256'
import useTools from 'use-tools-before'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import OneWords from './OneWords.vue'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import { useRoute } from 'vue-router'
import useStore from '@/store'

const props = defineProps({
	knowledge_id: {
		type: String,
	},
})
let textarea = ref('')
let sessionId = ref('')
let talkInfo = ref()
let messageList = ref<any[]>([
	// {
	// 	role: 'BOT',
	// 	createInfo: true,
	// },
])
let showBtn = ref(true)
let suggestions = ref([])
let route = useRoute()
let realname = ref('')
const { app } = useStore()
let chatId = ref() //前端生成对话chatId

const tipList = ref(['请根据我上传的文档，编写一篇1000字左右的文章。', '请根据我上传的文档，编写一份10页左右的ppt提纲。'])

const useAdvice = (item) => {
	console.log(item)

	textarea.value = item

	showBtn.value && onSubmit()
}

const useTipItem = (item) => {
	textarea.value = item
}

const hasChinese = (text) => {
	var pattern = /[\u4e00-\u9fa5]/
	return pattern.test(text)
}

const getChatId = () => {
	return uuidv4().replace(/[-]/g, '')
}

const changeAi = () => {
	// noAi.value = !noAi.value
	app.changeAi()
}

const copyFun = (row) => {
	useTools
		.copyTextToClipboard({ text: row.content })
		.then((result) => {
			//复制成功
		})
		.catch((error) => {
			//复制失败
		})
}

onMounted(() => {
	let token = route.query.token || ''
	chatId.value = getChatId()
	token &&
		userinfo({ token }).then((res) => {
			// console.log(JSON.parse(res.msg).data, 'data')
			realname.value = `${JSON.parse(res.msg).data.realname}||${JSON.parse(res.msg).data._id}`
			init({
				userInfo: realname.value,
			}).then((resq) => {
				// console.log(resq)
				suggestions.value = resq.data.suggestions
			})
		})
})

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
	if (showBtn.value) {
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
}

const toUrl = (item: { url: string | URL }) => {
	item.url && window.open(item.url)
}

const scrollUp = () => {
	nextTick(() => {
		let talkBox = document.getElementsByClassName('talkBox')[0]
		// console.log(talkBox)
		talkBox.scrollTop = 0
		try {
			let talkBox1 = document.getElementsByClassName('talkBox')?.[1]
			talkBox1.scrollTop = 0
		} catch (error) {}
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
		try {
			let talkBox1 = document.getElementsByClassName('talkBox')[1]
			if (talkBox1.scrollHeight > talkBox1.clientHeight) {
				setTimeout(function () {
					//设置滚动条到最底部
					talkBox1.scrollTop = talkBox1.scrollHeight
				}, 100)
			}
		} catch (error) {}
	})
}

const clickValue = (value: string, type: string) => {
	// console.log(value)

	messageList.value.push({
		role: 'user',
		content: value,
	})
	showBtn.value = false

	// : formType
	let form = {
		// sessionId: '',
		query: value,
		// mode: 'local_kb',
		chatId: chatId.value,
		// top_k: 0,
		// score_threshold: 0,
		knowledge_id: props.knowledge_id,
		// history: JSON.parse(JSON.stringify(messageList.value)),
		// stream: true,
		// model: 'deepseek-r1:7b',
		// temperature: 0,
		// prompt_name: 'default',
		// return_direct: false,
	}

	messageList.value.push({
		role: 'BOT',
		load: true,
	})
	scrollBottom()

	let eventSourcepost = fetchEventSource(`${import.meta.env.VITE_APP_BASE_API}/api/v1/ai/ol/chat/file_chat`, {
		// let eventSourcepost = fetchEventSource(`${import.meta.env.VITE_APP_BASE_API}/chat/kb_chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
			Accept: 'text/event-stream',
			// Accept: 'application/json',
			// account: 'c81769a0fee9471188e159963ee8db5e',
			// requestTime: requestTime,
			// signature: encryptedData,
		},
		// signal: ctrlAbout.signal,
		body: JSON.stringify(form),
		onopen(response): any {
			console.info('eventSource open: ', response)
			return
		},
		onmessage(event) {
			const jsonData = JSON.parse(event.data)
			console.log('eventSource msg: ', jsonData) //, event
			let usedata = jsonData
			// .data

			// return
			if (usedata.code == 1) {
				sessionId.value = usedata.data.sessionId

				// console.log(messageList.value[messageList.value.length - 1].role, 'messageList.value[messageList.value.length - 1].role', messageList.value)

				if (
					messageList.value[messageList.value.length - 1].role == 'assistant' //'SYSTEM'
				) {
					// console.log(messageList.value[messageList.value.length - 1].content)
					// if (messageList.value[messageList.value.length - 1].content) {
					if (usedata.data.content) {
						messageList.value[messageList.value.length - 1].content += usedata.data.content
					} else {
						// debugger
						// messageList.value[messageList.value.length - 1].content = usedata.data.content
						messageList.value[messageList.value.length - 1].docs = usedata.data.docs
					}
				} else {
					messageList.value.pop()
					messageList.value.push({
						role: 'assistant',
						content: usedata.data.content || '',
						docs: usedata.data.docs || [],
						// messageSources: usedata.messageSources,
						// intentions: usedata.intentions || [],
						// messageId: usedata.message_id,
						// topic: usedata.topic,
						upvote: 2,
						isFin: false,
					})
					console.log(messageList, 'messageList')
					// try {
					// 	if (usedata.data.docs.length) {
					// 		console.log(usedata.data, 'usedata.data')

					// 		messageList.value[messageList.value.length - 1].docs = usedata.data.docs
					// 	}
					// } catch (error) {}
				}

				scrollBottom()
			} else {
				messageList.value.pop()
				messageList.value.push({
					role: 'assistant',
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
			messageList.value.push({ role: 'assistant', error: true })
			scrollBottom()
			showBtn.value = true
		},
		onclose() {
			showBtn.value = true
			messageList.value[messageList.value.length - 1].isFin = true
			// 服务关闭
			console.log('eventSource close')
		},
	})
}
const ThumbsUp = (item: { messageId: any; upvote: any }, num: any) => {
	upvote({
		sessionId: sessionId.value,
		// userInfo: 'jingxinzhice_test',
		userInfo: realname.value,
		messageId: item.messageId,
		praise: num,
	}).then((res) => {
		// console.log(res)
		if (res.code == 1) {
			item.upvote = num
		}
		// console.log(res.data)
	})
}

const onSubmit = () => {
	let textareaValue = textarea.value
	if (textarea.value.length) {
		// if (hasChinese(textareaValue)) {
		// console.log('字符串中含有中文字符')
		textarea.value = ''
		clickValue(textareaValue, 'INPUT')
		// 	} else {
		// 		console.log('字符串中不含有中文字符')
		// 		messageList.value.push({
		// 			role: 'user',
		// 			content: textareaValue,
		// 		})
		// 		textarea.value = ''
		// 		messageList.value.pop()
		// 		messageList.value.push({
		// 			role: 'assistant',
		// 			noChinese: true,
		// 		})
		// 		scrollBottom()
		// 	}
	}
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>

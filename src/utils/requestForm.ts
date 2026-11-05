import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ElMessage, ElMessageBox } from 'element-plus'
import { localStorage } from '@/utils/storage'
import { clearBtnDisabled } from './index'
import { ElLoading } from 'element-plus'
import useStore from '@/store'
// 创建 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 300000,
	headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})

let loading = null
const reqList = [] // 如果某个api存在这个数组里，说明该api暂时无法再次请求

const passRequest = ['/api/v1/sxflow/exportfillingdata']

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = function (reqList, url, cancel, errorMessage) {
	const errorMsg = errorMessage || ''
	// for (let i = 0; i < reqList.length; i++) {
	// 	if (reqList[i] === url) {
	// 		cancel(errorMsg)
	// 		return
	// 	}
	// }
	reqList.push(url)
}

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function (reqList, url) {
	for (let i = 0; i < reqList.length; i++) {
		if (reqList[i] === url) {
			reqList.splice(i, 1)
			break
		}
	}
	if (reqList.length == 0) {
		loading.close()
		loading = null
	}
}
/**
 * 允许某个请求可以继续进行
 * @param {object} config 请求配置
 */
const getUrl = function (config) {
	let curUrl
	if (config.method == 'get') {
		curUrl = config.url + JSON.stringify(config.params)
	} else if (config.method == 'post') {
		const dataType = Object.prototype.toString.call(config.data)
		if (dataType == '[object Object]' || dataType == '[object Array]') {
			curUrl = config.url + JSON.stringify(config.data)
		} else if (dataType == '[object String]') {
			curUrl = config.url + config.data.toString()
		} else {
			curUrl = config.url + config.data
		}
	}

	return curUrl
}

// 请求拦截器
// : AxiosRequestConfig
service.interceptors.request.use(
	(config) => {
		const curUrl = getUrl(config)
		if (!config.headers) {
			throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
		}
		let cancel
		// 设置cancelToken对象
		config.cancelToken = new axios.CancelToken(function (c) {
			cancel = c
		})
		// 阻止重复请求。当上个请求未完成时，相同的请求不会进行
		stopRepeatRequest(reqList, curUrl, cancel, `${config.url} 请求被中断`)

		if (reqList.length > 0 && !loading) {
			loading = ElLoading.service({
				lock: true,
				text: '加载中...',
				customClass: 'sxLoadingCom',
				background: 'rgba(0, 0, 0, 0.5)',
				svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="50" height="50" xmlns:xlink="http://www.w3.org/1999/xlink" style="shape-rendering:auto;display:block;background-position-x:0%;background-position-y:0%;background-size:auto;background-repeat-x:initial;background-repeat-y:initial;background-origin:padding-box;background-clip:border-box;background:scroll rgba(0, 0, 0, 0) none;width:50px;height:50px;;animation:none"><g><g transform="matrix(1,0,0,1,0,0)" style="transform:matrix(1, 0, 0, 1, 0, 0);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.083334" style="fill:#eb423f;opacity:0.083334;;animation:none"></rect></g><g transform="matrix(0.8660254037844387,0.49999999999999994,-0.49999999999999994,0.8660254037844387,31.698729810778058,-18.30127018922194)" style="transform:matrix(0.866025, 0.5, -0.5, 0.866025, 31.6987, -18.3013);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.166667" style="fill:#eb423f;opacity:0.166667;;animation:none"></rect></g><g transform="matrix(0.5000000000000001,0.8660254037844386,-0.8660254037844386,0.5000000000000001,68.30127018922192,-18.30127018922194)" style="transform:matrix(0.5, 0.866025, -0.866025, 0.5, 68.3013, -18.3013);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.25" style="fill:#eb423f;opacity:0.25;;animation:none"></rect></g><g transform="matrix(6.123233995736766e-17,1,-1,6.123233995736766e-17,100,0)" style="transform:matrix(6.12323e-17, 1, -1, 6.12323e-17, 100, 0);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.333334" style="fill:#eb423f;opacity:0.333334;;animation:none"></rect></g><g transform="matrix(-0.4999999999999998,0.8660254037844387,-0.8660254037844387,-0.4999999999999998,118.30127018922192,31.69872981077805)" style="transform:matrix(-0.5, 0.866025, -0.866025, -0.5, 118.301, 31.6987);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.416667" style="fill:#eb423f;opacity:0.416667;;animation:none"></rect></g><g transform="matrix(-0.8660254037844387,0.49999999999999994,-0.49999999999999994,-0.8660254037844387,118.30127018922194,68.30127018922194)" style="transform:matrix(-0.866025, 0.5, -0.5, -0.866025, 118.301, 68.3013);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.5" style="fill:#eb423f;opacity:0.5;;animation:none"></rect></g><g transform="matrix(-1,1.2246467991473532e-16,-1.2246467991473532e-16,-1,100,100)" style="transform:matrix(-1, 1.22465e-16, -1.22465e-16, -1, 100, 100);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.583334" style="fill:#eb423f;opacity:0.583334;;animation:none"></rect></g><g transform="matrix(-0.8660254037844386,-0.5000000000000001,0.5000000000000001,-0.8660254037844386,68.30127018922192,118.30127018922194)" style="transform:matrix(-0.866025, -0.5, 0.5, -0.866025, 68.3013, 118.301);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.666667" style="fill:#eb423f;opacity:0.666667;;animation:none"></rect></g><g transform="matrix(-0.5000000000000004,-0.8660254037844385,0.8660254037844385,-0.5000000000000004,31.698729810778097,118.30127018922195)" style="transform:matrix(-0.5, -0.866025, 0.866025, -0.5, 31.6987, 118.301);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.75" style="fill:#eb423f;opacity:0.75;;animation:none"></rect></g><g transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,7.105427357601002e-15,100)" style="transform:matrix(-1.83697e-16, -1, 1, -1.83697e-16, 8.58014e-15, 100);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.833334" style="fill:#eb423f;opacity:0.833334;;animation:none"></rect></g><g transform="matrix(0.5000000000000001,-0.8660254037844386,0.8660254037844386,0.5000000000000001,-18.30127018922194,68.30127018922192)" style="transform:matrix(0.5, -0.866025, 0.866025, 0.5, -18.3013, 68.3013);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="0.916667" style="fill:#eb423f;opacity:0.916667;;animation:none"></rect></g><g transform="matrix(0.8660254037844384,-0.5000000000000004,0.5000000000000004,0.8660254037844384,-18.30127018922194,31.698729810778104)" style="transform:matrix(0.866025, -0.5, 0.5, 0.866025, -18.3013, 31.6987);;animation:none"><rect fill="#409eff" height="12" width="6" ry="6" rx="3" y="24" x="47" opacity="1" style="fill:#eb423f;;animation:none"></rect></g><g></g></g><!-- [ldio] generated by https://loading.io --></svg>',
			})
		}

		if (
			import.meta.env.VITE_APP_AXIOS_INTERCEPT &&
			config.url.indexOf('/api/v1/sxflow/getrequestid') < 0 &&
			!Object.hasOwn(config.headers, 'requestid') &&
			!passRequest.includes(config.url)
		) {
			console.log('addRequest')

			return service({
				url: `/api/v1/sxflow/getrequestid`,
				method: 'get',
				params: {
					url: config.url,
				},
			}).then((requestBack) => {
				if (requestBack.data.requestId) {
					config.headers.requestid = requestBack.data.requestId
					return config
				}
			})
		} else {
			console.log('getConfig')
			return config
		}
	},
	(error) => {
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	(response: AxiosResponse) => {
		// console.log(response.config, '相应')
		const config = response.config
		const curUrl = getUrl(config)
		setTimeout(() => {
			// console.log(12123)
			allowRequest(reqList, curUrl)
		}, 0) // 上一次请求返回后过1s才允许再次请求

		clearBtnDisabled()
		// console.log(response)
		const reg = /^(?=\/rbac\/)/
		//判断识别/rbac/开头的接口
		if (response.request.responseType == 'blob') {
			return response
		} else if (reg.test(response.config.url)) {
			return response.data
		} else {
			const { code, msg } = response.data
			if (code === 1) {
				return response.data
			} else if (code == 99) {
				window.location.href = import.meta.env.VITE_APP_OUTURL
				return null
			} else {
				// 响应数据为二进制流处理(Excel导出)
				if (response.data instanceof ArrayBuffer) {
					return response
				}

				ElMessage({
					message: msg || '网络异常，请稍后再试或联系技术人员解决。',
					type: 'warning',
				})
				return Promise.reject(new Error(msg || 'Error'))
			}
		}
	},
	(error) => {
		console.log(error)

		let msg
		if (axios.isCancel(error)) {
			console.log(error.message)
			msg = '请勿重复提交！！！'
		} else {
			// 增加延迟，相同请求不得在短时间内重复发送

			const config = error.config
			const curUrl = getUrl(config)
			setTimeout(() => {
				// console.log(324234)
				allowRequest(reqList, curUrl)
			}, 10) // 请求失败返回后过1s才允许再次请求

			msg = error.response.data.msg
			ElMessage({
				message: msg || '网络异常，请稍后再试或联系技术人员解决。',
				type: 'warning',
			})
			clearBtnDisabled()
		}
		return Promise.reject(new Error(msg || 'Error'))
	}
)

// 导出 axios 实例
export default service

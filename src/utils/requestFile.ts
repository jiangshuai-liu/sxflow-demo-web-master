import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ElMessage, ElMessageBox } from 'element-plus'
import { localStorage } from '@/utils/storage'
import { clearBtnDisabled } from './index'
import useStore from '@/store'
import request from '@/utils/request'
// 创建 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 9999999999,
	headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

// 请求拦截器
// : AxiosRequestConfig
service.interceptors.request.use(
	(config) => {
		if (!config.headers) {
			throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
		}

		// if (config?.cancelToken) {
		// 	config.cancelToken = new axios.CancelToken((cancel) => {
		// 		config._cancel = cancel
		// 	})
		// }
		config.onUploadProgress = (progressEvent: any) => {
			const uploadPercentage = Math.round((progressEvent.loaded / progressEvent.total) * 100) // 更新上传进度百分比
			console.log('进度', uploadPercentage)
			console.log(new Date().getTime(), 'end', config)
		}

		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	(response: AxiosResponse) => {
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
			// if (code === '00000') {
			if (code === 1 || code === -1 || code === -2) {
				return response.data
			} else {
				// 响应数据为二进制流处理(Excel导出)
				if (response.data instanceof ArrayBuffer) {
					return response
				}

				ElMessage({
					message: msg || '系统出错',
					type: 'error',
				})
				return Promise.reject(new Error(msg || 'Error'))
			}
		}
	},
	(error) => {
		// 如果请求被取消，则不做进一步处理
		// if (axios.isCancel(error)) {
		// 	console.log('Request canceled:', error.message)
		// 	return
		// }
		const { code, msg } = error.response.data
		ElMessage({
			message: msg || '系统出错',
			type: 'error',
		})
		clearBtnDisabled()
		return Promise.reject(new Error(msg || 'Error'))
	}
)

// 导出 axios 实例
export default service

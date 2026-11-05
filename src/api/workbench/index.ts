import request from '@/utils/request'
// import { } from '@/types/api/workbench/index';

/**
 * 工作台lowcode接口
 *
 *
 */
export function _init_stat(id: number) {
	return request({
		url: `/api/v1/workflows/${id}/init_state`,
		// url: '/api/v1/tickets/',
		// method: 'get',
		method: 'post',
	})
}

export function _init_stat_submit(id: number, params: any) {
	return request({
		url: `/api/v1/workflows/${id}/init_state`,
		// url: '/api/v1/tickets/',
		// method: 'get',
		method: 'post',
		data: params,
	})
}

export function _flowsteps(id: number) {
	return request({
		url: '/api/v1/tickets/' + id + '/flowsteps',
		// url: '/api/v1/tickets/',
		method: 'get',
	})
}
export function getWorkflowSimpleDescription(id: number | string) {
	return request({
		url: `/api/v1/workflows/${id}/simple_description`,
		// url: '/api/v1/tickets/',
		method: 'get',
	})
}
export function flowlogs(id: number) {
	return request({
		url: '/api/v1/tickets/' + id + '/flowlogs',
		// url: '/api/v1/tickets/',
		method: 'get',
	})
}

//工作台新建接口
export async function _ticketsInit(params: any) {
	return request({
		url: `/api/v1/tickets`,
		method: 'post',
		data: params,
	})
}

//流程处理接口
export async function _ticketsSubmit(id: number, params: any) {
	return request({
		url: `/api/v1/tickets/${id}`,
		method: 'post',
		data: params,
	})
}

//流程处理接口
export async function _ticketsSubmits(id: number, params: any) {
	return request({
		url: `/api/v1/tickets/${id}`,
		method: 'patch',
		data: params,
	})
}

//上传文件
export async function _uploadFile(workflow_id: string | number, params: any) {
	return request({
		url: `/api/v1/sxflow/upload/${workflow_id}`,
		method: 'post',
		data: params,
	})
}

export async function changeUrlUse(url, params: any) {
	const curParams = params

	const getArrAxios = (arr) => {
		let Str = ''
		arr.forEach((item, index) => {
			// Str += JSON.stringify(item)
			if (typeof item == 'object' && JSON.stringify(item) != 'null') {
				Str += JSON.stringify(item)
			} else {
				Str += item
			}
			if (index < arr.length - 1) {
				Str += ','
			}
		})
		return Str
	}
	Object.keys(curParams).forEach((item) => {
		if (Object.prototype.toString.call(curParams[item]) == '[object Array]') curParams[item] = getArrAxios(curParams[item])
	})

	console.log(curParams, 'curParams')

	return request({
		url: url,
		method: 'get',
		params: curParams,
		withCredentials: !0,
	})
}
export async function changeUrlUsePost(url, params: any) {
	return request({
		url: url,
		method: 'post',
		data: params,
		withCredentials: !0,
	})
}
export function querydutysumbyworkflowid(params: any) {
	return request({
		url: `/api/v1/workbench/querydutysumbyworkflowid`,
		method: 'get',
		params: params,
	})
}


import request from '@/utils/request'
import { AxiosPromise } from 'axios'

//流程办结-采集流程-审批流程
export function queryflowinfo(params: any) {
	return request({
		url: `/api/v1/dashboard/queryflowinfo`,
		method: 'post',
		data: params,
	})
}

//流程办结-待办流程
export function querydutyflow(params: any) {
	return request({
		url: `/api/v1/dashboard/querydutyflow`,
		method: 'post',
		data: params,
	})
}

//数据办结(管理员)
export function queryfinishflowbyadmin(params: any) {
	return request({
		url: `/api/v1/dashboard/queryfinishflowbyadmin`,
		method: 'post',
		data: params,
	})
}

//流程总数(管理员)
export function queryallflowbyadmin(params: any) {
	return request({
		url: `/api/v1/dashboard/queryallflowbyadmin`,
		method: 'post',
		data: params,
	})
}

//数据分析_业务热度分析
export function queryflowheatbyadmin(params: any) {
	return request({
		url: `/api/v1/dashboard/queryflowheatbyadmin`,
		method: 'post',
		data: params,
	})
}

// 数据分析_业务热度分析-审批流程列表
export function queryallworkflowbyadmin() {
	return request({
		url: `/api/v1/dashboard/queryallworkflowbyadmin`,
		method: 'get',
	})
}

// 填报事项分析-排行榜
export function queryfillingflowranking(params: any) {
	return request({
		url: `/api/v1/dashboard/queryfillingflowranking`,
		method: 'post',
		data: params,
	})
}

//审批事项分析-排行榜
export function queryconfireflowranking(params: any) {
	return request({
		url: `/api/v1/dashboard/queryconfireflowranking`,
		method: 'post',
		data: params,
	})
}

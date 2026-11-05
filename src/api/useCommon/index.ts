import request from '@/utils/request'
import { AxiosPromise } from 'axios'

//查看详情
export function queryCollectionDetail(params: any) {
	return request({
		url: `/api/v1/datacollection/queryCollectionDetail`,
		method: 'get',
		params: params,
	})
}

//新建弹窗提交
export function datacollection(params: any) {
	return request({
		url: `/api/v1/datacollection`,
		method: 'post',
		data: params,
	})
}

//自定义字段更新接口
export async function init_customdata(customFieldId: number | string) {
	return request({
		url: `/api/v1/sxflow/initsubform?subform_id=${customFieldId}`,
		method: 'get',
	})
}

export interface QueryUserSimpleType {
	search_value?: string
}
//人员接口
export function queryUserSimple(params: QueryUserSimpleType) {
	return request({
		url: '/api/v1/accounts/simple_users',
		method: 'get',
		params: params,
	})
}

//管理员身份

export function canInterveneRequest(workflowId: number) {
	return request({
		url: `/api/v1/workflows/${workflowId}/can_intervene`,
		method: 'get',
	})
}

//流转接口
export function _transitionsList(id: number | string): AxiosPromise<any> {
	return request({
		url: `/api/v1/tickets/${id}/transitions`,
		method: 'get',
	})
}
export function _ticketsId(id: number): AxiosPromise<any> {
	return request({
		url: '/api/v1/tickets/' + id,
		method: 'get',
	})
}

export function initflow(params: any) {
	return request({
		url: `/api/v1/sxflow/initflow`,
		method: 'post',
		data: params,
	})
}

export function saveflowatlist(params: any) {
	return request({
		url: '/api/v1/workbench/saveflowatlist',
		method: 'post',
		data: params,
	})
}

export function saveflow(params: any) {
	return request({
		url: '/api/v1/sxflow/saveflow',
		method: 'post',
		data: params,
	})
}

export function handleflow(params: any) {
	return request({
		url: '/api/v1/sxflow/handleflow',
		method: 'post',
		data: params,
	})
}

export function saveflowlist(params: any) {
	return request({
		url: '/api/v1/sxflow/saveflowlist',
		method: 'post',
		data: params,
	})
}

export function deletefillingdatabyid(params: any) {
	return request({
		url: '/api/v1/sxflow/deletefillingdatabyid',
		method: 'get',
		params: params,
	})
}

export function querydesensitizedfillingdatabyid(params: { id: string | number; workflow_id: number }) {
	return request({
		url: '/api/v1/sxflow/querydesensitizedfillingdatabyid',
		method: 'get',
		params: params,
	})
}

export function queryfillingdatabyid(params: { id: string | number; workflow_id: number }) {
	return request({
		url: '/api/v1/sxflow/queryfillingdatabyid',
		method: 'get',
		params: params,
	})
}

// 代办列表
export async function querydutyflowlist(params: any) {
	return request({
		url: `/api/v1/sxflow/querydutyflowlist`,
		method: 'post',
		data: params,
	})
}

// 与我相关列表
export async function queryrelationflowlist(params: any) {
	return request({
		url: `/api/v1/sxflow/queryrelationflowlist`,
		method: 'post',
		data: params,
	})
}

// /sxflow/updateflowstate
export async function updateflowstate(params: any) {
	return request({
		url: `/api/v1/sxflow/updateflowstate`,
		method: 'post',
		data: params,
	})
}

export function querydetailbyflowid(params: any) {
	return request({
		url: '/api/v1/sxflow/querydetailbyflowid',
		method: 'get',
		params: params,
	})
}

export async function handleflowbatch(params: any) {
	return request({
		url: `/api/v1/workbench/handleflow-batch`,
		method: 'post',
		data: params,
	})
}

export async function queryfillingdatalist(params: any) {
	return request({
		url: `/api/v1/sxflow/queryfillingdatalist`,
		method: 'post',
		data: params,
	})
}

export function queryrelationworkflowlist(params: any) {
	return request({
		url: '/api/v1/sxflow/queryrelationworkflowlist',
		// url: '/api/v1/workbench/queryRelationWorkflowlistBench',
		method: 'get',
		params: params,
	})
}

export function queryvisibleworkflowlist(params: any) {
	return request({
		url: '/api/v1/sxflow/queryvisibleworkflowlist',
		method: 'get',
		params: params,
	})
}

export function queryflowsteps(params: any) {
	return request({
		url: '/api/v1/sxflow/queryflowsteps',
		method: 'get',
		params: params,
	})
}

export function queryflowlogs(params: any) {
	return request({
		url: '/api/v1/sxflow/queryflowlogs',
		method: 'get',
		params: params,
	})
}

/**
 * 左侧树
 */
export function queryresources(params: any) {
	return request({
		url: `/api/v1/rbac/queryresources`,
		method: 'get',
		params: params,
	})
}

//事项分类
export function querySxFlList(params: any) {
	return request({
		url: `/api/v1/common/querySxFlList`,
		method: 'get',
		params: params,
	})
}
//事项类别
export function querySxLbList(params: any) {
	return request({
		url: `/api/v1/common/querySxLbList`,
		method: 'get',
		params: params,
	})
}
export async function getQyid(params: any) {
	return request({
		url: `/api/v1/events-list/getQyid`,
		method: 'get',
		params: params,
	})
}

export async function getSxmlInitializationd(params: any) {
	return request({
		url: `/api/v1/common/sxmlInitialization`,
		method: 'get',
		params: params,
	})
}

//
export async function querymyfillingworkflowlist() {
	return request({
		url: `/api/v1/sxflow/querymyfillingworkflowlist`,
		method: 'get',
	})
}

export async function queryworkflowsimpledescription(params: any) {
	return request({
		url: `/api/v1/sxflow/queryworkflowsimpledescription`,
		method: 'get',
		params: params,
	})
}

//流程类别所有状态列表

export async function queryworkflowstatelist(params: any) {
	return request({
		url: `/api/v1/sxflow/queryworkflowstatelist`,
		method: 'get',
		params: params,
	})
}

//与我相关  我申请的

export async function queryownerflowlist(params: any) {
	return request({
		url: `/api/v1/sxflow/queryownerflowlist`,
		method: 'post',
		data: params,
	})
}

//采集数据列表表头

export async function queryfillingdatakeys(params: any) {
	return request({
		url: `/api/v1/sxflow/queryfillingdatakeys`,
		method: 'get',
		params: params,
	})
}

//导出接口
export function exportfillingdata(params: any) {
	return request({
		url: `/api/v1/sxflow/exportfillingdata`,
		method: 'get',
		params: params,
		responseType: 'blob',
	})
}
//导出接口
export function exporttemplate(params: any) {
	return request({
		url: `/api/v1/sxflow/exporttemplate`,
		method: 'get',
		params: params,
		responseType: 'blob',
	})
}

export async function querysignverification(params: any) {
	return request({
		url: `/api/v1/sxflow/querysignverification`,
		method: 'post',
		data: params,
	})
}

export async function importfillingdata(params: any) {
	return request({
		url: `/api/v1/sxflow/importfillingdata`,
		method: 'post',
		data: params,
	})
}

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

//事项_自定义列表接口
export function querymattercustomlist(params: any) {
	return request({
		url: `/api/v1/business/querymattercustomlist`,
		method: 'post',
		data: params,
	})
}

//事项_当前状态下拉选项接口
export function querymatterstatulist(params: any) {
	return request({
		url: `/api/v1/business/querymatterstatulist`,
		method: 'get',
		params: params,
	})
}

//事项_综合查询_自定义列表接口
export function querycommattercustomlist(params: any) {
	return request({
		url: `/api/v1/business/querycommattercustomlist`,
		method: 'post',
		data: params,
	})
}

//工作台_事项: 在列表上提交接口
export function savematteratlist(params: any) {
	return request({
		url: `/api/v1/business/savematteratlist`,
		method: 'get',
		params: params,
	})
}

//事项_详情接口
export function querymatter(params: any) {
	return request({
		url: `/api/v1/business/querymatter`,
		method: 'get',
		params: params,
	})
}

//事项处理（提交或流转）接口
export function handlematter(params: any) {
	return request({
		url: `/api/v1/business/handlematter`,
		method: 'post',
		data: params,
	})
}

// 会议决策顺序类型
export function queryordermeetinglist(params: any = {}) {
	return request({
		url: `/api/v1/business/queryordermeetinglist`,
		method: 'get',
		params: params,
	})
}

// 优秀创业服务机构申请_自定义列表接口
export function queryorganizationcustomlist(params: any = {}) {
	return request({
		url: `/api/v1/business/queryorganizationcustomlist`,
		method: 'post',
		data: params,
	})
}

// 岗社补招用人员_自定义列表接口
export function querypersonnellist(params: any = {}) {
	return request({
		url: `/api/v1/business/querypersonnellist`,
		method: 'post',
		data: params,
	})
}

//房屋类型下拉列表
export function queryhousetypelist(params: any = {}) {
	return request({
		url: `/api/v1/business/queryhousetypelist`,
		method: 'get',
		params: params,
	})
}

//采集宝-出租房屋登记_自定义列表接口
export function queryhousecollectioncustomlist(params: any = {}) {
	return request({
		url: `/api/v1/business/queryhousecollectioncustomlist`,
		method: 'post',
		data: params,
	})
}


//采集宝-出租房屋登记_自定义列表接口
export function querybzfqnmp(params: any = {}) {
	return request({
		url: `/api/v1/qyyg/querybzfqnmp`,
		method: 'post',
		data: params,
	})
}

// 事项_操作记录自定义接口示例
export function querysxlogs(params: any = {}) {
	return request({
		url: `/api/v1/business/querysxlogs`,
		method: 'get',
		params: params,
	})
}

// 事项_流程进度轴自定义接口示例
export function querysxsteps(params: any = {}) {
	return request({
		url: `/api/v1/business/querysxsteps`,
		method: 'get',
		params: params,
	})
}

//rbac列表
export function querydeptlist(params: any = {}) {
	return request({
		url: `/api/v1/system/querydeptlist`,
		method: 'post',
		data: params,
	})
}

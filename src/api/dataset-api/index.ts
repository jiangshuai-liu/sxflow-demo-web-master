import request from '@/utils/request'

//查看详情
export function queryDataSetApi(params: any) {
	return request({
		url: `/api/v1/common/excel/import/queryDataSet`,
		method: 'get',
		params: params,
	})
}

//元数据集合查询
export function queryMateDataByIdApi(params: any) {
	return request({
		url: `/api/v1/common/excel/import/queryMateDataById`,
		method: 'get',
		params: params,
	})
}


export async function fileImport(params: any) {
	return request({
		url: `/api/v1/common/excel/import/importExcel`,
		method: 'post',
		data: params,
		withCredentials: true, // ++ 新增
	})
}


export function importQueryApi(params: any) {
	return request({
		url: `/api/v1/common/excel/import/importQuery`,
		method: 'post',
		data: params,
	})
}

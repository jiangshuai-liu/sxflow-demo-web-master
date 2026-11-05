import request from '@/utils/request'
import { unlockUserListType } from '@/types/user-manage'

//锁定用户列表
export function querylockuserlist(params: any) {
	return request({
		url: `/api/v1/system/querylockuserlist`,
		method: 'post',
		data: params,
	})
}

//解锁用户
export function unlockuserlist(params: unlockUserListType) {
	return request({
		url: `/api/v1/system/unlockuserlist`,
		method: 'post',
		data: params,
	})
}

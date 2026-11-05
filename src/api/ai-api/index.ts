import request from '@/utils/request'

//文件对话上传
export async function uploadtempdoc(params: any) {
	return request({
		url: `/api/v1/ai/ol/chat/uploadtempdoc`,
		method: 'post',
		data: params,
	})
}

//点赞接口
export async function upvote(params: any) {
	return request({
		url: `/api/v1/ai/ol/chat/praise`,
		// url: `/smebj/api/upvote/agi/api/v1/bot/message/upvote`,
		method: 'get',
		params: params,
	})
}



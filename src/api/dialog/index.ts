import request from '@/utils/request'

//会话接口
export async function chat(params: any) {
	return request({
		url: `/chat/agi/api/v1/bot/chat`,
		// url: `/smebj/api/chat/agi/api/v1/bot/chat`,
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

//人员信息接口
export async function userinfo(params: any) {
	return request({
		// url: `/upvote/agi/api/v1/bot/message/upvote`,
		url: `/smebj/api/apis/core/userinfo`,
		method: 'get',
		params: params,
	})
}

//提问接口
export async function init(params: any) {
	return request({
		// url: `/upvote/agi/api/v1/bot/message/upvote`,
		url: `/smebj/api/chatInit/agi/api/v1/bot/init`,
		method: 'post',
		data: params,
	})
}

// 获取知识库列表
export async function querykblist(params: any) {
	return request({
		url: `/api/v1/ai/ol/chat/querykblist`,
		method: 'get',
		params: params,
	})
}

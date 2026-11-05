import request from '@/utils/request'
// import request from '@/utils/requestForm'

//单位列表
export function querydeptmenu(params: { deptId?: string }) {
	return request({
		url: `/api/v1/rbac/v4/dept/querydeptmenu`,
		method: 'post',
		data: params,
	})
}

//用户排序列表
export function queryuserlist(params: Partial<{ deptId: string; yhm: string; kssj: string; jssj: string }>) {
	return request({
		url: `/api/v1/rbac/v4/dept/queryuserlist`,
		method: 'post',
		data: params,
	})
}

//获取左侧角色类别列表
export function queryroletypelist(params: { rtId?: string }) {
	return request({
		url: `/api/v1/rbac/v4/roletype/queryroletypelist`,
		method: 'post',
		data: params,
	})
}

//修改用户排序接口
export function updateuserorder(params: { uidList: number[] }) {
	return request({
		url: `/api/v1/rbac/v4/dept/updateuserorder`,
		method: 'post',
		data: params,
	})
}

//角色授权单位树
export function queryroledepttree(params: { id: string }) {
	return request({
		// url: `/api/v1/rbac/v4/dept/role/queryroledepttree`,
		url: `/api/v1/rbac/v4/role/queryroledepttree`,
		method: 'post',
		data: params,
	})
}

//获取角色类别下的角色列表
export function queryrolelist(params: Partial<{ rtId: string; mc: string; ms: string; kssj: string; jssj: string }>) {
	return request({
		url: `/api/v1/rbac/v4/roletype/queryrolelist`,
		method: 'get',
		params: params,
	})
}

//授权单位
export function grantdeptlist(params: { roleId: string; deptIdList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/role/saveroletodeptlist`,
		method: 'post',
		data: params,
	})
}

//已授权单位
export function queryroledeptlist(params: { id: string }) {
	return request({
		url: `/api/v1/rbac/v4/role/queryroledeptlist`,
		method: 'post',
		data: params,
	})
}

// 取消单位授权
export function canclegrantdeptlist(params: { roleId: string; deptIdList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/role/deleterolefordeptlist`,
		method: 'post',
		data: params,
	})
}

// 已授权用户列表
export function queryuserlistbygrant(params: { roleId: string; deptId?: string }) {
	return request({
		url: `/api/v1/rbac/v4/role/queryhaveroleuserlist`,
		method: 'post',
		data: params,
	})
}

// 单位未授权角色用户列表
export function queryuserlistwithoutgrant(params: { roleId: string; deptId: string }) {
	return request({
		url: `/api/v1/rbac/v4/role/querynothaveroleuserlist`,
		method: 'post',
		data: params,
	})
}

// 角色授权人员
export function grantrolelist(params: { roleId: string; userIdList: string[]; type: 'promise' | 'cancel' }) {
	return request({
		url: `/api/v1/rbac/v4/role/saveroletouserlist`,
		method: 'post',
		data: params,
	})
}

// 获取左侧资源（权限）菜单
export function queryobjectmenu(params: { typeId?: string; zymc?: string; kssj?: string; jssj?: string }) {
	return request({
		url: `/api/v1/rbac/v4/objecttype/queryobjectmenu`,
		method: 'post',
		data: params,
	})
}

// 授权角色
export function grantroles(params: { deptId: string; roleIdList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/dept/saverolelisttodept`,
		method: 'post',
		data: params,
	})
}

// 已授权角色列表
export function querydeptrolelist(params: { id: string }) {
	return request({
		url: `/api/v1/rbac/v4/dept/querydeptrolelist`,
		method: 'post',
		data: params,
	})
}

// 角色授权权限树
export function queryobjecttree(params: { id: string }) {
	return request({
		url: `/api/v1/rbac/v4/role/queryobjecttree`,
		method: 'post',
		data: params,
	})
}

// 修改子单位排序接口
export function updatedeptorder(params: { uidList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/dept/updatedeptorder`,
		method: 'post',
		data: params,
	})
}

// 修改用户状态接口 1:启用 0:禁用
export function updateroleuseful(params: { status: string; uidList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/role/updateroleuseful`,
		method: 'post',
		data: params,
	})
}

// 授权资源
export function grantobjects(params: { roleId: string; objectIdList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/role/saveroletoobjectlist`,
		method: 'post',
		data: params,
	})
}

// 用户授权角色列表
export function queryuserrolelist(params: { id: string; uid: string }) {
	return request({
		url: `/api/v1/rbac/v4/dept/queryuserrolelist`,
		method: 'post',
		data: params,
	})
}

// 用户授权角色
export function grantuserroles(params: { userId: string; roleIdList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/dept/saveuserrolelist`,
		method: 'post',
		data: params,
	})
}

// 修改用户部门接口
export function updateuserdept(params: { did: string; uid: string }) {
	return request({
		url: `/api/v1/rbac/v4/dept/updateuserdept`,
		method: 'post',
		data: params,
	})
}

//修改单位树
export function queryuserdeptlist(params: { id: string }) {
	return request({
		url: `/api/v1/rbac/v4/dept/queryuserdeptlist`,
		method: 'post',
		data: params,
	})
}

//删除单位
export function deletedept(params: { did: string }) {
	return request({
		url: `/api/v1/rbac/v4/dept/deletedept`,
		method: 'post',
		data: params,
	})
}

// 修改角色类别接口 1:启用 0:禁用
export function updateroletypeuseful(params: { status: string; uidList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/roletype/updateroletypeuseful`,
		method: 'post',
		data: params,
	})
}

//搜索模式
export function queryuserlistsearch(params: { roleId: string; name: string }) {
	return request({
		url: `/api/v1/rbac/v4/role/queryuserlistbykeyword`,
		method: 'post',
		data: params,
	})
}

//删除资源类型接口
export function deleteobjecttype(params: { did: string }) {
	return request({
		url: `/api/v1/rbac/v4/objecttype/deleteobjecttype`,
		method: 'post',
		data: params,
	})
}

//删除资源接口
export function deleteobject(params: { did: string }) {
	return request({
		url: `/api/v1/rbac/v4/object/deleteobject`,
		method: 'post',
		data: params,
	})
}

//删除角色接口
export function deleterole(params: { uid: string }) {
	return request({
		url: `/api/v1/rbac/v4/user/deleteuser`,
		method: 'post',
		data: params,
	})
}

//人员初始化接口
export function inituser(params: any) {
	return request({
		url: `/api/v1/rbac/v4/user/inituser`,
		method: 'post',
		data: params,
	})
}
//用户保存接口
export function saveuser(params: any) {
	return request({
		url: `/api/v1/rbac/v4/user/saveuser`,
		method: 'post',
		data: params,
	})
}

//安全管理员单位树列表
export function querydepttree(params: any) {
	return request({
		url: `/api/v1/rbac/v4/secadmin/querydepttree`,
		method: 'post',
		data: params,
	})
}

//单位未指派用户列表
export function queryunassignuserlist(params: { assignDeptId: string; deptId: string }) {
	return request({
		url: `/api/v1/rbac/v4/secadmin/queryunassignuserlist`,
		method: 'post',
		data: params,
	})
}

//单位已指派用户列表
export function queryassignuserlist(params: { assignDeptId?: string; deptId?: string }) {
	return request({
		url: `/api/v1/rbac/v4/secadmin/queryassignuserlist`,
		method: 'post',
		data: params,
	})
}

//指派管理员
export function assignadmin(params: { assignDeptId: string; userIdList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/secadmin/saveassignadmin`,
		method: 'post',
		data: params,
	})
}

//取消指派管理员
export function unassignadmin(params: { assignDeptId: string; userIdList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/secadmin/deleteassignadmin`,
		method: 'post',
		data: params,
	})
}

//管理员角色类别树
export function queryadminroletypetree(params: { deptId: string }) {
	return request({
		url: `/api/v1/rbac/v4/secadmin/queryadminroletypetree`,
		method: 'post',
		data: params,
	})
}

// 管理员授权角色类别
export function admingrantroletype(params: { deptId: string; roleTypeList: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/secadmin/saveroletypelisttoadmin`,
		method: 'post',
		data: params,
	})
}

// 管理员资源类别列表
export function queryadminobjecttypelist(params: { deptId: string; objTypeList?: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/secadmin/queryadminobjecttypelist`,
		method: 'post',
		data: params,
	})
}

// 管理员授权资源类别
export function admingrantobjecttypelist(params: { deptId: string; objTypeList?: string[] }) {
	return request({
		url: `/api/v1/rbac/v4/secadmin/saveobjecttypelisttoadmin`,
		method: 'post',
		data: params,
	})
}

// 获取用户id
export function queryisadmin() {
	return request({
		url: `/api/v1/rbac/v4/user/queryisadmin`,
		method: 'post',
	})
}

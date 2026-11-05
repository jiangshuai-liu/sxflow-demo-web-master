/**
 * rbac流程id
 * @returns organization 组织机构/单位
 * @returns user 新增用户
 * @returns roleType 角色类别
 * @returns role 角色
 * @returns resourceType 资源类别
 * @returns resource 资源
 * @returns appInsert 应用接入
 */

export enum rbacEnums {
	organization = 205, //组织机构/单位
	user = 215, //新增用户
	roleType = 216, //角色类别
	role = 217, //角色
	resourceType = 218, //资源类别
	resource = 219, //资源
	appInsert = 240, //应用接入
}

export enum rbacUseEnums {
	topLevelCompany = '0', //顶级单位名
}

export enum useMode {
	selectMode = 1,
	searchMode = 2,
}

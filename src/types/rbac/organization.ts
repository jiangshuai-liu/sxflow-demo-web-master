export type pageTypeType = 'organization' | 'user'

export type companyActType = 'userlist' | 'authuser' | 'usersort' | 'companysort'

export type roleTabType = 'userinfo' | 'authrole' | 'changecompany'

export interface elseFormType {
	[key: string]: any
	tabType: roleTabType
}

export interface propsType {
	useSuperId: string | number
	firstTreeId: string | number
	companyId: number | string
	userUseForm: Partial<elseFormType>
}

export type propsTypeDelCompany = Omit<propsType, 'companyId'>

export type propsTypePickDouble = Pick<propsType, 'useSuperId' | 'firstTreeId'>

export type companyIdType = Pick<propsType, 'companyId'>

export type propsTypePickDoubleInfo = Pick<propsType, 'companyId' | 'userUseForm'>

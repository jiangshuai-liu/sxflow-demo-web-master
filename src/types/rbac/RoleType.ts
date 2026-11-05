export type pageTypeType = 'roleType' | 'role'

export type propsType = {
	title: string
	companyId: number | string
}

export type companyIdType = Pick<propsType, 'companyId'>

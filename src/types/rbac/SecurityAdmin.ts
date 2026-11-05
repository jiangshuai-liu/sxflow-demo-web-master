export type adminActType = 'assignadmin' | 'authroletype' | 'authresoucetype' | 'authsystem'
export type propsType = {
	title: string
	companyId: number | string
}

export type tabItemType = { label: string; name: adminActType }

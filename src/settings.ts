interface DefaultSettings {
	title: string
	showSettings: boolean
	fixedHeader: boolean
	sidebarLogo: boolean
	errorLog: string
}

const defaultSettings: DefaultSettings = {
	title: '玲珑·业务定制平台',
	showSettings: true,
	fixedHeader: false,
	// 是否显示Logo
	sidebarLogo: true,
	errorLog: 'production',
}

export default defaultSettings

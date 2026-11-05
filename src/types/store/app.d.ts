/**
 * 系统类型声明
 */
export interface AppState {
	device: string
	sidebar: {
		opened: boolean
		withoutAnimation: boolean
	}
	language: string
	size: string
	leftBoxClose: boolean
	isShr: boolean
	noAi: boolean
}

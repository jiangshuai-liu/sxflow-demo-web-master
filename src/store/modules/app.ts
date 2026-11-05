import { AppState } from '@/types/store/app'
import { localStorage } from '@/utils/storage'
import { defineStore } from 'pinia'
import { getLanguage } from '@/lang/index'

const useAppStore = defineStore({
	id: 'app',
	state: (): AppState => ({
		device: 'desktop',
		sidebar: {
			opened: localStorage.get('sidebarStatus') ? !!+localStorage.get('sidebarStatus') : true,
			withoutAnimation: false,
		},
		language: getLanguage(),
		size: localStorage.get('size') || 'default',
		leftBoxClose: false,
		isShr: false,
		noAi: true,
	}),
	actions: {
		toggleSidebar() {
			this.sidebar.opened = !this.sidebar.opened
			this.sidebar.withoutAnimation = false
			if (this.sidebar.opened) {
				localStorage.set('sidebarStatus', 1)
			} else {
				localStorage.set('sidebarStatus', 0)
			}
		},
		closeSideBar(withoutAnimation: any) {
			localStorage.set('sidebarStatus', 0)
			this.sidebar.opened = false
			this.sidebar.withoutAnimation = withoutAnimation
		},
		toggleDevice(device: string) {
			this.device = device
		},
		setSize(size: string) {
			this.size = size
			localStorage.set('size', size)
		},
		setLanguage(language: string) {
			this.language = language
			localStorage.set('language', language)
		},
		setLeftBoxClose(boo: boolean) {
			this.leftBoxClose = boo
		},
		setIsShr(isShr: boolean) {
			this.isShr = isShr
		},
		changeAi() {
			this.noAi = !this.noAi
		},
	},
	persist: {
		key: 'app', //存储名称
		storage: sessionStorage, // 存储方式
		paths: ['isShr'], //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
	},
})

export default useAppStore

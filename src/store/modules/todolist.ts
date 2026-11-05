import { RelatedmeState } from '@/types/store/relatedme'
import { localStorage } from '@/utils/storage'
import { defineStore } from 'pinia'
import { getLanguage } from '@/lang/index'

const useTodolistStore = defineStore({
	id: 'todolist',
	state: (): RelatedmeState => ({
		workflowId: '',
		workflowObj: {},
	}),
	actions: {
		setWorkflowId(workflowId: number) {
			this.workflowId = workflowId
		},
		clearWorkflwoId() {
			this.workflowId = ''
		},
		setWorkflowObj(obj: any) {
			this.workflowObj = obj
		},
		clearWorkflwoObj() {
			this.workflowObj = {}
		},
	},
	persist: {
		key: 'todolist', //存储名称
		storage: sessionStorage, // 存储方式
		paths: null, //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
	},
})

export default useTodolistStore

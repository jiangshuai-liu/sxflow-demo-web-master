import useAppStore from './modules/app'
import workbenchStore from './modules/workbench'
import relatedmeStore from './modules/relatedme'
import todolistStore from './modules/todolist'

const useStore = () => ({
	app: useAppStore(),
	workbench: workbenchStore(),
	relatedme: relatedmeStore(),
	todolist: todolistStore(),
})

export default useStore

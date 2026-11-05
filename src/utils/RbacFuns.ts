import { queryfillingdatabyid } from '@/api/useCommon'
import { rbacEnums } from '@/enums/rbacEnums'
import _ from 'lodash'
import { rbacEnumsType } from '@/types/rbac/fun'
import { nextTick, ref, Ref } from 'vue'
import useTools from 'use-tools-before'
import { commonHook, commonFormFun } from '@bksx/sxflow'
export default function rbacFun(LeftSliderRef: Ref) {
	const title = ref('')
	const topLevelId = ref<number | string>(null) //最高级id
	const useSuperId = ref<number | string>(null) //当前渲染页面id
	const firstTreeId = ref<number | string>(null) //第一级第一个id

	const {
		isShow,
		form,
		id,
		centerObj,
		mainFormData,
		formItemList,
		workflow_id,
		transition,
		column_size,
		rules,
		ruleFormRef,
		isState,
		ids,
		isReturn,
		injectionForm,
		ticketId,
	} = commonHook()

	const deleteCallback = (data: Ref<any[]> = ref([]), apiResult: any, url, formData, callback = null) => {
		const dd_superdid = getCurrentNodeData().parentId
		// useSuperId.value?.toString()
		// const formData = { typeId: dd_superdid }
		// queryobjectmenu(formData).then((res) => {
		url(formData).then((res) => {
			const apiData = res.data
			const useData = apiData.map((item) => ({ ...item, isLeaf: !item.isParent }))

			if (dd_superdid != topLevelId.value) {
				console.log(dd_superdid, 'dd_superdid  addback')
				//不是第一级
				useRbacFilterTree('getComponentRef').updateKeyChildren(dd_superdid, useData)
				useRbacFilterTree('getSelfTree').changeTreeItemExpanded(dd_superdid, true)
				useSuperId.value = apiResult.id
			} else {
				//是第一级
				const transitionData = _.groupBy(data.value, 'id')
				console.log(transitionData, 'transitionData')
				const newData = apiData.map((item) => {
					if (Object.hasOwnProperty.call(transitionData, String(item.id))) {
						return transitionData[item.id][0]
					} else {
						return item
					}
				})
				data.value = newData
				useSuperId.value = newData?.[0]?.id || null
				apiResult = null
			}

			// console.log(useData, apiResult.id, 'useData,apiResult.id')

			// useSuperId.value = apiResult.id
			// useData[0].id
			// apiResult.id
			useRbacFilterTree('getComponentRef')?.setCurrentKey()
			useSuperId.value && useRbacFilterTree('getComponentRef')?.setCurrentKey(useSuperId.value)
			callback &&
				nextTick(() => {
					// console.log('nexttick')
					// callback({ ...apiResult, id: useData[0].id, workflow_id: useData[0].isParent ? rbacEnums.roleType : rbacEnums.role })
					callback(apiResult)
				})
			// returnTitle(apiResult.id)
		})
	}
	const addCallback = (data: Ref<any[]> = ref([]), apiResult: any, url, formData, callback = null) => {
		const dd_superdid = useSuperId.value?.toString()
		// const formData = { typeId: dd_superdid }
		// queryobjectmenu(formData).then((res) => {
		url(formData).then((res) => {
			const apiData = res.data
			const useData = apiData.map((item) => ({ ...item, isLeaf: !item.isParent }))
			if (dd_superdid != topLevelId.value) {
				console.log(dd_superdid, 'dd_superdid  addback')
				//不是第一级
				useRbacFilterTree('getComponentRef').updateKeyChildren(dd_superdid, useData)
				useRbacFilterTree('getSelfTree').changeTreeItemExpanded(dd_superdid, true)
			} else {
				//是第一级
				const transitionData = _.groupBy(data.value, 'id')
				console.log(transitionData, 'transitionData')
				const newData = apiData.map((item) => {
					if (Object.hasOwnProperty.call(transitionData, String(item.id))) {
						return transitionData[item.id][0]
					} else {
						return item
					}
				})
				data.value = newData
			}

			useSuperId.value = apiResult.id
			useRbacFilterTree('getComponentRef')?.setCurrentKey()
			useRbacFilterTree('getComponentRef')?.setCurrentKey(apiResult.id)
			callback &&
				nextTick(() => {
					// console.log('nexttick')

					callback(apiResult)
				})
			// returnTitle(apiResult.id)
		})
	}

	const clickFunCallback = async (clickItem, data, url, formData, callback = null) => {
		const selfFunction = () => {
			// const formData = { typeId: clickItem.id }
			// queryobjectmenu(formData).then((res) => {
			url(formData).then((res) => {
				const apiData = res.data
				const useData = apiData.map((item) => ({ ...item, isLeaf: !item.isParent }))
				useRbacFilterTree('getComponentRef').updateKeyChildren(clickItem.id, useData)
				useRbacFilterTree('getSelfTree').changeTreeItemExpanded(clickItem.id, true)
			})
		}
		// console.log(url, 'url')
		const includeAjaxList = ['resourceType', 'resource', 'organization', 'roleType']

		!clickItem.children?.length && includeAjaxList.includes(clickItem.rbacType) && selfFunction()
		title.value = clickItem.name
		//
		useSuperId.value = useRbacFilterTree('getComponentRef').getCurrentNode()?.id

		// changeCompanyForm(useSuperId.value, clickItem.rbacType)
		callback &&
			nextTick(() => {
				// console.log('nexttick')
				callback()
			})
		// changeCompanyForm(useSuperId.value)
		// companyListRef.value?.changePage()
		// pageType.value == 'resource' && changePageType('resourceType')
	}

	const useRbacFilterTree = (funName?: string, params: any[] = []) => {
		const self = LeftSliderRef.value?.getRbacFilterTreeRef()
		if (!funName) {
			return self
		} else {
			return self?.[funName](...params)
		}
	}

	const changeCompanyForm = (id, type: rbacEnumsType) => {
		queryfillingdatabyid({ id, workflow_id: rbacEnums[type] }).then((res) => {
			const commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
			mainFormData.value = commonForm.mainFormDatas
		})
	}

	const getCurrentNodeData = () => {
		return useRbacFilterTree('getComponentRef')?.getCurrentNode()
	}

	const getNodeById = (id) => {
		return useRbacFilterTree('getComponentRef')?.getNode(id)
	}

	const returnTitle = (id, type: rbacEnumsType) => {
		nextTick(() => {
			// debugger
			// console.log(id, type, 'id, type', getNodeById(id))

			title.value = getNodeById(id)?.data.name
			changeCompanyForm(id, type)
		})
	}

	const updateOrganization = (callback = null, apiResult = {}) => {
		useRbacFilterTree('updateData', [true, callback, apiResult])
	}

	const getData = (): Readonly<any> => {
		return useRbacFilterTree('getData')
	}

	const removeNode = (id: any) => {
		return useRbacFilterTree('getComponentRef')?.remove(id)
	}

	const rbacHooks = () => ({
		title,
		topLevelId,
		useSuperId,
		firstTreeId,

		//rbacStart
		isShow,
		form,
		id,
		centerObj,
		mainFormData,
		formItemList,
		workflow_id,
		transition,
		column_size,
		rules,
		ruleFormRef,
		isState,
		ids,
		isReturn,
		injectionForm,
		ticketId,
		//rbacEnd
	})

	return {
		rbacHooks,
		addCallback,
		clickFunCallback,
		deleteCallback,
		useRbacFilterTree,
		changeCompanyForm,
		returnTitle,
		updateOrganization,
		getCurrentNodeData,
		getNodeById,
		getData,
		removeNode,
		//form start
		title,
		topLevelId,
		useSuperId,
		firstTreeId,
		//formend

		//rbacStart
		isShow,
		form,
		id,
		centerObj,
		mainFormData,
		formItemList,
		workflow_id,
		transition,
		column_size,
		rules,
		ruleFormRef,
		isState,
		ids,
		isReturn,
		injectionForm,
		ticketId,
		//rbacEnd
	}
}

export function otherTreeFun(treeRef, selectTreeList, checkParent = true) {
	//checkParent true 选中子级可以清空上级  false 选中子级不可清空上级
	const checkId = ref('')

	const checkChangeCover = (data, checked) => {
		console.log(111111111)

		if (!checkId.value) {
			checkId.value = data
			checkChange(data, checked)
		}
	}

	const checkChange = (data, checked) => {
		const addParentId = (data) => {
			const parentNode = treeRef.value?.getNode(data.parentId)
			if (parentNode) {
				if (selectTreeList.value.includes(data.parentId)) {
					addParentId(parentNode.data)
					return true
				} else {
					selectTreeList.value.push(data.parentId)
					addParentId(parentNode.data)
				}
			} else {
				return false
			}
		}
		if (checked) {
			selectTreeList.value.push(data.id)
			addParentId(data)
			const childrenList = useTools.flattenTreeData(data.children).map((item) => item.id)
			selectTreeList.value = [...new Set([...selectTreeList.value, ...childrenList])]
		} else {
			const childrenList = useTools.flattenTreeData([data]).map((item) => item.id)

			// if (checkParent) {
			// 	console.log(111111)

			// const childrenList = useTools.flattenTreeData([data]).map((item) => item.id)
			selectTreeList.value = selectTreeList.value.filter((item) => !childrenList.includes(item))
			// } else {
			// 	if (selectTreeList.value.some((item) => childrenList.includes(item))) {
			// 		treeRef.value?.setChecked(data.id, true)
			// 		return
			// 	} else {
			// 		selectTreeList.value = selectTreeList.value.filter((item) => !childrenList.includes(item))
			// 	}
			// }
		}

		treeRef.value?.setCheckedKeys(selectTreeList.value, true)
		nextTick(() => {
			checkId.value = null
		})
	}

	return checkChangeCover
}

import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getCurrentInstance, ref, nextTick, Ref } from 'vue'
import { saveflow, handleflow } from 'api/useCommon'
import * as echarts from 'echarts'
import {
	TypeForFlowEnmus,
	TypeForFlowReltadmeEnmus,
	TypeForFlowTodolistEnmus,
	TypeForFlowDatasubmitEnmus,
	TypeForFlowSubmitSearchEnmus,
} from '@/enums/WorkflowType'

/**
 * function for scroll
 * @param {string} name
 * @param {Array} boxList
 * @param {Ref<string>} activeName
 */
function scrollCom(name: string, boxList, activeName: Ref<string>) {
	//滚动到某个id
	const toIds = (val) => {
		// console.log(val.props.name, "val", activeName.value);
		document.getElementById(val.props.name).scrollIntoView({
			block: 'start',
			behavior: 'smooth',
		})
	}

	const scrollFun = () => {
		const scrollTop = document.getElementById(name).scrollTop
		const heightList = []
		// 获取右侧每个盒子距离顶部的高度
		let firstTop
		boxList.forEach((item, i) => {
			if (i == 0) {
				firstTop = document.getElementById(item).offsetTop
			}
			const useHeight = document.getElementById(item).offsetTop - firstTop
			heightList.push({
				height: useHeight,
				id: item,
			})
		})

		heightList.forEach((item, index) => {
			if (index == 0) {
				if (scrollTop <= item.height && scrollTop >= 0) {
					activeName.value = item.id
				}
			} else if (index < heightList.length - 1) {
				if (scrollTop > item.height && scrollTop < heightList[index + 1].height) {
					activeName.value = item.id
				}
			} else {
				if (scrollTop > item.height) {
					activeName.value = item.id
				}
			}
		})
	}

	//开启滚动
	const openInit = () => {
		document.getElementById(name).addEventListener('scroll', scrollFun, true)
	}

	//销毁滚动
	const destoryInit = () => {
		document.getElementById(name).removeEventListener('scroll', scrollFun)
	}

	return { scrollFun, toIds, destoryInit, openInit }
}

function submitCom(mainFormData, closeFun, saveUrl, isCallback) {
	const myCloseFun = closeFun
	// console.log(myCloseFun)

	const commonSubmit = async (form, isCurSave = false, callback = null) => {
		// console.log(form)
		// saveflow, handleflow
		let useUrl = saveUrl
		if (isCurSave) {
			useUrl = saveflow
		}

		const backVal = await useUrl(form).then((res) => {
			if (res.code == 1) {
				ElMessage({
					message: '操作成功',
					type: 'success',
				})

				const returnVal = isCallback ? res.data : null
				// console.log(returnVal, 'returnVal', myCloseFun)

				myCloseFun(returnVal)
				if (callback) {
					callback({ ...res.data, ...form })
					// callback({ resData: res.data, form })
				}
				// closeDrawer()
				// emits('getList')

				return true
			} else {
				ElMessage.error(`保存失败:${res.msg}`)
			}
		})
		console.log('submit!', backVal)

		return backVal
	}
	//提交申请
	const onSubmitValidate = async (
		formEl: FormInstance | undefined,
		callback: (item: any) => void,
		item,
		domClass = '.scrollClass',
		scrollDomClass = '.is-error'
	) => {
		console.log(formEl)

		if (!formEl) return
		const returnBack = await formEl.validate((valid, fields) => {
			if (valid) {
				return callback(item)
			} else {
				console.log('error submit!', fields)
			}
		})

		return returnBack
	}

	return { commonSubmit, onSubmitValidate, myCloseFun }
}

/**
 * function for table of index
 * @param {number} index
 * @param {Object} getPa
 */
const indexMethodCom = (index, getPa) => {
	if (getPa) {
		return getPa.pageSize * (getPa.currentPage - 1) + index + 1
	} else {
		return index + 1
	}
}

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
}

const getCookieInternalData = () => {
	const internalInstance = getCurrentInstance()
	const internalData = internalInstance.appContext.config.globalProperties
	return internalData
}

/**
 * function for pagenation
 * @param {Array} pageList
 * @param {number} pageSize
 * @param {number} useKey
 */
function sxPagenationSelf(pageList: any[], pageSize = 10, useKey: number = null) {
	const page = ref<number>(1)
	const useList = ref<any[]>([])
	const totalPage = ref<number>(null)
	const isNew = ref<boolean>(false)
	totalPage.value = Math.ceil(pageList.length / pageSize)
	console.log(pageList, pageSize, page, useKey, 'useKey')

	const getPageList = (usePage = 1, callBack: () => void | null = null) => {
		if (page.value == usePage && !isNew.value) return
		page.value = usePage
		useList.value = pageList.slice((page.value - 1) * pageSize, page.value * pageSize)
		callBack && callBack()
		isNew.value = false
		// console.log(page, useList, totalPage)
	}
	if (!useKey && useKey != 0) {
		isNew.value = true
		getPageList()
	} else {
		isNew.value = true
		pageList.some((item, index) => {
			const isTrue = item.id == useKey
			if (isTrue) {
				const usePage = Math.ceil((index + 1) / pageSize)
				console.log(usePage, 'usePage')

				getPageList(usePage)
			}
			return isTrue
		})
	}
	console.log(page, 'page')
	return { getPageList, page, useList, totalPage }
}

const hasWorkflowId = (id: number, type: number = null) => {
	let useEnums
	if (!type) {
		useEnums = TypeForFlowEnmus
	} else {
		//待办 1
		if (type == 1) {
			useEnums = TypeForFlowTodolistEnmus
		} else if (type == 2) {
			//相关 2
			useEnums = TypeForFlowReltadmeEnmus
		} else if (type == 3) {
			//数据填报 3
			useEnums = TypeForFlowDatasubmitEnmus
		} else if (type == 4) {
			//数据填报 3
			useEnums = TypeForFlowSubmitSearchEnmus
		}
	}
	const isHasType = Object.hasOwnProperty.call(useEnums, 'w' + id)
	if (isHasType) {
		return {
			isHasType,
			url: useEnums['w' + id],
		}
	} else {
		return {
			isHasType,
		}
	}
}

const yesAndNo = [
	{
		id: 1,
		name: '是',
	},
	{
		id: 0,
		name: '否',
	},
]

const findKeyByValue = (obj, value) => {
	for (const [key, val] of Object.entries(obj)) {
		if (val === value) {
			return key
		}
	}
	return undefined
}

const tableHeaderFun = (a, b, k: string = null) => {
	const curHeader = ref([]) //原始表头
	const useHeader = ref([]) //实际使用表头
	const willCheckHeader = ref([]) //额外表头列表
	const checkedHeader = ref([]) //选中的额外表头
	const checkAll = ref(false) //是否全选
	const isIndeterminate = ref(false) //全选框状态
	const isPopover = ref(false) //是否展开更多
	const centerCheckHeader = ref([]) //临时选中的
	const useKey = ref('value')

	const init = () => {
		curHeader.value = a
		useHeader.value = a
		willCheckHeader.value = b
		console.log(willCheckHeader.value, 'willCheckHeader')
		if (k) {
			useKey.value = k
		}
	}
	const checkHeaderFun = () => {
		// checkedHeader.value =
		const centerData = []
		willCheckHeader.value.forEach((item) => {
			const isHas = centerCheckHeader.value.includes(item[useKey.value])
			if (isHas) {
				centerData.push(item)
			}
		})
		checkedHeader.value = centerData
		useHeader.value = [...curHeader.value, ...checkedHeader.value]
		console.log(useHeader.value, 'useHeader.value')
	}

	const checkAllHeader = () => {
		if (checkAll.value) {
			centerCheckHeader.value = willCheckHeader.value.map((item) => item[useKey.value])
		} else {
			centerCheckHeader.value = []
		}
		isIndeterminate.value = false
	}

	const checkCenterHeader = (val) => {
		centerCheckHeader.value = val
		checkAll.value = centerCheckHeader.value.length == willCheckHeader.value.length
		isIndeterminate.value = centerCheckHeader.value.length == willCheckHeader.value.length
	}

	const showPopover = () => {
		isPopover.value = !isPopover.value
	}

	init()

	return {
		checkHeaderFun,
		useHeader,
		checkAll,
		isIndeterminate,
		willCheckHeader,
		checkedHeader,
		showPopover,
		checkAllHeader,
		centerCheckHeader,
		checkCenterHeader,
	}
}

/**
 * function for echart
 * @param {string[]} nameList
 * @param {any} chartList
 * @param {any} optionList
 */
const chartUseFunction = (nameList: string[], chartList, optionList) => {
	const resizeEcharts = () => {
		nameList.forEach((name) => {
			chartList[name + 'Chart'].resize()
		})
	}

	const initCommonChart = () => {
		nameList.forEach((name) => {
			const commonDiv = document.getElementById(name)
			if (chartList[name + 'Chart'] != null) {
				chartList[name + 'Chart'].dispose()
			}
			chartList[name + 'Chart'] = echarts.init(commonDiv)
		})

		nextTick(() => {
			nameList.forEach((name) => {
				chartList[name + 'Chart'].setOption(optionList[name + 'Option'])
			})

			window.addEventListener('resize', resizeEcharts)
		})
	}

	const changeCommonChart = (name: 'lczs' | 'lcbj' | 'lcrd', option) => {
		chartList[name + 'Chart'].setOption(option)
	}

	const destroyChart = () => {
		nameList.forEach((name) => {
			chartList[name + 'Chart'].dispose()
			chartList[name + 'Chart'] = null
		})

		window.removeEventListener('resize', resizeEcharts)
	}
	return { initCommonChart, destroyChart, changeCommonChart }
}

const type2color = {
	warningList: [209, 334, 337],
	successList: [335, 404],
	primaryList: [208, 402, 403],
}

export {
	scrollCom,
	submitCom,
	indexMethodCom,
	resetForm,
	getCookieInternalData,
	sxPagenationSelf,
	hasWorkflowId,
	yesAndNo,
	findKeyByValue,
	tableHeaderFun,
	chartUseFunction,
	type2color,
}

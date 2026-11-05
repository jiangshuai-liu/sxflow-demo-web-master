<template>
	<el-drawer
		v-model="isShow"
		direction="rtl"
		:before-close="handleClose"
		size="60%"
		modal-class="editModal"
	>
		<!-- append-to="section" -->
		<template #header>
			<div class="sxDrawerTitle">{{ props.title }}</div>
		</template>
		<el-form
			:model="mainFormData"
			label-width="150px"
			:rules="rules"
			ref="ruleFormRef"
			v-if="formItemList.length"
			class="scrollClass"
			:scroll-to-error="true"
		>
			<!-- label-position="top" -->

			<UseLowCode
				:form="form"
				v-model:mainFormData="mainFormData"
				:formItemList="formItemList"
			>
				<!-- :injectionForm="mainFormData" -->
				<template #test_subfield>
					<div id="test_subfield_container"></div>
				</template>
				<!-- <template #r_nid>
					<div class="commonId">
						<el-input
							v-model="mainFormData.r_nid"
							:disabled="!isDiy"
							style="width: 100%"
						/>
						<el-button
							type="primary"
							v-if="!isDiy"
							@click="changeDiy"
						>
							自定义编号
						</el-button>
						<el-button
							type="primary"
							v-else
						>
							检测
						</el-button>
					</div>
				</template> -->
			</UseLowCode>
		</el-form>

		<template #footer>
			<div
				class="saveBtn"
				v-if="formItemList.length"
			>
				<common-footer>
					<template #close>
						<el-button
							type="primary"
							color="#EBEDF0"
							@click="closeDrawer"
							>关闭</el-button
						>
					</template>
					<template #submit>
						<template v-if="!isState">
							<!-- <el-button
								type="primary"
								color="#EB423F"
								@click="onlySave()"
								v-if="showSave"
								>临时保存</el-button
							> -->
							<el-button
								v-for="item in transition"
								:key="item.transition_id"
								type="primary"
								color="#EB423F"
								@click="onSubmitValidate(ruleFormRef, onSubmit, item)"
							>
								{{ item.transition_name }}
							</el-button>
						</template>
					</template>
				</common-footer>
			</div>
		</template>
	</el-drawer>
</template>
<script setup lang="ts">
import { ref, provide, h, onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

import { ElMessageBox, ElMessage } from 'element-plus'
import { commonHook, commonFormFun } from '@bksx/sxflow'
import { submitCom, getCookieInternalData } from '@/utils/common'
import { initflow, saveflow, handleflow, deletefillingdatabyid } from 'api/useCommon'

let {
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
// console.log(isShow, 'isShow')

interface propsType {
	title: string
}

let isDiy = ref(false)

const changeDiy = () => {
	isDiy.value = !isDiy.value
}

const emits = defineEmits(['getList'])
const props = withDefaults(defineProps<Partial<propsType>>(), {
	title: '填报事项',
})

let commonSubmit
let onSubmitValidate
provide('workflow_id', workflow_id)
provide('isState', isState)
provide('transition', transition)
const handleClose = (done: () => void) => {
	closeDrawer()
	done()
	return
	ElMessageBox.confirm('Are you sure you want to close this?')
		.then(() => {
			done()
		})
		.catch(() => {})
}

let showSave = ref(false)
let useUrl = ref(saveflow)
const closeFun = () => {
	closeDrawer()
	emits('getList')
}

let openUseCallback
const open = (workflowId: number, intoMainFormData = {}, showsave: boolean = false, openCallback = null): void => {
	isShow.value = true
	showSave.value = showsave

	openUseCallback = openCallback
	const returnObj = submitCom(mainFormData, closeFun, useUrl.value, true)
	onSubmitValidate = returnObj.onSubmitValidate
	commonSubmit = returnObj.commonSubmit
	initflow({ name: '_w' + workflowId }).then((res) => {
		workflow_id.value = res.data.workflow_id

		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		transition.value = res.data.transition
		rules.value = commonForm.rulesq
		mainFormData.value = { ...commonForm.mainFormDatas, ...intoMainFormData }
		// console.log(mainFormData.value, 'mainFormData.value', intoMainFormData)

		formItemList.value = commonForm.formItemLists
		isState.value = commonForm.isState

		console.log(mainFormData.value, formItemList.value, form.value)
		// console.log(ruleFormRef.value, 'ruleFormRef')
	})
	setTimeout(() => {
		window._AMapSecurityConfig = {
			securityJsCode: 'e9b10a5331b6ecbd366d4e2fe166a162',
		}
		let mapLoader = AMapLoader.load({
			key: '748b1c82d5f0ba67de33e4348e87f3dd', // 申请好的Web端开发者Key，首次调用 load 时必填
			version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
			plugins: ['AMap.Scale'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
		})
			.then((AMap) => {
				map = new AMap.Map('test_subfield_container', {
					// 设置地图容器id
					viewMode: '3D', // 是否为3D地图模式
					zoom: 11, // 初始化地图级别
					center: [116.397428, 39.90923], // 初始化地图中心点位置
				})

				AMap.plugin('AMap.Geocoder', function () {
					var geocoder = new AMap.Geocoder({
						// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
						city: '010',
					})
					var marker = new AMap.Marker()
					geocoder.getLocation('北京市海淀区上地10街', function (status, result) {
						if (status === 'complete' && result.geocodes.length) {
							var lnglat = result.geocodes[0].location
							marker.setPosition(lnglat)
							map.add(marker)
							map.setFitView(marker)
						} else {
							console.log('根据地址查询位置失败')
						}
					})

					map.on('click', function (e) {
						let lnglat = e.lnglat
						var marker = new AMap.Marker(lnglat)
						marker.setPosition(lnglat)
						map.add(marker)
						map.setFitView(marker)
						geocoder.getAddress(lnglat, function (status, result) {
							if (status === 'complete' && result.regeocode) {
								var address = result.regeocode.formattedAddress
								console.log(result.regeocode, 'address')
							} else {
								console.log('根据经纬度查询地址失败')
							}
						})
					})
				})
			})
			.catch((e) => {
				console.log(e)
			})

		return

		//实例化地图
		var map = new BMapGL.Map('test_subfield_container')
		map.centerAndZoom(new BMapGL.Point(116.331398, 39.897445), 13)
		var geoc = new BMapGL.Geocoder()
		geoc.getPoint(
			'北京市海淀区上地10街',
			function (point) {
				if (point) {
					map.centerAndZoom(point, 16)
					map.addOverlay(new BMapGL.Marker(point, { title: '北京市海淀区上地10街' }))
				} else {
					alert('您选择的地址没有解析到结果！')
				}
			},
			'北京市'
		)
		map.addEventListener('click', function (e) {
			//清除地图上所有的覆盖物
			map.clearOverlays()
			console.log(e)
			var pt = e.latlng
			var marker = new BMapGL.Marker(new BMapGL.Point(pt.lng, pt.lat))
			map.addOverlay(marker)

			geoc.getLocation(pt, function (rs) {
				var addComp = rs.addressComponents
				ElMessage({
					message: h('div', null, [
						h('p', { style: 'line-height: 1; font-size: 14px' }, [
							h('span', null, '您选择的省是'),
							h('i', { style: 'color: teal' }, addComp.province),
						]),
						h('p', { style: 'line-height: 1; font-size: 14px' }, [h('span', null, '您选择的市是'), h('i', { style: 'color: teal' }, addComp.city)]),
						h('p', { style: 'line-height: 1; font-size: 14px' }, [
							h('span', null, '您选择的区是'),
							h('i', { style: 'color: teal' }, addComp.district),
						]),
						h('p', { style: 'line-height: 1; font-size: 14px' }, [
							h('span', null, '您选择的街道是'),
							h('i', { style: 'color: teal' }, addComp.street),
						]),
						h('p', { style: 'line-height: 1; font-size: 14px' }, [
							h('span', null, '您选择的门牌号是'),
							h('i', { style: 'color: teal' }, addComp.streetNumber),
						]),
						h('p', { style: 'line-height: 1; font-size: 14px' }, [h('span', null, '您选择的精度是'), h('i', { style: 'color: teal' }, pt.lng)]),
						h('p', { style: 'line-height: 1; font-size: 14px' }, [h('span', null, '您选择的纬度是'), h('i', { style: 'color: teal' }, pt.lat)]),
					]),
				})
				// ElMessage({
				// 	message:
				// 		addComp.province +
				// 		', ' +
				// 		addComp.city +
				// 		', ' +
				// 		addComp.district +
				// 		', ' +
				// 		addComp.street +
				// 		', ' +
				// 		addComp.streetNumber +
				// 		',' +
				// 		pt.lng +
				// 		',' +
				// 		pt.lat,
				// 	type: 'success',
				// })
				console.log(
					addComp.province +
						', ' +
						addComp.city +
						', ' +
						addComp.district +
						', ' +
						addComp.street +
						', ' +
						addComp.streetNumber +
						',' +
						pt.lng +
						',' +
						pt.lat
				)
			})
		})
	}, 2000)
}
const closeDrawer = () => {
	transition.value = []
	rules.value = {}
	mainFormData.value = {}
	formItemList.value = []
	ids.value = []
	// form.value = {}
	isState.value = false
	showSave.value = false
	isShow.value = false
	isDiy.value = false
}

const onSubmit = (item) => {
	let form = {
		workflow_id: workflow_id.value,
		transition_id: Number(item.transition_id),
		...mainFormData.value,
	}
	// console.log(form, 'form')
	// return
	commonSubmit(form, false, openUseCallback)
}

const onlySave = () => {
	let form = {
		workflow_id: workflow_id.value,
		transition_id: 0,
		...mainFormData.value,
		staging: true,
	}
	commonSubmit(form, false, openUseCallback)
}

defineExpose({
	open,
})
</script>
<style lang="scss" scoped>
.commonId {
	display: flex;
	width: 100%;

	.el-button {
		margin-left: 10px;
	}
}

#test_subfield_container {
	width: 600px;
	height: 300px;
}
</style>

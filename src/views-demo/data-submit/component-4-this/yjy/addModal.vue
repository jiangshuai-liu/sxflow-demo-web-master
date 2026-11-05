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
			<div class="sxDrawerTitle">{{ props.title }}一</div>
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
				<!-- <template #test_subfield>
					<div id="test_subfield_container"></div>
				</template> -->
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
			<!-- <div class="searchBox">
				<el-select
					v-model="searchAddress"
					filterable
					remote
					reserve-keyword
					placeholder="请选择"
					:remote-method="remoteMethod"
					:loading="loading"
					style="width: 300px"
					@change="changeJwd"
				>
					<el-option
						v-for="item in addressList"
						:key="item.adcode"
						:label="item.formattedAddress"
						:value="item.adcode"
					/>
				</el-select>
			</div>
			<div id="test_subfield_container"></div> -->
			<div
				class="map-box"
				v-if="isShow"
			>
				<div
					class="baidu-map"
					ref="gdMap"
					id="test_subfield_container"
				></div>
				<input
					type="text"
					class="serachinput"
					id="tipinput"
				/>
				<div id="outPutBox"></div>
			</div>
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
let marker, map, geocoder

let searchAddress = ref('')
let addressList = ref([])
let loading = ref(false)

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
}

let showSave = ref(false)
let useUrl = ref(saveflow)
const closeFun = () => {
	closeDrawer()
	emits('getList')
}

// 实例化点标记
function addMarker(position) {
	if (!marker) {
		marker = new AMap.Marker({
			// icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
			position,
			// offset: new AMap.Pixel(-13, -30),
		})
		marker.setMap(map)
		map.setFitView(marker)
	}
}

function showInfoClick(e) {
	let text = '您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ] 的位置单击了地图！'
	console.log(text, 'text')

	// document.querySelector('#text').innerText = text
}
const clearMarker = () => {
	if (marker) {
		marker.setMap(null)
		marker = null
	}
}

const changeJwd = () => {
	let lnglat = addressList.value.filter((item) => item.adcode == searchAddress.value)[0].location
	// result.geocodes[0].location
	clearMarker()
	addMarker([lnglat.lng, lnglat.lat])
	mainFormData.value.latitude = lnglat.lat
	mainFormData.value.longitude = lnglat.lng
}

const remoteMethod = (query: string) => {
	if (query) {
		loading.value = true
		geocoder.getLocation(query, function (status, result) {
			console.log(status, result, '搜索status, result')
			loading.value = false

			if (status === 'complete' && result.geocodes.length) {
				addressList.value = result.geocodes
			} else {
				console.log('根据地址查询位置失败')
			}
		})
		// addressList.value = list.value.filter((item) => {
		// 	return item.label.toLowerCase().includes(query.toLowerCase())
		// })
	} else {
		addressList.value = []
	}
}

const getAddress = () => {
	console.log(searchAddress.value, 'searchAddress.value,')

	geocoder.getLocation(searchAddress.value, function (status, result) {
		console.log(status, result, '搜索status, result')

		if (status === 'complete' && result.geocodes.length) {
			addressList.value = result.geocodes
			// let lnglat = result.geocodes[0].location
			// clearMarker()
			// addMarker([lnglat.lng, lnglat.lat])
			// mainFormData.value.latitude = lnglat.lat
			// mainFormData.value.longitude = lnglat.lng
		} else {
			console.log('根据地址查询位置失败')
		}
	})
}

let openUseCallback
const open = (workflowId: number, intoMainFormData = {}, showsave = false, openCallback = null): void => {
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
			securityJsCode: '3a66bdc5dbe7dca71979f6a2fc4e6c02',
		}
		let mapLoader = AMapLoader.load({
			key: 'b63d579d438edcbbc46845a42ad37b7d', // 申请好的Web端开发者Key，首次调用 load 时必填
			version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
			plugins: ['AMap.Scale', 'AMap.Marker', 'AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.InfoWindow'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
		})
			.then((AMap) => {
				map = new AMap.Map('test_subfield_container', {
					// 设置地图容器id
					viewMode: '3D', // 是否为3D地图模式
					zoom: 11, // 初始化地图级别
					center: [116.397428, 39.90923], // 初始化地图中心点位置
				})

				map.on('click', function (e) {
					console.log(e, '3333333333333333333333333333333333333333333')

					let lnglat = e.lnglat

					// console.log(lnglat, 'lnglat')
					// lat: 40.033389
					// lng: 116.311533
					clearMarker()
					addMarker([lnglat.lng, lnglat.lat])
					// var marker = new AMap.Marker(lnglat)
					// marker.setPosition(lnglat)
					// map.add(marker)
					// map.setFitView(marker)

					mainFormData.value.latitude = lnglat.lat
					mainFormData.value.longitude = lnglat.lng
				})

				let infoWindow = new AMap.InfoWindow({
					offset: new AMap.Pixel(0, -30),
				})
				//输入提示
				let auto = new AMap.AutoComplete({
					input: 'tipinput',
					output: 'outPutBox',
				})
				let placeSearch = new AMap.PlaceSearch({
					city: '010',
				}) //构造地点查询类
				auto.on('select', select) //注册监听，当选中某条记录时会触发
				function select(e) {
					console.log(e.poi)
					placeSearch.search(e.poi.name, function (status, result) {
						// 查询成功时，result即对应匹配的POI信息
						let pois = result.poiList.pois
						for (let i = 0; i < pois.length; i++) {
							let poi = pois[i]
							let marker = []
							marker[i] = new AMap.Marker({
								position: poi.location, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
								title: poi.name,
							})
							marker[i].content = `<h3>${poi.name}</h3><p>${poi.address}</p>`
							marker[i].on('click', markerClick)
							// 将创建的点标记添加到已有的地图实例：
							map.add(marker[i])
						}
						map.setFitView()
					})
				}
				function markerClick(e) {
					let position = e.target.getPosition()
					infoWindow.setContent(e.target.content)
					infoWindow.open(map, e.target.getPosition())
					mainFormData.value.latitude = position.lat
					mainFormData.value.longitude = position.lng
					clearMarker()
					// $emit('changeCenter', {
					// 	lng: position.lng,
					// 	lat: position.lat,
					// })
					// $emit('changeMapContent', e.target.content)
				}

				// if (mapContent) {
				// 	var marker = new AMap.Marker({
				// 		position: [center.lng, center.lat], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
				// 	})
				// 	marker.content = mapContent
				// 	marker.on('click', markerClick)
				// 	map.add(marker)
				// 	map.setFitView()
				// }
			})
			.catch((e) => {
				console.log(e)
			})
	}, 1000)
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
	map.destroy()
	map = null
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
	width: 100%;
	height: 500px;
}

.baidu-map {
	width: 100%;
	height: 400px;
}
.map-box {
	position: relative;
}
.serachinput {
	position: absolute;
	top: 0;
	left: 0;
	width: 300px;
	box-sizing: border-box;
	padding: 9px;
	border: 1px solid #dddee1;
	line-height: 20px;
	font-size: 16px;
	height: 38px;
	color: #333;
	border-radius: 4px;
	outline: none;
	z-index: 99;
}
#outPutBox {
	position: absolute;
	left: 0;
	top: 38px;
	z-index: 99;
	background: #fff;
	box-shadow: 0 0 10px 1px #ccc;
}
</style>

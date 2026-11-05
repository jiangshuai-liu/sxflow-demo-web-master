<template>
	<el-drawer
		v-model="isShow"
		direction="rtl"
		:before-close="handleClose"
		size="60%"
		modal-class="editModal"
	>
		<template #header>
			<div class="sxDrawerTitle">编辑事项</div>
		</template>

		<el-form
			:model="mainFormData"
			label-width="150px"
			:rules="rules"
			ref="ruleFormRef"
		>
			<UseLowCode
				:form="form"
				v-model:mainFormData="mainFormData"
				:formItemList="formItemList"
			/>

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

		<template
			#footer
			v-if="activeName == 'form'"
		>
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
							<el-button
								v-for="item in transition"
								:key="item.transition_id"
								type="primary"
								color="#EB423F"
								@click="onSubmitValidate(ruleFormRef, onSubmit, item)"
								>{{ item.transition_name }}</el-button
							>
						</template>
					</template>
				</common-footer>
			</div>
		</template>
	</el-drawer>
</template>
<script setup lang="ts">
import { ref, provide } from 'vue'
import { ElMessageBox } from 'element-plus'
import AMapLoader from '@amap/amap-jsapi-loader'
import { commonHook, commonFormFun } from '@bksx/sxflow'
import { submitCom, getCookieInternalData } from '@/utils/common'
import { initflow, saveflow, handleflow, queryfillingdatabyid } from 'api/useCommon'
import type { TabsPaneContext } from 'element-plus'

let marker, map, geocoder

let searchAddress = ref('')
let addressList = ref([])
let loading = ref(false)
const activeName = ref('form')

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}

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
let commonSubmit
let onSubmitValidate
provide('workflow_id', workflow_id)
provide('isState', isState)
provide('transition', transition)
const handleClose = (done: () => void) => {
	closeDrawer()
	done()
}
const emits = defineEmits(['getList'])
let useUrl = ref(saveflow)
const closeFun = () => {
	closeDrawer()
	emits('getList')
}
const open = ({ workflowId, useId }: { workflowId: number; useId: number }): void => {
	console.log('open', workflowId, useId)
	isShow.value = true
	const returnObj = submitCom(mainFormData, closeFun, useUrl.value, true)
	onSubmitValidate = returnObj.onSubmitValidate
	commonSubmit = returnObj.commonSubmit
	initflow({ name: '_w' + workflowId, ids: [useId] }).then((res) => {
		console.log(res, 'queryfillingdatabyid')
		workflow_id.value = res.data.workflow_id
		id.value = useId
		ids.value = [useId]
		let commonForm = commonFormFun(formItemList, mainFormData, res.data, form, column_size)
		transition.value = res.data.transition
		rules.value = commonForm.rulesq
		mainFormData.value = commonForm.mainFormDatas
		formItemList.value = commonForm.formItemLists
		isState.value = commonForm.isState
		console.log(mainFormData.value, formItemList.value, form.value)

		console.log(ruleFormRef.value, 'ruleFormRef')
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

				console.log(map, 'map')

				addMarker([mainFormData.value.longitude, mainFormData.value.latitude])

				map.on('click', function (e) {
					let lnglat = e.lnglat

					console.log(lnglat, 'lnglat')
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
			})
			.catch((e) => {
				console.log(e)
			})
	}, 1000)
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
	} else {
		addressList.value = []
	}
}

const closeDrawer = () => {
	transition.value = []
	rules.value = {}
	mainFormData.value = {}
	formItemList.value = []
	ids.value = []
	id.value = ''
	isState.value = false
	isShow.value = false
	activeName.value = 'form'
	map.destroy()
	map = null
}

const onSubmit = (item) => {
	let form = {
		// ...centerObj.value,
		workflow_id: workflow_id.value,
		transition_id: Number(item.transition_id),
		...mainFormData.value,
		id: id.value,
		ids: ids.value.length > 0 ? ids.value : null,
	}
	console.log(centerObj.value, 'centerObj.value')
	console.log(mainFormData.value, 'mainFormData.value')

	commonSubmit(form)
}

defineExpose({
	open,
})
</script>
<style lang="scss" scoped>
.demo-tabs {
	height: 100%;

	border-top: 2px solid #e4e7ed;
	overflow: auto;
}
.el-tab-pane {
	min-height: 100%;
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

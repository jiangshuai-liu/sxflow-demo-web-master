<template>
	<div
		class="SxTag"
		:style="getTagStyle()"
	>
		<el-tooltip
			class="box-item"
			effect="dark"
			:content="checkName"
			placement="top"
		>
			<div>
				{{ checkName }}
			</div>
		</el-tooltip>
	</div>
</template>
<script setup lang="ts">
type colorObjType = {
	success?: string
	primary?: string
	warning?: string
	info?: string
}

type useListType = {
	successList?: number[]
	primaryList?: number[]
	warningList?: number[]
	infoList?: number[]
}

const { colorObj, typeUseList, checkId, checkName } = defineProps({
	colorObj: {
		type: Object as () => colorObjType,
		default: () => {
			return {
				success: '#21A898',
				primary: '#EB423F',
				warning: '#FF7700',
				info: '#1B84E7',
			}
		},
	},
	typeUseList: {
		type: Object as () => useListType,
		default: () => {
			return {
				successList: [],
				warningList: [],
				primaryList: [],
				infoList: [],
			}
		},
	},
	checkId: {
		type: [String, Number],
		default: '',
	},
	checkName: {
		type: String,
		default: '',
	},
})

function hexToRGBA(hex: string, alpha: string | number) {
	var r = parseInt(hex.substring(1, 3), 16)
	var g = parseInt(hex.substring(3, 5), 16)
	var b = parseInt(hex.substring(5, 7), 16)
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
}

const getUseTagStyle = (color: string): string => {
	return `background:${hexToRGBA(color, 0.15)};color:${color}`
}

const getTagStyle = (): string => {
	// console.log(checkId, typeUseList)
	if (typeUseList.primaryList && typeUseList.primaryList.includes(Number(checkId))) {
		return getUseTagStyle(colorObj.primary)
	} else if (typeUseList.successList && typeUseList.successList.includes(Number(checkId))) {
		return getUseTagStyle(colorObj.success)
	} else if (typeUseList.warningList && typeUseList.warningList.includes(Number(checkId))) {
		return getUseTagStyle(colorObj.warning)
	} else if (typeUseList.infoList && typeUseList.infoList.includes(Number(checkId))) {
		return getUseTagStyle(colorObj.info)
	} else {
		return getUseTagStyle(colorObj.info)
	}
}
</script>
<style lang="scss">
.SxTag {
	display: inline-block;
	max-width: 100%;
	width: auto;
	height: 30px;
	padding: 4px 12px;
	text-align: center;
	box-sizing: border-box;
	border-radius: 4px;

	font-family: Microsoft YaHei UI, Microsoft YaHei UI;
	font-weight: 400;
	font-size: 14px;
	div {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>

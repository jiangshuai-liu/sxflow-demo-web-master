<template>
	<div
		:class="classObj"
		class="app-wrapper"
	>
		<div
			v-if="device === 'mobile' && sidebar.opened"
			class="drawer-bg"
			@click="handleClickOutside"
		/>

		<Sidebar class="sidebar-container" />
		<div class="main-container">
			<com-nav />
			<!--主页面-->
			<app-main />
		</div>
		<div
			v-if="showAi == true"
			class="aiBtn"
			@click="changeAi"
		></div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { AppMain, ComNav } from './components/index'
import Sidebar from './components/Sidebar/index.vue'

import useStore from '@/store'

const { width } = useWindowSize()
const WIDTH = 992
let showAi = ref(false)
const { app } = useStore()

const sidebar = computed(() => app.sidebar)
const device = computed(() => app.device)

const classObj = computed(() => ({
	hideSidebar: !sidebar.value.opened,
	openSidebar: sidebar.value.opened,
	withoutAnimation: sidebar.value.withoutAnimation,
	// mobile: device.value === "mobile",
}))

watchEffect(() => {
	if (width.value < WIDTH) {
		app.toggleDevice('mobile')
		app.closeSideBar(true)
	} else {
		app.toggleDevice('desktop')
	}

	showAi.value = import.meta.env.VITE_APP_AI
})

function handleClickOutside() {
	app.closeSideBar(false)
}

const changeAi = () => {
	// noAi.value = !noAi.value
	app.changeAi()
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.module.scss';

.app-wrapper {
	@include clearfix;
	& {
		position: relative;
		height: 100%;
		width: 100%;
	}
	&.mobile.openSidebar {
		position: fixed;
		top: 0;
	}
}

.drawer-bg {
	background: #000;
	opacity: 0.3;
	width: 100%;
	top: 0;
	height: 100%;
	position: absolute;
	z-index: 999;
}

.fixed-header {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 9;
	width: calc(100% - #{$sideBarWidth});
	transition: width 0.28s;
}

.hideSidebar .fixed-header {
	width: calc(100% - 200px);
}

.mobile .fixed-header {
	width: 100%;
}

.sidebar-container {
	// background-image: url(../assets/menu_bg.png);
	background-size: 240px 360px;
	background-repeat: no-repeat;
	background-position: 100% 100%;
	width: 100%;
	height: 100%;
}
</style>

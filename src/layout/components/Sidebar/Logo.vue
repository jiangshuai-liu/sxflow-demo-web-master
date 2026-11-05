<template>
	<div
		class="sidebar-logo-container"
		:class="{ collapse: collapse }"
	>
		<!-- <el-dropdown @command="handleCommand"> -->
		<div class="el-dropdown-link">
			<!-- <el-icon class="el-icon--right" size="24">
          <Expand />
        </el-icon> -->
			<div
				@click="app.toggleSidebar"
				:class="{ iconMenu: true, isRotate: app.sidebar.opened }"
			></div>
			<transition name="sidebarLogoFade">
				<router-link
					v-if="collapse"
					key="collapse"
					class="sidebar-logo-link"
					to="/workbench/workbenchs"
				>
					<!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
					<h1 class="sidebar-title">玲珑·业务定制平台</h1>
				</router-link>
				<router-link
					v-else
					key="expand"
					class="sidebar-logo-link"
					to="/workbench/workbenchs"
				>
					<!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
					<h1 class="sidebar-title">玲珑·业务定制平台</h1>
				</router-link>
			</transition>
		</div>
		<!-- <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="a">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
	</div>
</template>
<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { Expand } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'

const { app } = useStore()

const router = useRouter()
const props = defineProps({
	collapse: {
		type: Boolean,
		required: true,
	},
})

const state = reactive({
	isCollapse: props.collapse,
	logo: new URL(`../../../assets/index/titlePic.png`, import.meta.url).href,
})

const { logo } = toRefs(state)

const handleCommand = (command: string | number | object) => {
	if (command === 'a') {
		router.push('/login')
	}
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
	transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
	opacity: 0;
}

.sidebar-logo-container {
	position: relative;
	width: 100%;
	height: 64px;
	line-height: 64px;
	background: transparent;
	text-align: center;
	overflow: hidden;

	& .sidebar-logo-link {
		height: 100%;
		width: 100%;
		text-align: left;

		& .sidebar-logo {
			width: 145px;
			height: 37px;
			vertical-align: middle;
		}

		& .sidebar-title {
			display: inline-block;
			margin: 0;
			line-height: 64px;
			vertical-align: middle;
			margin-left: 12px;

			font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
			font-size: 20px;
			color: #303133;
		}
	}

	&.collapse {
		.sidebar-logo {
			margin-right: 0px;
		}
	}
}

.el-dropdown-link {
	display: flex;
	align-items: center;
	height: 64px;
}
.el-dropdown {
	width: 208px;
}
.iconMenu {
	background-image: url(../../../assets/index/ico_menu.png);
	background-size: 28px 28px;
	width: 28px;
	height: 28px;
	// margin-right: 10px;
	margin-left: 19px;
	flex-shrink: 0;
	transform: rotate(180deg);
	cursor: pointer;
}

.isRotate {
	transform: rotate(0deg);
}
</style>

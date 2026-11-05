<template>
	<div :class="{ 'has-logo': true }">
		<logo :collapse="isCollapse" />
		<!-- <p style="color: black; font-size: 16px">
			{{ variables }}
		</p> -->
		<!-- <p style="color: black; font-size: 16px">
			{{ activeMenu }}
		</p> -->
		<el-scrollbar>
			<el-menu
				popper-class="sxSlideBar"
				:default-active="activeMenu"
				:collapse="isCollapse"
				:unique-opened="false"
				:collapse-transition="false"
				mode="vertical"
			>
				<sidebar-item
					v-for="route in menuData"
					:item="route"
					:key="route.url"
					:base-path="route.url"
					:is-collapse="isCollapse"
				/>
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarItem from './SidebarItem.vue'
import Logo from './Logo.vue'
import variables from '@/styles/variables.module.scss'
import useStore from '@/store'
import { queryresources } from 'api/useCommon'

const { app } = useStore()

const route = useRoute()
const router = useRouter()
const isCollapse = computed(() => !app.sidebar.opened)

const activeMenu = computed(() => {
	const { meta, path } = route
	// if set path, the sidebar will highlight the path you set
	if (meta.activeMenu) {
		return meta.activeMenu as string
	} else {
		return path
	}
})
let menuData = ref([])
const getUrlAndIcon = (link) => {
	let linkList = link.split('?')
	let url = linkList[0]
	let icon
	if (linkList.length > 1) {
		icon = linkList[1].split('=')[1]
	}
	return {
		url,
		icon,
	}
}
queryresources({}).then((res) => {
	// app.setIsShr(false)
	let useData = res.data || []

	let useRoutes = getThisUrl(useData)

	menuData.value = useRoutes

	// if (useRoutes[0].url == '/workbench/workbenchs') {
	// 	app.setIsShr(true)
	// 	if (!$cookies.get('isLogin')) {
	// 		router.push('/workbench')
	// 		$cookies.set('isLogin', '1')
	// 	}
	// }
})

//递归获取路由
interface MenuItem {
	url: string
	icon?: string
	children?: MenuItem[]
	[key: string]: any
}

const getThisUrl = (data: any[]): MenuItem[] => {
	let ustRoute: MenuItem[] = []

	data.forEach((item) => {
		let { url, icon } = getUrlAndIcon(item.url)
		if (url) {
			if (item.children?.length > 0) {
				let children = getThisUrl(item.children)
				ustRoute.push({
					...item,
					url,
					icon,
					children,
				})
			} else {
				ustRoute.push({
					...item,
					url,
					icon,
					children: [],
				})
			}
		}
	})
	return ustRoute
}
// console.log(routes)
</script>
<style lang="scss" scope>
.has-logo {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>

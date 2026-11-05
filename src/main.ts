import { createApp, Directive } from 'vue'
import App from './App.vue'
import router from '@/router'
import pinia from '@/store/pinia' //引入
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import 'element-plus/theme-chalk/index.css'
import 'element-plus/dist/index.css'
import VueCookies from 'vue-cookies'
import CommonEmpty from 'coms/common/CommonEmpty.vue'
import CommonFooter from 'coms/common/CommonFooter.vue'
import ComPagination from 'coms/common/ComPagination.vue'
import SxTag from 'coms/common/SxTag.vue'
import UseBabelComponents from 'usebabelcomponents'
import PrdAiCom from 'prd-ai-coms'
import 'prd-ai-coms/lib/style.css'
import sxflow from '@bksx/sxflow'
import { deleAxios } from '@bksx/sxflow'
import '@bksx/sxflow/style.css'
import request from '@/utils/request'

import '@/permission'

// 引入svg注册脚本
import 'virtual:svg-icons-register'

// 国际化
import i18n from '@/lang/index'

// 自定义样式
import '@/styles/index.scss'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

const useDeleAxios = new deleAxios()

useDeleAxios.initService(request)
useDeleAxios.initAxiosPrefix(import.meta.env.VITE_APP_BASE_API)

app.config.globalProperties.$cookies = VueCookies as any

// 注册全局组件
app
	.use(pinia)
	.use(router)
	.use(ElementPlus, {
		locale: zhCn,
	})
	.use(i18n)
	.use(UseBabelComponents)
	.use(sxflow)
	.use(PrdAiCom)
	.component('CommonEmpty', CommonEmpty)
	.component('ComPagination', ComPagination)
	.component('CommonFooter', CommonFooter)
	.component('SxTag', SxTag)
	.mount('#demoApp')

// // 卸载应用
// window.unmount = () => {
// 	app.unmount()
// }

// console.log(window, 'sonAppData', window.microApp.getData())

// // const cookies = window.microApp.getData().cookies
// // document.cookie = cookies

// // console.dir(document)

// // 获取主应用传递的 cookie
// const cookies = window.microApp.getData().cookies
// // 设置到子应用的 document.cookie
// document.cookie = cookies
// console.log(document.cookie, 'document.cookie')

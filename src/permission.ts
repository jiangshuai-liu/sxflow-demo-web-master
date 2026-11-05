import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false }) // 进度环显示/隐藏
// 白名单路由

router.beforeEach(async (to, from, next) => {
	if (to.meta.title) {
		document.title = `玲珑·业务定制平台`
	}
	NProgress.start()
	next()
	NProgress.done()
})

router.afterEach(() => {
	NProgress.done()
})

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import useStore from '@/store'

export const Layout = () => import('@/layout/index.vue')

// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
	{
		path: '/redirect',
		component: Layout,
		meta: { hidden: true },
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('@/views-demo/redirect/index.vue'),
			},
		],
	},
	{
		path: '/:carchAll(.*)',
		component: () => import('@/views-demo/error-page/404.vue'),
		meta: { hidden: true },
	},

	{
		path: '/',
		redirect: '/login',
		children: [
			{
				path: 'login',
				component: () => import('@/views-demo/login/index.vue'),
				name: 'login',
				meta: { title: '登录', icon: 'deploymentunits', hidden: true, keepAlive: true },
			},
			{
				path: 'logins',
				component: () => import('@/views-demo/login/indexbzf.vue'),
				name: 'loginbzf',
				meta: { title: '登录', icon: 'deploymentunits', hidden: true, keepAlive: true },
			},
			{
				path: 'loginfma',
				component: () => import('@/views-demo/login-fma/index.vue'),
				name: 'loginfma',
				meta: { title: '登录', icon: 'deploymentunits', hidden: true, keepAlive: true },
			},
			{
				path: 'loginyzm',
				component: () => import('@/views-demo/login-yzm/index.vue'),
				name: 'loginyzm',
				meta: { title: '登录', icon: 'deploymentunits', hidden: true, keepAlive: true },
			},
			{
				path: 'loginphone',
				component: () => import('@/views-demo/login-phone/index.vue'),
				name: 'loginphone',
				meta: { title: '登录', icon: 'deploymentunits', hidden: true, keepAlive: true },
			},

			{
				path: 'bzfdp',
				component: () => import('@/views-demo/bzfdp/index.vue'),
				name: 'bzfdp',
				meta: { title: '白纸坊大屏', icon: 'deploymentunits', hidden: true, keepAlive: true },
			},
		],
	},
	{
		path: '/workbench',
		component: Layout,
		redirect: '/workbench/workbenchs',
		name: 'workbench',
		meta: { title: '工作台', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: true },
		children: [
			{
				path: 'workbenchs',
				component: () => import('@/views-demo/workbench/index.vue'),
				name: 'workbenchs',
				redirect: '/workbench/workbenchs/commonpage/useid',
				meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true },
				children: [
					{
						path: 'commonpage/:id',
						component: () => import('@/views-demo/workbench/diy-page/common.vue'),
						name: 'commonPage',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/workbench/workbenchs' },
					},
					{
						path: 'sx',
						component: () => import('@/views-demo/workbench/diy-page/sx.vue'),
						name: 'sx',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/workbench/workbenchs' },
					},
					{
						path: 'cy',
						component: () => import('@/views-demo/workbench/diy-page/cy.vue'),
						name: 'cy',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/workbench/workbenchs' },
					},

					{
						path: 'gbsb',
						component: () => import('@/views-demo/workbench/diy-page/gbsb.vue'),
						name: 'gbsb',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/workbench/workbenchs' },
					},
				],
			},
		],
	},
	{
		path: '/datasubmit',
		component: Layout,
		redirect: '/datasubmit/datasubmits',
		name: 'datasubmit',
		meta: { title: '数据填报', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: false },
		children: [
			{
				path: 'datasubmits',
				component: () => import('@/views-demo/data-submit/index.vue'),
				name: 'datasubmits',
				redirect: '/datasubmit/datasubmits/commonPage/useid',
				meta: { title: '数据填报', icon: 'deploymentunits', hidden: false, keepAlive: false },
				children: [
					{
						path: 'commonPage/:id',
						component: () => import('@/views-demo/data-submit/diy-page/common.vue'),
						name: 'dscommonPage',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/datasubmit/datasubmits' },
					},
					{
						path: 'cj',
						component: () => import('@/views-demo/data-submit/diy-page/cj.vue'),
						name: 'dssx',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/datasubmit/datasubmits' },
					},
					{
						path: 'rbacDw',
						component: () => import('@/views-demo/data-submit/diy-page/rbacDw.vue'),
						name: 'rbacDw',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/datasubmit/datasubmits' },
					},
					{
						path: 'bzf',
						component: () => import('@/views-demo/data-submit/diy-page/bzf.vue'),
						name: 'bzf',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/datasubmit/datasubmits' },
					},
				],
			},
		],
	},
	{
		path: '/commonlist',
		component: Layout,
		redirect: '/commonlist/commonlists',
		name: 'commonlist',
		meta: { title: '数据填报', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: false },
		children: [
			{
				path: 'commonlists',
				component: () => import('@/views-demo/common-list/index.vue'),
				name: 'commonlists',
				redirect: '/commonlist/commonlists/commonPage/useid',
				meta: { title: '数据填报', icon: 'deploymentunits', hidden: false, keepAlive: false },
				children: [
					{
						path: 'commonPage/:id',
						component: () => import('@/views-demo/common-list/diy-page/common.vue'),
						name: 'dscommonPages',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/commonlist/commonlists' },
					},
					{
						path: 'cj',
						component: () => import('@/views-demo/common-list/diy-page/cj.vue'),
						name: 'dssxs',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/commonlist/commonlists' },
					},
					{
						path: 'rbacDw',
						component: () => import('@/views-demo/common-list/diy-page/rbacDw.vue'),
						name: 'rbacDws',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/commonlist/commonlists' },
					},
					{
						path: 'bzf',
						component: () => import('@/views-demo/common-list/diy-page/bzf.vue'),
						name: 'bzfs',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/commonlist/commonlists' },
					},
				],
			},
		],
	},
	{
		path: '/usermanage',
		component: Layout,
		redirect: '/usermanage/usermanages',
		name: 'usermanage',
		meta: { title: '人员管理', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: false },
		children: [
			{
				path: 'usermanages',
				component: () => import('@/views-demo/user-manage/index.vue'),
				name: 'usermanages',
				meta: { title: '人员管理', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
		],
	},
	{
		path: '/rbac',
		component: Layout,
		redirect: '/rbac/organization',
		name: 'rbac',
		meta: { title: '系统管理', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: false },
		children: [
			{
				path: 'organization',
				component: () => import('@/views-rbac/organization/index.vue'),
				name: 'organization',
				meta: { title: '组织机构', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'roletype',
				component: () => import('@/views-rbac/role-type/index.vue'),
				name: 'roletype',
				meta: { title: '角色管理', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'resouces',
				component: () => import('@/views-rbac/resouces/index.vue'),
				name: 'resouces',
				meta: { title: '资源管理', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'appinsert',
				component: () => import('@/views-rbac/app-insert/index.vue'),
				name: 'appinsert',
				meta: { title: '应用接入', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'securityadmin',
				component: () => import('@/views-rbac/security-admin/index.vue'),
				name: 'securityadmin',
				meta: { title: '安全管理员', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'chatpage',
				component: () => import('@/views-demo/chat-page/index.vue'),
				name: 'chatpage',
				meta: { title: 'lainchan', icon: 'deploymentunits', hidden: false, keepAlive: true },
			},
		],
	},

	{
		path: '/rbacs',
		redirect: '/rbacs/organization',
		name: 'rbacs',
		meta: { title: '系统管理', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: false },
		children: [
			{
				path: 'organization',
				component: () => import('@/views-rbac/organization/index.vue'),
				name: 'organizations',
				meta: { title: '组织机构', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'roletype',
				component: () => import('@/views-rbac/role-type/index.vue'),
				name: 'roletypes',
				meta: { title: '角色管理', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'resouces',
				component: () => import('@/views-rbac/resouces/index.vue'),
				name: 'resoucess',
				meta: { title: '资源管理', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'appinsert',
				component: () => import('@/views-rbac/app-insert/index.vue'),
				name: 'appinserts',
				meta: { title: '应用接入', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'securityadmin',
				component: () => import('@/views-rbac/security-admin/index.vue'),
				name: 'securityadmins',
				meta: { title: '安全管理员', icon: 'deploymentunits', hidden: false, keepAlive: false },
			},
			{
				path: 'chatpage',
				component: () => import('@/views-demo/chat-page/index.vue'),
				name: 'chatpages',
				meta: { title: 'lainchan', icon: 'deploymentunits', hidden: false, keepAlive: true },
			},
		],
	},

	{
		path: '/datasearch',
		component: Layout,
		// redirect: '/datasearch/todolist',
		name: 'datasearch',
		meta: { title: '综合查询', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: true },
		children: [
			{
				path: 'todolist',
				component: () => import('@/views-demo/data-search/todo-list/index.vue'),
				name: 'todolist',
				redirect: '/datasearch/todolist/commonPage/useid',
				meta: { title: '我的待办', icon: 'deploymentunits', hidden: false, keepAlive: true },
				children: [
					{
						path: 'commonPage/:id',
						component: () => import('@/views-demo/data-search/todo-list/diy-page/common.vue'),
						name: 'tocommonPage',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/todolist' },
					},
					{
						path: 'sx',
						component: () => import('@/views-demo/data-search/todo-list/diy-page/sx.vue'),
						name: 'tosx',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/todolist' },
					},
					{
						path: 'gbsb',
						component: () => import('@/views-demo/data-search/todo-list/diy-page/gbsb.vue'),
						name: 'tdgbsb',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/todolist' },
					},
					{
						path: 'cy',
						component: () => import('@/views-demo/data-search/todo-list/diy-page/cy.vue'),
						name: 'tdcy',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/todolist' },
					},
				],
			},
			{
				path: 'relatedme',
				component: () => import('@/views-demo/data-search/related-me/index.vue'),
				name: 'relatedme',
				redirect: '/datasearch/relatedme/commonPage/useid',
				meta: { title: '数据查询', icon: 'deploymentunits', hidden: true, keepAlive: true, activeMenu: '/datasearch/relatedme' },
				children: [
					{
						path: 'commonPage/:id',
						component: () => import('@/views-demo/data-search/related-me/diy-page/common.vue'),
						name: 'recommonPage',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/relatedme' },
					},

					{
						path: 'gbsb',
						component: () => import('@/views-demo/data-search/related-me/diy-page/gbsb.vue'),
						name: 'regbsb',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/relatedme' },
					},
					{
						path: 'sx',
						component: () => import('@/views-demo/data-search/related-me/diy-page/sx.vue'),
						name: 'resx',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/relatedme' },
					},

					{
						path: 'cy',
						component: () => import('@/views-demo/data-search/related-me/diy-page/cy.vue'),
						name: 'recy',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/relatedme' },
					},
				],
			},
			{
				path: 'submitsearch',
				component: () => import('@/views-demo/data-search/submit-search/index.vue'),
				name: 'submitsearch',
				redirect: '/datasearch/submitsearch/commonPage/useid',
				meta: { title: '填报查询', icon: 'deploymentunits', hidden: true, keepAlive: true, activeMenu: '/datasearch/submitsearch' },
				children: [
					{
						path: 'commonPage/:id',
						component: () => import('@/views-demo/data-search/submit-search/diy-page/commonCj.vue'),
						name: 'tbcommonPage',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/submitsearch' },
					},

					{
						path: 'cj',
						component: () => import('@/views-demo/data-search/submit-search/diy-page/cj.vue'),
						name: 'tbcj',
						meta: { title: '工作台', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/datasearch/submitsearch' },
					},
				],
			},
		],
	},
	{
		path: '/dashboard',
		component: Layout,
		redirect: '/dashboard/engineerboard',
		name: 'dashboard',
		meta: { title: '数据看板', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: true },
		children: [
			{
				path: 'engineerboard',
				component: () => import('@/views-demo/dashboard/Engineer.vue'),
				name: 'engineerboard',
				meta: { title: '数据看板', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/dashboard/engineerboard' },
			},
			{
				path: 'manageboard',
				component: () => import('@/views-demo/dashboard/Manage.vue'),
				name: 'manageboard',
				meta: { title: '数据看板', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/dashboard/manageboard' },
			},
		],
	},


  {
		path: '/datasetmanage',
		component: Layout,
		redirect: '/datasetmanage/datasetmanages',
		name: 'datasetmanage',
		meta: { title: '数据集管理', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: false },
		children: [
			{
				path: 'datasetmanages',
				component: () => import('@/views-demo/dataset-manage/index.vue'),
        name: 'datasetmanages',
        meta: { title: '数据集管理', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/datasetmanage/datasetmanages' },
			},
      {
				path: 'metadata',
				component: () => import('@/views-demo/dataset-manage/MetaData.vue'),
        name: 'metadata',
        meta: { title: '元数据管理', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/datasetmanage/datasetmanages' },
			},
      {
				path: 'datasetimport',
				component: () => import('@/views-demo/dataset-manage/import.vue'),
        name: 'datasetimport',
        meta: { title: '数据集导入', icon: 'deploymentunits', hidden: false, keepAlive: false, activeMenu: '/datasetmanage/datasetimport' },
			},
		],
	},
	// {
	// 	path: '/haha',
	// 	component: Layout,
	// 	redirect: '/haha/hahas',
	// 	name: 'haha',
	// 	meta: { title: '数据看板', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: true },
	// 	children: [
	// 		{
	// 			path: 'hahas',
	// 			component: () => import('@/views-rbac/table-text/index.vue'),
	// 			name: 'hahas',
	// 			meta: { title: '数据看板', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/haha/engineerboard' },
	// 		},
	// 	],
	// },
	// {
	// 	path: '/look',
	// 	component: Layout,
	// 	redirect: '/look/looks',
	// 	name: 'look',
	// 	meta: { title: '数据看板', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: true },
	// 	children: [
	// 		{
	// 			path: 'looks',
	// 			component: () => import('@/views-rbac/table-text/look.vue'),
	// 			name: 'looks',
	// 			meta: { title: '数据看板', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/look/engineerboard' },
	// 		},
	// 	],
	// },
	{
		path: '/commonroute',
		component: Layout,
		redirect: '/commonroute/commonroutes',
		name: 'commonroute',
		meta: { title: '公共页面', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: true },
		children: [
			{
				path: 'commonroutes',
				component: () => import('@/views-demo/common-route/index.vue'),
				name: 'commonroutes',
				meta: { title: '公共页面', icon: 'deploymentunits', hidden: false, keepAlive: true },
			},
		],
	},
	// {
	// 	path: '/tabletext',
	// 	component: Layout,
	// 	redirect: '/tabletext/tabletexts',
	// 	name: 'tabletext',
	// 	meta: { title: '数据看板', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: true },
	// 	children: [
	// 		{
	// 			path: 'tabletexts',
	// 			component: () => import('@/views-rbac/table-text/index.vue'),
	// 			name: 'tabletexts',
	// 			meta: { title: '数据看板', icon: 'deploymentunits', hidden: false, keepAlive: true, activeMenu: '/look/engineerboard' },
	// 		},
	// 	],
	// },

	{
		path: '/agent',
		component: Layout,
		redirect: '/agent/aichat',
		name: 'agent',
		meta: { title: '智能体', icon: 'icoagreementline', hidden: false, affix: true, keepAlive: true },
		children: [
			{
				path: 'aichat',
				component: () => import('@/views-demo/ai-chat-cover/index.vue'),
				name: 'aichat',
				meta: { title: '知识问答', icon: 'deploymentunits', hidden: false, keepAlive: true },
			},
			{
				path: 'aiword',
				component: () => import('@/views-demo/ai-word-cover/index.vue'),
				name: 'aiword',
				meta: { title: 'ai写文', icon: 'deploymentunits', hidden: false, keepAlive: true },
			},
			{
				path: 'aikeywords',
				component: () => import('@/views-demo/ai-keywords/index.vue'),
				name: 'aikeywords',
				meta: { title: '要素提取', icon: 'deploymentunits', hidden: false, keepAlive: true },
			},
		],
	},
	// {
	// 	path: '/textmd',
	// 	component: () => import('@/views-demo/text-md/index.vue'),
	// 	name: 'text-md',
	// 	meta: { title: '要素提取', icon: 'deploymentunits', hidden: false, keepAlive: true },
	// },
]

// 创建路由
const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes as RouteRecordRaw[],
	// 刷新时，滚动条位置还原
	scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.beforeEach((to, from, next) => {
	// console.log(to, from, window.history)
	// if (from.name) {
	//   // 清空历史记录
	//   window.history.length = 0;
	// }
	next() // 必须调用next()来resolve这个钩子
})

export default router
